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

  DeadlineDateIsFromThePast: class extends TodoUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}deadlineDateIsFromThePast`;
      this.message = "Deadline date is from the past and therefore cannot be met.";
    }
  },

  ListDaoCreateFailed: class extends TodoUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}listDaoCreateFailed`;
      this.message = "Creating list by list DAO create failed.";
    }
  },

};

const Get = {
  UC_CODE: `${TodoUseCaseError.ERROR_PREFIX}get/`,

  ListDoesNotExist: class extends TodoUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Get.UC_CODE}listDoesNotExist`;
      this.message = "List with given id does not exist.";
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
};

module.exports = {
  List,
  Create,
  Get,
  Delete,
  Update
};
