"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory, ObjectStoreError } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { Profile, AppClientTokenService, UuAppWorkspace, UuAppWorkspaceError } = require("uu_appg01_server").Workspace;
const { UriBuilder } = require("uu_appg01_server").Uri;
const { LoggerFactory } = require("uu_appg01_server").Logging;
const { AppClient } = require("uu_appg01_server");
const Errors = require("../api/errors/todo-instance-error.js");
const { Dao, ValidatorService } = require("./config");

const WARNINGS = {
  initUnsupportedKeys: {
    code: `${Errors.Init.UC_CODE}unsupportedKeys`,
  },
};

const logger = LoggerFactory.get("TodoInstanceAbl");

class TodoInstanceAbl {
  constructor() {
    this.validator = Validator.load();
  }

  async init(uri, dtoIn, session) {
    const awid = uri.getAwid();
    // HDS 1
    let validationResult = this.validator.validate("sysUuAppWorkspaceInitDtoInType", dtoIn);
    // A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.initUnsupportedKeys.code,
      Errors.Init.InvalidDtoIn
    );

    // HDS 2 - Schema creation - for every schema (besides system ones) from the data storage creates schema using DAO createSchema (see list of schemas).
    const schemas = ["todoInstance", "list", "item"];
    let schemaCreateResults = schemas.map(async (schema) => {
      try {
        return await DaoFactory.getDao(schema).createSchema();
      } catch (e) {
        // A3
        throw new Errors.Init.SchemaDaoCreateSchemaFailed({ uuAppErrorMap }, { schema }, e);
      }
    });
    await Promise.all(schemaCreateResults);

    // HDS 3 - In the Authorities profile sets a role from dtoIn using uuCmd - sys/uuAppWorkspace/profile/set with dtoIn:
    if (dtoIn.uuAppProfileAuthorities) {
      try {
        await Profile.set(awid, "Authorities", dtoIn.uuAppProfileAuthorities);
      } catch (e) {
        if (e instanceof UuAppWorkspaceError) {
          // A4
          throw new Errors.Init.SetProfileFailed({ uuAppErrorMap }, { role: dtoIn.uuAppProfileAuthorities }, e);
        }
        throw e;
      }
    }

    // HDS 4 - System creates uuObject todoInstance (using todoInstance DAO create with dtoIn).
    // HDS 4.1 - System adds the following attributes to dtoIn: awid, state: "active"
    // and removes attribute uuAppProfileAuthorities from dtoIn.
    delete dtoIn.uuAppProfileAuthorities;

    const newTodoInstance = {
      ...dtoIn,
      awid,
      state: "active",
    };

    // HDS 4.2 - System tries to create the todoInstance uuObject.
    let createdTodoInstance = {};
    try {
      // HDS 4.2.A - System saves dtoIn to uuAppObjectStore (using todoInstance DAO create with dtoIn). The result is saved to todoInstance.
      createdTodoInstance = await Dao.todoInstance.create(newTodoInstance);
    } catch (e) {
      // HDS 4.2.B - System caught an exception during the creation of the uuObject todoInstance.
      throw new Errors.Init.TodoInstanceCreateDaoFailed({ uuAppErrorMap }, e);
    }

    // HDS 5 - Returns properly filled dtoOut.
    return {
      ...createdTodoInstance,
      uuAppErrorMap: uuAppErrorMap,
    };
  }

  async load(uri, dtoIn, session, authorizationResult) {
    const awid = uri.getAwid();

    // HDS 1 - System gets uuObject - todoInstance (using todoInstance DAO getByAwid). The result is saved to todoInstance.
    let todoInstance;
    try {
      todoInstance = await Dao.todoInstance.getByAwid(awid);
    } catch (e) {
      throw new Errors.Load.TodoInstanceDoesNotExist({ awid: awid }, e);
    }

    // HDS 2 - Loads all authorized profiles of the logged user from Use Case Context (authorizedProfileList).
    const authorizedProfileList = authorizationResult.getIdentityProfiles();

    // HDS 3 - Returns properly filled dtoOut.
    return {
      authorizedProfileList,
      ...todoInstance,
    };
  }

  async update(uri, dtoIn, session) {
    const awid = uri.getAwid();
    // HDS 1 - Validation of dtoIn.
    let validationResult = this.validator.validate("todoInstanceUpdateDtoInType", dtoIn);
    // A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.initUnsupportedKeys.code,
      Errors.Update.InvalidDtoIn
    );

    // HDS 2 - System checks existence and state of the todoInstance uuObject.
    const loadedTodoInstance = await ValidatorService.todoInstanceCheck(awid);

    // HDS 3 - System updates uuObject todoInstance in the uuAppObjectStore.
    const todoInstanceToUpdate = {
      awid,
      ...loadedTodoInstance,
      ...dtoIn,
    };

    let updatedTodoInstance = {};
    try {
      // HDS 3.1.A - System updates the uuObject todoInstance in the uuAppObjectStore (using todoInstance DAO updateByAwid with todoInstance and dtoIn).
      updatedTodoInstance = await Dao.todoInstance.updateByAwid(todoInstanceToUpdate);
    } catch (e) {
      // HDS 3.2.B - System caught an exception during the update of the uuObject todoInstance.
      throw new Errors.Update.TodoInstanceDaoUpdateByAwidFailed({ uuAppErrorMap }, e);
    }

    // HDS 4 - Returns properly filled dtoOut.
    return {
      ...updatedTodoInstance,
      uuAppErrorMap: uuAppErrorMap,
    };
  }

  async setState(uri, dtoIn, session) {
    const awid = uri.getAwid();
    // HDS 1 - Validation of dtoIn.
    let validationResult = this.validator.validate("todoInstanceSetStateDtoInType", dtoIn);
    // A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.initUnsupportedKeys.code,
      Errors.SetState.InvalidDtoIn
    );

    // HDS 2 - System checks existence and state of the todoInstance uuObject.
    const loadedTodoInstance = await ValidatorService.todoInstanceCheck(awid, ["active", "suspended"]);

    // HDS 3 - System updates uuObject todoInstance in the uuAppObjectStore.
    const todoInstanceToUpdate = {
      awid,
      ...loadedTodoInstance,
      ...dtoIn,
    };

    let updatedTodoInstance = {};
    try {
      // HDS 3.1.A - System updates the uuObject todoInstance in the uuAppObjectStore (using todoInstance DAO updateByAwid with todoInstance and dtoIn).
      updatedTodoInstance = await Dao.todoInstance.updateByAwid(todoInstanceToUpdate);
    } catch (e) {
      // HDS 3.2.B - System caught an exception during the update of the uuObject todoInstance.
      throw new Errors.Update.TodoInstanceDaoUpdateByAwidFailed({ uuAppErrorMap }, e);
    }

    // HDS 4 - Returns properly filled dtoOut.
    return {
      ...updatedTodoInstance,
      uuAppErrorMap: uuAppErrorMap,
    };
  }
}

module.exports = new TodoInstanceAbl();
