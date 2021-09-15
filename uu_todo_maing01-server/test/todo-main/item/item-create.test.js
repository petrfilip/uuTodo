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

describe("item create uuCMD tests", () => {
  test("HDS", async () => {
    let resultList = await TestHelper.executePostCommand("list/create", { name: "list" });
    let resultItem = await TestHelper.executePostCommand("item/create", { listId: resultList.id, text: "item" });

    expect(resultItem.data.awid).toEqual(TestHelper.awid);
    expect(resultItem.data.text).toEqual("item");
    expect(resultItem.data.state).toEqual("active");
    expect(resultItem.data.highPriority).toEqual(false);
    expect(resultItem.data.listId).toEqual(resultList.id);
    expect(resultItem.data.uuAppErrorMap).toEqual({});
  });

  test("HDS - full object", async () => {
    let resultList = await TestHelper.executePostCommand("list/create", { name: "list" });
    let resultItem = await TestHelper.executePostCommand("item/create", {
      listId: resultList.id,
      text: "item",
      highPriority: true,
    });

    expect(resultItem.data.awid).toEqual(TestHelper.awid);
    expect(resultItem.data.text).toEqual("item");
    expect(resultItem.data.state).toEqual("active");
    expect(resultItem.data.highPriority).toEqual(true);
    expect(resultItem.data.listId).toEqual(resultList.id);
    expect(resultItem.data.uuAppErrorMap).toEqual({});
  });

  test("Alternative - invalid dtoIn", async () => {
    let resultList = await TestHelper.executePostCommand("list/create", { name: "list" });

    expect.assertions(3);
    try {
      await TestHelper.executePostCommand("item/create", { listId: resultList.id });
    } catch (e) {
      expect(e.code).toEqual("uu-todo-main/item/create/invalidDtoIn");
      expect(Object.keys(e.paramMap.missingKeyMap).length).toEqual(1);
      expect(e.status).toEqual(400);
    }
  });

  test("Alternative - list does not exists", async () => {
    expect.assertions(2);
    try {
      await TestHelper.executePostCommand("item/create", { listId: "612fb0644229f1044e926f45", text: "asdf" });
    } catch (e) {
      expect(e.code).toEqual("uu-todo-main/item/create/listDoesNotExist");
      expect(e.status).toEqual(400);
    }
  });
});
