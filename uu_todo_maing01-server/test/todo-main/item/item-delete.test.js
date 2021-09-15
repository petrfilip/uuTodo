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

describe("item delete uuCMD tests", () => {
  test("HDS", async () => {
    let resultList = await TestHelper.executePostCommand("list/create", { name: "list" });
    let resultItem = await TestHelper.executePostCommand("item/create", { listId: resultList.id, text: "item" });

    expect(resultItem.data.awid).toEqual(TestHelper.awid);
    expect(resultItem.data.text).toEqual("item");
    expect(resultItem.data.state).toEqual("active");
    expect(resultItem.data.highPriority).toEqual(false);
    expect(resultItem.data.listId).toEqual(resultList.id);
    expect(resultItem.data.uuAppErrorMap).toEqual({});

    resultItem = await TestHelper.executePostCommand("item/delete", {
      id: resultItem.id,
    });

    expect(resultItem.data.uuAppErrorMap).toEqual({});
  });

  test("HDS - delete from cancelled state", async () => {
    // prepare data
    let resultList = await TestHelper.executePostCommand("list/create", { name: "list" });
    let resultItem = await TestHelper.executePostCommand("item/create", { listId: resultList.id, text: "item" });
    resultItem = await TestHelper.executePostCommand("item/setFinalState", { id: resultItem.id, state: "cancelled" });

    // execute the test
    await TestHelper.executePostCommand("item/delete", { id: resultItem.id });
    expect(resultItem.data.uuAppErrorMap).toEqual({});
  });

  test("Alternative - delete from incorrect state", async () => {
    // prepare data
    let resultList = await TestHelper.executePostCommand("list/create", { name: "list" });
    let resultItem = await TestHelper.executePostCommand("item/create", { listId: resultList.id, text: "item" });
    resultItem = await TestHelper.executePostCommand("item/setFinalState", { id: resultItem.id, state: "completed" });

    // execute the test
    expect.assertions(2);
    try {
      await TestHelper.executePostCommand("item/delete", {
        id: resultItem.id,
      });
    } catch (e) {
      expect(e.code).toEqual("uu-todo-main/item/delete/itemIsNotInCorrectState");
      expect(e.status).toEqual(400);
    }
  });

  test("Alternative - invalid dtoIn", async () => {
    expect.assertions(3);
    try {
      await TestHelper.executePostCommand("item/delete", {});
    } catch (e) {
      expect(e.code).toEqual("uu-todo-main/item/delete/invalidDtoIn");
      expect(Object.keys(e.paramMap.missingKeyMap).length).toEqual(1);
      expect(e.status).toEqual(400);
    }
  });

  test("Alternative - item does not exists", async () => {
    let resultList = await TestHelper.executePostCommand("list/create", { name: "list" });
    let resultItem = await TestHelper.executePostCommand("item/create", { listId: resultList.id, text: "item" });

    expect.assertions(2);
    try {
      await TestHelper.executePostCommand("item/delete", {
        id: "612fb0644229f1044e926f45",
      });
    } catch (e) {
      expect(e.code).toEqual("uu-todo-main/item/delete/listDoesNotExist");
      expect(e.status).toEqual(400);
    }
  });
});
