"use strict";
const {Validator} = require("uu_appg01_server").Validation;
const {DaoFactory, ObjectStoreError} = require("uu_appg01_server").ObjectStore;
const {ValidationHelper} = require("uu_appg01_server").AppServer;
const {Profile, AppClientTokenService, UuAppWorkspace, UuAppWorkspaceError} = require("uu_appg01_server").Workspace;
const {UriBuilder} = require("uu_appg01_server").Uri;
const {LoggerFactory} = require("uu_appg01_server").Logging;
const {AppClient} = require("uu_appg01_server");
const Errors = require("../api/errors/item-error.js");
const {Dao, ValidatorService} = require("./config");

const WARNINGS = {
  initUnsupportedKeys: {
    code: `${Errors.List.UC_CODE}unsupportedKeys`,
  },
};

const logger = LoggerFactory.get("ItemAbl");

class ItemAbl {
  constructor() {
    this.validator = Validator.load();
  }

  async create(uri, dtoIn, session) {
    const awid = uri.getAwid();
    // HDS 1 - Validation of dtoIn.
    let validationResult = this.validator.validate("itemCreateDtoInType", dtoIn);
    // A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.initUnsupportedKeys.code,
      Errors.List.InvalidDtoIn
    );

    // HDS 2 - System checks existence and state of the todoInstance uuObject.
    await ValidatorService.todoInstanceCheck(awid)

    // HDS 3 - Expands dtoIn with the key "state: active".
    dtoIn.state = 'active';
    dtoIn.awid = awid;


    // HDS 4 - Verifies, that the list entered in dtoIn.listId exists (using list DAO get with awid and dtoIn.listId).
    if (dtoIn.listId) {
      const list = await Dao.list.get(awid, dtoIn.listId)
      if (list === null) {
        throw new Errors.Create.ListDoesNotExist({id: dtoIn.listId}, e);
      }
    }

    // HDS 5 - System creates uuObject item in uuAppObjectStore (using item DAO create).
    let createdList
    try {
      createdList = await Dao.item.create(dtoIn);
    } catch (e) {
      throw new Errors.Create.ItemDaoCreateFailed({uuAppErrorMap}, e);
    }

