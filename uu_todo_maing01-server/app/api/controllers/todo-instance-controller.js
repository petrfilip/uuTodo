"use strict";
const TodoMainAbl = require("../../abl/todo-instance-abl.js");

class TodoInstanceController {
  init(ucEnv) {
    return TodoMainAbl.init(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }

  load(ucEnv) {
    return TodoMainAbl.load(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession(), ucEnv.getAuthorizationResult());
  }
}

module.exports = new TodoInstanceController();
