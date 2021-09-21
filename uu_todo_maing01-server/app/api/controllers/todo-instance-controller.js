"use strict";
const TodoMainAbl = require("../../abl/todo-instance-abl.js");

class TodoInstanceController {
  init(ucEnv) {
    return TodoMainAbl.init(ucEnv.getUri(), ucEnv.getDtoIn());
  }

  load(ucEnv) {
    return TodoMainAbl.load(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession(), ucEnv.getAuthorizationResult());
  }

  update(ucEnv) {
    return TodoMainAbl.update(ucEnv.getUri(), ucEnv.getDtoIn());
  }

  setState(ucEnv) {
    return TodoMainAbl.setState(ucEnv.getUri(), ucEnv.getDtoIn());
  }
}

module.exports = new TodoInstanceController();
