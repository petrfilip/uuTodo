"use strict";
const TodoUseCaseError = require("./todo-use-case-error.js");


const Create = {
  UC_CODE: `${TodoUseCaseError.ERROR_PREFIX}create/`,

  InvalidDtoIn: class extends TodoUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  ListDoesNotExist: class extends TodoUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}listDoesNotExist`;
      this.message = "List with given id does not exist.";
    }
  },

  ItemDaoCreateFailed: class extends TodoUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}itemDaoCreateFailed`;
      this.message = "Creating item by item DAO create failed.";
    }
  },


};

const Get = {
  UC_CODE: `${TodoUseCaseError.ERROR_PREFIX}get/`,

  ItemDoesNotExist: class extends TodoUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}itemDoesNotExist`;
      this.message = "Item with given id does not exist.";
    }
  },
};

const Delete = {
  UC_CODE: `${TodoUseCaseError.ERROR_PREFIX}delete/`,

  ListContainsActiveItems: class extends TodoUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}listContainsActiveItems`;
      this.message = "List with active items can not be deleted.";
    }
  },

  ListDoesNotExist: class extends TodoUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}listDoesNotExist`;
      this.message = "List with given id does not exist.";
    }
  },

  ItemIsNotInCorrectState: class extends TodoUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Delete.UC_CODE}itemIsNotInCorrectState`;
      this.message = "Item is not in correct state.";
    }
  },
};

const List = {
  UC_CODE: `${TodoUseCaseError.ERROR_PREFIX}list/`,

  InvalidDtoIn: class extends TodoUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${List.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
};

const Update = {
  UC_CODE: `${TodoUseCaseError.ERROR_PREFIX}update/`,

  InvalidDtoIn: class extends TodoUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  DeadlineDateIsFromThePast: class extends TodoUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}deadlineDateIsFromThePast`;
      this.message = "Deadline date is from the past and therefore cannot be met.";
    }
  },

  ListDaoUpdateFailed: class extends TodoUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}listDaoUpdateFailed`;
      this.message = "Update list by list DAO update failed.";
    }
  },

  ItemIsNotInCorrectState: class extends TodoUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}itemIsNotInCorrectState`;
      this.message = "Item is not in correct state.";
    }
  },
};

const SetFinalState = {
  UC_CODE: `${TodoUseCaseError.ERROR_PREFIX}setFinalState/`,

  InvalidDtoIn: class extends TodoUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  ItemDoesNotExist: class extends TodoUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${SetFinalState.UC_CODE}itemDoesNotExist`;
      this.message = "Item with given id does not exist.";
    }
  },

  ItemIsNotInProperState: class extends TodoUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}itemIsNotInProperState`;
      this.message = "Item is not in proper state.";
    }
  },
};


module.exports = {
  List,
  Create,
  Get,
  Delete,
  Update,
  SetFinalState
};
