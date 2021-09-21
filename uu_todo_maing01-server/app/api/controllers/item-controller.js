"use strict";
const ItemAbl = require("../../abl/item-abl.js");

class TodoInstanceController {
  create(ucEnv) {
    return ItemAbl.create(ucEnv.getUri(), ucEnv.getDtoIn());
  }

  get(ucEnv) {
    return ItemAbl.get(ucEnv.getUri(), ucEnv.getDtoIn());
  }

  update(ucEnv) {
    return ItemAbl.update(ucEnv.getUri(), ucEnv.getDtoIn());
  }

  delete(ucEnv) {
    return ItemAbl.delete(ucEnv.getUri(), ucEnv.getDtoIn());
  }

  list(ucEnv) {
    return ItemAbl.list(ucEnv.getUri(), ucEnv.getDtoIn());
  }

  setFinalState(ucEnv) {
    return ItemAbl.setFinalState(ucEnv.getUri(), ucEnv.getDtoIn());
  }
}

module.exports = new TodoInstanceController();
