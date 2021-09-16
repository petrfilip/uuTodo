"use strict";
const TodoMainUseCaseError = require("./todo-use-case-error.js");

const Init = {
  UC_CODE: `${TodoMainUseCaseError.ERROR_PREFIX}init/`,

  InvalidDtoIn: class extends TodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  SchemaDaoCreateSchemaFailed: class extends TodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.status = 500;
      this.code = `${Init.UC_CODE}schemaDaoCreateSchemaFailed`;
      this.message = "Create schema by Dao createSchema failed.";
    }
  },

  SetProfileFailed: class extends TodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}sys/setProfileFailed`;
      this.message = "Set profile failed.";
    }
  },

  TodoInstanceCreateDaoFailed: class extends TodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}todoInstanceCreateDaoFailed`;
      this.message = "TodoInstance DAO create failed.";
    }
  },
};

const Load = {
  UC_CODE: `${TodoMainUseCaseError.ERROR_PREFIX}load/`,

  TodoInstanceDoesNotExist: class extends TodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Load.UC_CODE}todoInstanceDoesNotExist`;
      this.message = "TodoInstance does not exist.";
    }
  },

  TodoInstanceIsNotInProperState: class extends TodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Load.UC_CODE}todoInstanceIsNotInProperState`;
      this.message = "The application is not in proper state.\n";
    }
  },
};

const Update = {
  UC_CODE: `${TodoMainUseCaseError.ERROR_PREFIX}update/`,

  InvalidDtoIn: class extends TodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  TodoInstanceDaoUpdateByAwidFailed: class extends TodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Update.UC_CODE}todoInstanceDaoUpdateByAwidFailed`;
      this.message = "The update of todoInstance by todoInstance DAO updateByAwid failed.\n";
    }
  },
};

const SetState = {
  UC_CODE: `${TodoMainUseCaseError.ERROR_PREFIX}setState/`,

  InvalidDtoIn: class extends TodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${SetState.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  TodoInstanceDaoUpdateByAwidFailed: class extends TodoMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${SetState.UC_CODE}todoInstanceDaoUpdateByAwidFailed`;
      this.message = "The update of todoInstance by todoInstance DAO updateByAwid failed.\n";
    }
  },
};

module.exports = {
  Init,
  Load,
  Update,
  SetState,
};
