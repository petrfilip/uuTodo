"use strict";
const ItemAbl = require("../../abl/item-abl.js");

class TodoInstanceController {
  create(ucEnv) {
    return ItemAbl.create(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }

  get(ucEnv) {
    return ItemAbl.get(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }

  update(ucEnv) {
    return ItemAbl.update(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }

  delete(ucEnv) {
    return ItemAbl.delete(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }

  list(ucEnv) {
    return ItemAbl.list(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }

  setFinalState(ucEnv) {
    return ItemAbl.setFinalState(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }
}

module.exports = new TodoInstanceController();
