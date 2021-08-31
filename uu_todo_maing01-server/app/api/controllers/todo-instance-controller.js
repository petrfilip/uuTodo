"use strict";
const TodoMainAbl = require("../../abl/todo-instance-abl.js");

class TodoInstanceController {
  init(ucEnv) {
    return TodoMainAbl.init(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }
}

module.exports = new TodoInstanceController();
