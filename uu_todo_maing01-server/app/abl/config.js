const Errors = require("../api/errors/todo-instance-error.js");
const { DaoFactory } = require("uu_appg01_server").ObjectStore;


const Dao = {
  todoInstance: DaoFactory.getDao("todoInstance"),
  list: DaoFactory.getDao("list"),
  item: DaoFactory.getDao("item")
}


const ValidatorService = {
  /**
   * System checks existence and state of the todoInstance uuObject.
   *
   * @param awid
   * @returns {Promise<*>}
   */
  todoInstanceCheck: async (awid) => {
    let todoInstance;
    try {
      todoInstance = await Dao.todoInstance.getByAwid(awid);
    } catch (e) {
      throw new Errors.Load.TodoInstanceDoesNotExist({uuAppErrorMap}, e);
    }


    if (todoInstance.state !== 'active') {
      throw new Errors.Load.TodoInstanceIsNotInProperState({
        currentState: todoInstance.state,
        expectedState: 'active',
        uuAppErrorMap
      }, e);
    }

    return todoInstance;
  }
}

module.exports = {
  Dao,
  ValidatorService
};
