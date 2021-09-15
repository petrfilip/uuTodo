const { TestHelper } = require("uu_appg01_server-test");

beforeEach(async () => {
  await TestHelper.setup({ authEnabled: false, sysStatesEnabled: false });
  await TestHelper.initUuSubAppInstance();
  await TestHelper.createUuAppWorkspace();
  await TestHelper.initUuAppWorkspace({
    code: "uniqueCode",
    name: "uuTODO",
    description: "Best uuApp",
    uuAppProfileAuthorities: "urn:uu:GGPLUS4U",
  });
});

afterEach(async () => {
  await TestHelper.teardown();
});

describe("item setFinalState uuCMD tests", () => {
  test("HDS - set to completed", async () => {
    let resultList = await TestHelper.executePostCommand("list/create", { name: "list" });
    let resultItem = await TestHelper.executePostCommand("item/create", { listId: resultList.id, text: "item" });

    expect(resultItem.data.awid).toEqual(TestHelper.awid);
    expect(resultItem.data.text).toEqual("item");
    expect(resultItem.data.state).toEqual("active");
    expect(resultItem.data.highPriority).toEqual(false);
    expect(resultItem.data.listId).toEqual(resultList.id);
    expect(resultItem.data.uuAppErrorMap).toEqual({});

    resultItem = await TestHelper.executePostCommand("item/setFinalState", {
      id: resultItem.id,
      state: "completed",
    });

    expect(resultItem.data.awid).toEqual(TestHelper.awid);
    expect(resultItem.data.text).toEqual("item");
    expect(resultItem.data.state).toEqual("completed");
    expect(resultItem.data.highPriority).toEqual(false);
    expect(resultItem.data.listId).toEqual(resultList.id);
    expect(resultItem.data.uuAppErrorMap).toEqual({});
  });

  test("HDS - set to cancelled", async () => {
    let resultList = await TestHelper.executePostCommand("list/create", { name: "list" });
    let resultItem = await TestHelper.executePostCommand("item/create", { listId: resultList.id, text: "item" });

    expect(resultItem.data.awid).toEqual(TestHelper.awid);
    expect(resultItem.data.text).toEqual("item");
    expect(resultItem.data.state).toEqual("active");
    expect(resultItem.data.highPriority).toEqual(false);
    expect(resultItem.data.listId).toEqual(resultList.id);
    expect(resultItem.data.uuAppErrorMap).toEqual({});

    resultItem = await TestHelper.executePostCommand("item/setFinalState", {
      id: resultItem.id,
      state: "cancelled",
    });

    expect(resultItem.data.awid).toEqual(TestHelper.awid);
    expect(resultItem.data.text).toEqual("item");
    expect(resultItem.data.state).toEqual("cancelled");
    expect(resultItem.data.highPriority).toEqual(false);
    expect(resultItem.data.listId).toEqual(resultList.id);
    expect(resultItem.data.uuAppErrorMap).toEqual({});
  });

  test("Alternative - invalid dtoIn", async () => {
    let resultList = await TestHelper.executePostCommand("list/create", { name: "list" });

    expect.assertions(2);
    try {
      await TestHelper.executePostCommand("item/setFinalState", { listId: resultList.id });
    } catch (e) {
      expect(e.code).toEqual("uu-todo-main/item/setFinalState/invalidDtoIn");
      expect(e.status).toEqual(400);
    }
  });

  test("Alternative - item does not exists", async () => {
    expect.assertions(2);
    try {
      await TestHelper.executePostCommand("item/setFinalState", {
        id: "612fb0644229f1044e926f45",
        state: "completed",
      });
    } catch (e) {
      expect(e.code).toEqual("uu-todo-main/item/setFinalState/itemDoesNotExist");
      expect(e.status).toEqual(400);
    }
  });
});