    // HDS 6 - Returns properly filled dtoOut.
    return {
      ...createdList,
      uuAppErrorMap: uuAppErrorMap,
    };
  }

  async get(uri, dtoIn, session) {
    const awid = uri.getAwid();
    // HDS 1 - Validation of dtoIn.
    let validationResult = this.validator.validate("itemGetDtoInType", dtoIn);
    // A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.initUnsupportedKeys.code,
      Errors.Get.InvalidDtoIn
    );

    // HDS 2 - System checks existence and state of the todoInstance uuObject.
    await ValidatorService.todoInstanceCheck(awid)

    // HDS 3 - System gets uuObject item from uuAppObjectStore (using item DAO get with awid and dtoIn.id).
    const item = await Dao.item.get(awid, dtoIn.id)
    if (item === null) {
      throw new Errors.Get.ItemDoesNotExist({id: dtoIn.id});
    }

    // HDS 3 - Returns properly filled dtoOut.
    return {...item, ...uuAppErrorMap};
  }

  async update(uri, dtoIn, session) {
    const awid = uri.getAwid();
    // HDS 1 - Validation of dtoIn.
    let validationResult = this.validator.validate("itemUpdateDtoInType", dtoIn);
    // A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.initUnsupportedKeys.code,
      Errors.List.InvalidDtoIn
    );

    // HDS 2 - System checks existence and state of the todoInstance uuObject.
    await ValidatorService.todoInstanceCheck(awid)

    // HDS 3 - Verifies, that the item exists and is in an active state (using item DAO get with awid and dtoIn.id). The result is saved as "item".
    const item = await Dao.item.get(awid, dtoIn.id)
    if (item == null) {
      throw new Errors.Create.ListDoesNotExist({id: dtoIn.id});
    }

    if (item.state !== 'active') {
      throw new Errors.Create.ItemIsNotInCorrectState({id: dtoIn.id, currentState: item.state, expectedState: 'active'});
    }

    // HDS 4 - System verifies, that the list entered in dtoIn.listId exists (using list DAO get with awid and dtoIn.listId).
    if (dtoIn.listId) {
      const list = await Dao.list.get(awid, dtoIn.listId)
      if (list === null) {
        throw new Errors.Create.ListDoesNotExist({id: dtoIn.listId});
      }
    }

    // HDS 5 - System updates uuObject item in the uuAppObjectStore.
    let updatedItem = {
      ...dtoIn,
      awid
    }
    try {
      updatedItem = await Dao.item.updateByAwid(updatedItem);
    } catch (e) {
      throw new Errors.Update.ListDaoUpdateFailed({uuAppErrorMap}, e);
    }

    // HDS 6 - Returns properly filled dtoOut.
    return {
      ...updatedItem,
      uuAppErrorMap: uuAppErrorMap,
    };
  }

  async setFinalState(uri, dtoIn, session) {
    const awid = uri.getAwid();
    // HDS 1 - Validation of dtoIn.
    let validationResult = this.validator.validate("itemSetFinalStateDtoInType", dtoIn);
    // A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.initUnsupportedKeys.code,
      Errors.SetFinalState.InvalidDtoIn
    );

    // HDS 2 - System checks existence and state of the todoInstance uuObject.
    await ValidatorService.todoInstanceCheck(awid)

    // HDS 3 - Verifies, that the item exists and is in an active state (using item DAO get with awid and dtoIn.id). The result is saved as "item".
    const item = await Dao.item.get(awid, dtoIn.id)
    if (item == null) {
      throw new Errors.SetFinalState.ItemDoesNotExist({id: dtoIn.id});
    }

    if (item.state !== 'active') {
      throw new Errors.SetFinalState.ItemIsNotInProperState({id: dtoIn.id, currentState: item.state, expectedState: 'active'});
    }

    // HDS 4 - System saves dtoIn to uuAppObjectStore (using item DAO setFinalState with awid and dtoIn). The result is saved to item.
    const updatedItem = await Dao.item.setFinalState(awid, dtoIn.id, dtoIn.state)

    // HDS 5 - Returns properly filled dtoOut.
    return {
      ...updatedItem,
      uuAppErrorMap: uuAppErrorMap,
    };
  }

  async delete(uri, dtoIn, session) {
    const awid = uri.getAwid();
    // HDS 1 - Validation of dtoIn.
    let validationResult = this.validator.validate("itemDeleteDtoInType", dtoIn);
    // A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.initUnsupportedKeys.code,
      Errors.List.InvalidDtoIn
    );

    // HDS 2 - System checks existence and state of the todoInstance uuObject.
    await ValidatorService.todoInstanceCheck(awid);

    // HDS 3 - System gets the uuObject item from the uuAppObjectStore and checks its existence (using item DAO get with awid and dtoIn.id) and state (only active or cancelled items can be deleted). The result is saved to item.
    const item = await Dao.item.get(awid, dtoIn.id)
    if (item === null) {
      throw new Errors.Delete.ListDoesNotExist({id: dtoIn.id});
    }

    if (item.state === 'completed') {
      throw new Errors.Delete.ItemIsNotInCorrectState({id: dtoIn.id, currentState: item.state, expectedStateList: ["active", "cancelled"]});
    }


    // HDS 3 - System deletes item from the uuAppObjectStore (using item DAO delete with awid and dtoIn.id).
    await Dao.item.remove(item)

    // HDS 4 - Returns properly filled dtoOut.
    return {...uuAppErrorMap};
  }

  async list(uri, dtoIn, session) {
    const awid = uri.getAwid();
    const pageInfo = {
      pageIndex: 0,
      pageSize: 1000,
      ...dtoIn.pageInfo
    }

    // HDS 1 - Validation of dtoIn.
    let validationResult = this.validator.validate("itemListDtoInType", dtoIn);
    // A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.initUnsupportedKeys.code,
      Errors.List.InvalidDtoIn
    );

    // HDS 2 - System checks existence and state of the todoInstance uuObject.
    await ValidatorService.todoInstanceCheck(awid)

    // HDS 3 - System gets uuObject list from uuAppObjectStore (using list DAO get with awid and dtoIn.id).
    let itemList;

    if (dtoIn.listId && dtoIn.state) {
      itemList = await Dao.item.listByListAndState(awid, dtoIn.listId, dtoIn.state, pageInfo)
    } else if(dtoIn.state) {
      itemList = await Dao.item.listByState(awid, dtoIn.state, pageInfo)
    } else {
      itemList = await Dao.item.list(awid, pageInfo)
    }


    // HDS 4 - Returns properly filled dtoOut.
    return {...itemList, ...uuAppErrorMap};
  }
}

module.exports = new ItemAbl();
