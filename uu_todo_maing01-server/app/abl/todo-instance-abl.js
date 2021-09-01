"use strict";
const {Validator} = require("uu_appg01_server").Validation;
const {DaoFactory, ObjectStoreError} = require("uu_appg01_server").ObjectStore;
const {ValidationHelper} = require("uu_appg01_server").AppServer;
const {Profile, AppClientTokenService, UuAppWorkspace, UuAppWorkspaceError} = require("uu_appg01_server").Workspace;
const {UriBuilder} = require("uu_appg01_server").Uri;
const {LoggerFactory} = require("uu_appg01_server").Logging;
const {AppClient} = require("uu_appg01_server");
const Errors = require("../api/errors/todo-instance-error.js");
const {Dao} = require("./config");

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
        throw new Errors.Init.SchemaDaoCreateSchemaFailed({uuAppErrorMap}, {schema}, e);
      }
    });
    await Promise.all(schemaCreateResults);


    if (dtoIn.uuAppProfileAuthorities) {
      try {
        await Profile.set(awid, "Authorities", dtoIn.uuAppProfileAuthorities);
      } catch (e) {
        if (e instanceof UuAppWorkspaceError) {
          // A4
          throw new Errors.Init.SetProfileFailed({uuAppErrorMap}, {role: dtoIn.uuAppProfileAuthorities}, e);
        }
        throw e;
      }
    }

    const newTodoInstance = {
      ...dtoIn,
      awid,
      state: "active",
    }

    let createdTodoInstance = {}
    try {
      createdTodoInstance = await Dao.todoInstance.create(newTodoInstance);
    } catch (e) {
      throw new Errors.Init.TodoInstanceCreateDaoFailed({uuAppErrorMap}, e);
    }

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
      throw new Errors.Load.TodoInstanceDoesNotExist({uuAppErrorMap}, e);
    }

    // HDS 2 - Loads all authorized profiles of the logged user from Use Case Context (authorizedProfileList).
    // HDS 3 - Returns properly filled dtoOut.
    return {
      authorizedProfileList: authorizationResult.getIdentityProfiles(),
      ...todoInstance
    };
  }
}

module.exports = new TodoInstanceAbl();
