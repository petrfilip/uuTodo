const Errors = require("../api/errors/todo-instance-error.js");
const { DaoFactory } = require("uu_appg01_server").ObjectStore;

const Dao = {
  todoInstance: DaoFactory.getDao("todoInstance"),
  list: DaoFactory.getDao("list"),
  item: DaoFactory.getDao("item"),
};

const ValidatorService = {
  todoInstanceCheck: async (awid, expectedState = ["active"]) => {
    let todoInstance;
    try {
      todoInstance = await Dao.todoInstance.getByAwid(awid);
    } catch (e) {
      throw new Errors.Load.TodoInstanceDoesNotExist(e);
    }

    if (!expectedState.includes(todoInstance.state)) {
      throw new Errors.Load.TodoInstanceIsNotInProperState({
        currentState: todoInstance.state,
        expectedState: expectedState,
      });
    }

    return todoInstance;
  },
};

module.exports = {
  Dao,
  ValidatorService,
};
