"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const Errors = require("../api/errors/list-error.js");
const { Dao, ValidatorService } = require("./config");

const WARNINGS = {
  createUnsupportedKeys: {
    code: `${Errors.Create.UC_CODE}unsupportedKeys`,
  },
  getUnsupportedKeys: {
    code: `${Errors.Get.UC_CODE}unsupportedKeys`,
  },
  updateUnsupportedKeys: {
    code: `${Errors.Get.UC_CODE}unsupportedKeys`,
  },

  deleteUnsupportedKeys: {
    code: `${Errors.Delete.UC_CODE}unsupportedKeys`,
  },
  listUnsupportedKeys: {
    code: `${Errors.List.UC_CODE}unsupportedKeys`,
  },
};

class ListAbl {
  constructor() {
    this.validator = Validator.load();
  }

  async create(uri, dtoIn) {
    const awid = uri.getAwid();
    // HDS 1 - Validation of dtoIn.
    let validationResult = this.validator.validate("listCreateDtoInType", dtoIn);
    // A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.createUnsupportedKeys.code,
      Errors.Create.InvalidDtoIn
    );

    // HDS 2 - System checks existence and state of the todoInstance uuObject.
    await ValidatorService.todoInstanceCheck(awid);

    // HDS 3 - System verifies that the inserted date is not from the past (it cannot be older than today's date).
    if (dtoIn.deadline && new Date(dtoIn.deadline) <= new Date()) {
      throw new Errors.Create.DeadlineDateIsFromThePast({ deadline: dtoIn.deadline });
    }

    let createdList = {
      ...dtoIn,
      awid,
    };
    try {
      createdList = await Dao.list.create(createdList);
    } catch (e) {
      throw new Errors.Create.ListDaoCreateFailed({ uuAppErrorMap }, e);
    }

    return {
      ...createdList,
      uuAppErrorMap: uuAppErrorMap,
    };
  }

  async get(uri, dtoIn) {
    const awid = uri.getAwid();
    // HDS 1 - Validation of dtoIn.
    let validationResult = this.validator.validate("listGetDtoInType", dtoIn);
    // A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.getUnsupportedKeys.code,
      Errors.Get.InvalidDtoIn
    );

    // HDS 2 - System checks existence and state of the todoInstance uuObject.
    await ValidatorService.todoInstanceCheck(awid);

    // HDS 3 - System gets uuObject list from uuAppObjectStore (using list DAO get with awid and dtoIn.id).
    const list = await Dao.list.get(awid, dtoIn.id);
    if (list === null) {
      throw new Errors.Get.ListDoesNotExist({ id: dtoIn.id });
    }

    // HDS 3 - Returns properly filled dtoOut.
    return { ...list, ...uuAppErrorMap };
  }

  async update(uri, dtoIn) {
    const awid = uri.getAwid();
    // HDS 1 - Validation of dtoIn.
    let validationResult = this.validator.validate("listUpdateDtoInType", dtoIn);
    // A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.updateUnsupportedKeys.code,
      Errors.Update.InvalidDtoIn
    );

    // HDS 2 - System checks existence and state of the todoInstance uuObject.
    await ValidatorService.todoInstanceCheck(awid);

    // HDS 3 - System verifies that the inserted date is not from the past (it cannot be older than today's date).
    if (dtoIn.deadline && new Date(dtoIn.deadline) <= new Date()) {
      throw new Errors.Update.DeadlineDateIsFromThePast({ deadline: dtoIn.deadline });
    }

    let updatedList = {
      ...dtoIn,
      awid,
    };
    try {
      updatedList = await Dao.list.updateByAwid(updatedList);
    } catch (e) {
      throw new Errors.Update.ListDaoUpdateFailed({ uuAppErrorMap }, e);
    }

    return {
      ...updatedList,
      uuAppErrorMap: uuAppErrorMap,
    };
  }

  async delete(uri, dtoIn) {
    const awid = uri.getAwid();
    // HDS 1 - Validation of dtoIn.
    let validationResult = this.validator.validate("listDeleteDtoInType", dtoIn);
    // A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.deleteUnsupportedKeys.code,
      Errors.Delete.InvalidDtoIn
    );

    // HDS 2 - System checks existence and state of the todoInstance uuObject.
    await ValidatorService.todoInstanceCheck(awid);

    // HDS 3 - System gets the uuObject list from the uuAppObjectStore and checks its existence (using list DAO get with awid and dtoIn.id).
    const list = await Dao.list.get(awid, dtoIn.id);
    if (list === null) {
      throw new Errors.Delete.ListDoesNotExist({ id: dtoIn.id });
    }

    // HDS 4 - System loads all active items related to the list (using item DAO listByListAndState, where listId = dtoIn.id and state = active) and verifies that count of active items in the list is 0.
    const activeItemsByList = await Dao.item.listByListAndState(awid, dtoIn.id, "active");
    if (!dtoIn.forceDelete) {
      if (activeItemsByList.itemList.length > 0) {
        throw new Errors.Delete.ListContainsActiveItems({
          id: dtoIn.id,
          itemList: activeItemsByList.itemList,
        });
      }
    }

    // HDS 5 - System deletes all item uuObjects in the list from uuAppObjectStore (using item DAO deleteManyByListId with awid and dtoIn.id).
    const itemIdListToDelete = activeItemsByList.itemList.map((item) => item.id);
    await Dao.item.deleteManyByListId(awid, itemIdListToDelete);

    // HDS 6 - System deletes list from the uuAppObjectStore (using list DAO delete with awid and dtoIn.id).
    await Dao.list.remove(list);

    // HDS 7 - Returns properly filled dtoOut.
    let dtoOut = {};
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }

  async list(uri, dtoIn) {
    const awid = uri.getAwid();
    dtoIn.pageInfo = {
      pageIndex: 0,
      pageSize: 500,
      ...dtoIn.pageInfo,
    };

    // HDS 1 - Validation of dtoIn.
    let validationResult = this.validator.validate("listListDtoInType", dtoIn);
    // A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.listUnsupportedKeys.code,
      Errors.List.InvalidDtoIn
    );

    // HDS 2 - System checks existence and state of the todoInstance uuObject.
    await ValidatorService.todoInstanceCheck(awid);

    // HDS 3 - System gets uuObject list from uuAppObjectStore (using list DAO get with awid and dtoIn.id).
    const dtoOut = await Dao.list.list(awid, dtoIn.pageInfo);

    // HDS 4 - Returns properly filled dtoOut.
    dtoOut.uuAppErrorMap = uuAppErrorMap;
    return dtoOut;
  }
}

module.exports = new ListAbl();
