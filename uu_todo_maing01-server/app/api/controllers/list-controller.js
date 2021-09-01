"use strict";
const ListAbl = require("../../abl/list-abl.js");

class TodoInstanceController {
  create(ucEnv) {
    return ListAbl.create(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }

  get(ucEnv) {
    return ListAbl.get(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }

  update(ucEnv) {
    return ListAbl.update(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }

  delete(ucEnv) {
    return ListAbl.delete(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }

  list(ucEnv) {
    return ListAbl.list(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }

}

module.exports = new TodoInstanceController();
