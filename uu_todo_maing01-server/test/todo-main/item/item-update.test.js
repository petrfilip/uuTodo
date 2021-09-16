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

describe("item update uuCMD tests", () => {
  test("HDS", async () => {
    let resultList = await TestHelper.executePostCommand("list/create", { name: "list" });
    let resultItem = await TestHelper.executePostCommand("item/create", { listId: resultList.id, text: "item" });

    expect(resultItem.data.awid).toEqual(TestHelper.awid);
    expect(resultItem.data.text).toEqual("item");
    expect(resultItem.data.state).toEqual("active");
    expect(resultItem.data.highPriority).toEqual(false);
    expect(resultItem.data.listId).toEqual(resultList.id);
    expect(resultItem.data.uuAppErrorMap).toEqual({});

    resultItem = await TestHelper.executePostCommand("item/update", {
      id: resultItem.id,
      listId: resultList.id,
      text: "item2",
      highPriority: true,
    });

    expect(resultItem.data.awid).toEqual(TestHelper.awid);
    expect(resultItem.data.text).toEqual("item2");
    expect(resultItem.data.state).toEqual("active");
    expect(resultItem.data.highPriority).toEqual(true);
    expect(resultItem.data.listId).toEqual(resultList.id);
    expect(resultItem.data.uuAppErrorMap).toEqual({});
  });

  test("Alternative - update completed", async () => {
    // prepare data
    let resultList = await TestHelper.executePostCommand("list/create", { name: "list" });
    let resultItem = await TestHelper.executePostCommand("item/create", { listId: resultList.id, text: "item" });

    // expect(resultItem.data.awid).toEqual(TestHelper.awid);
    // expect(resultItem.data.text).toEqual("item");
    // expect(resultItem.data.state).toEqual("active");
    // expect(resultItem.data.highPriority).toEqual(false);
    // expect(resultItem.data.listId).toEqual(resultList.id);
    // expect(resultItem.data.uuAppErrorMap).toEqual({});

    resultItem = await TestHelper.executePostCommand("item/setFinalState", { id: resultItem.id, state: "completed" });

    // execute the test
    expect.assertions(2);
    try {
      await TestHelper.executePostCommand("item/update", {
        id: resultItem.id,
        listId: resultList.id,
        text: "item2",
        highPriority: true,
      });
    } catch (e) {
      expect(e.code).toEqual("uu-todo-main/item/update/itemIsNotInCorrectState");
      expect(e.status).toEqual(400);
    }
  });

  test("Alternative - invalid dtoIn", async () => {
    let resultList = await TestHelper.executePostCommand("list/create", { name: "list" });

    expect.assertions(3);
    try {
      await TestHelper.executePostCommand("item/update", { listId: resultList.id });
    } catch (e) {
      expect(e.code).toEqual("uu-todo-main/item/update/invalidDtoIn");
      expect(Object.keys(e.paramMap.missingKeyMap).length).toEqual(1);
      expect(e.status).toEqual(400);
    }
  });

  test("Alternative - list does not exists", async () => {
    let resultList = await TestHelper.executePostCommand("list/create", { name: "list" });
    let resultItem = await TestHelper.executePostCommand("item/create", { listId: resultList.id, text: "item" });

    expect.assertions(2);
    try {
      await TestHelper.executePostCommand("item/update", {
        id: resultItem.id,
        listId: "612fb0644229f1044e926f45",
        text: "asdf",
      });
    } catch (e) {
      expect(e.code).toEqual("uu-todo-main/item/update/listDoesNotExist");
      expect(e.status).toEqual(400);
    }
  });
});
