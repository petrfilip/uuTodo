"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class ItemMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1, _id: 1 }, { unique: true });
    await super.createIndex({ awid: 1, listId: 1, state: 1 }, { unique: false });
    await super.createIndex({ awid: 1, state: 1 }, { unique: false });
  }

  async create(uuObject) {
    return await super.insertOne(uuObject);
  }

  async get(awid, id) {
    let filter = {
      awid: awid,
      id: id,
    };
    return await super.findOne(filter);
  }

  async listByListAndState(awid, listId, state, pageInfo) {
    return await super.find({ awid, listId, state }, pageInfo);
  }

  /**
   * this method is over the planned scope
   */
  async listByListId(awid, listId, pageInfo) {
    return await super.find({ awid, listId }, pageInfo);
  }

  async listByState(awid, state, pageInfo) {
    return await super.find({ awid, state }, pageInfo);
  }

  async list(awid, pageInfo = {}) {
    return await super.find({ awid }, pageInfo);
  }

  async updateByAwid(uuObject) {
    let filter = {
      awid: uuObject.awid,
      id: uuObject.id,
    };
    return await super.findOneAndUpdate(filter, uuObject, "NONE");
  }

  async setFinalState(awid, id, state) {
    let filter = {
      awid: awid,
      id: id,
    };

    const objectToUpdate = {
      ...filter,
      state,
    };
    return await super.findOneAndUpdate(filter, objectToUpdate, "NONE");
  }

  async remove(uuObject) {
    let filter = {
      awid: uuObject.awid,
      id: uuObject.id,
    };
    return await super.deleteOne(filter);
  }
  async deleteManyByListId(awid, listId) {
    let filter = {
      awid: awid,
      listId: listId,
    };
    return await super.deleteMany(filter);
  }
}

module.exports = ItemMongo;
