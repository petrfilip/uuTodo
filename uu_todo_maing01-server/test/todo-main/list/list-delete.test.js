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

describe("list delete uuCMD tests", () => {
  test("HDS - delete empty list", async () => {
    // prepare data
    let dtoIn = {
      name: "ABCD",
    };
    let result = await TestHelper.executePostCommand("list/create", dtoIn);

    expect(result.data.name).toEqual(dtoIn.name);
    expect(result.data.awid).toEqual(TestHelper.awid);
    expect(result.data.uuAppErrorMap).toEqual({});

    // execute the test
    let result1 = await TestHelper.executePostCommand("list/delete", { id: result.id });
    expect(result1.data.uuAppErrorMap).toEqual({});
  });

  test("HDS - delete non-empty list - with forceDelete", async () => {
    // prepare data
    let dtoIn = {
      name: "ABCD",
    };
    let resultList = await TestHelper.executePostCommand("list/create", dtoIn);
    let resultItem1 = await TestHelper.executePostCommand("item/create", { listId: resultList.id, text: "my text 1" });
    let resultItem2 = await TestHelper.executePostCommand("item/create", { listId: resultList.id, text: "my text 2" });
    let resultItem3 = await TestHelper.executePostCommand("item/create", { listId: resultList.id, text: "my text 3" });
    let resultItem4 = await TestHelper.executePostCommand("item/create", { listId: resultList.id, text: "my text 4" });
    let resultItem5 = await TestHelper.executePostCommand("item/create", { listId: resultList.id, text: "my text 5" });

    expect(resultList.data.name).toEqual(dtoIn.name);
    expect(resultList.data.awid).toEqual(TestHelper.awid);
    expect(resultList.data.uuAppErrorMap).toEqual({});

    // execute the test
    let result1 = await TestHelper.executePostCommand("list/delete", { id: resultList.id, forceDelete: true });
    expect(result1.data.uuAppErrorMap).toEqual({});
  });

  test("Alternative - delete non-empty list without forceDelete", async () => {
    // prepare data
    let resultList = await TestHelper.executePostCommand("list/create", { name: "ABCD" });
    let resultItem = await TestHelper.executePostCommand("item/create", { listId: resultList.id, text: "my text" });

    // expect(result.data.name).toEqual(dtoIn.name);
    // expect(result.data.awid).toEqual(TestHelper.awid);
    // expect(result.data.uuAppErrorMap).toEqual({});

    // execute the test
    expect.assertions(2);
    try {
      await TestHelper.executePostCommand("list/delete", { id: resultList.id });
    } catch (e) {
      expect(e.code).toEqual("uu-todo-main/list/delete/listContainsActiveItems");
      expect(e.status).toEqual(400);
    }
  });

  test("Alternative - invalid dtoIn", async () => {
    // prepare data
    let dtoIn = {
      name: "ABCD",
    };
    let result = await TestHelper.executePostCommand("list/create", dtoIn);

    expect(result.data.name).toEqual(dtoIn.name);
    expect(result.data.awid).toEqual(TestHelper.awid);
    expect(result.data.uuAppErrorMap).toEqual({});

    // execute the test
    // expect.assertions(3);
    try {
      await TestHelper.executePostCommand("list/delete", { deadline: "2031-08-06" });
    } catch (e) {
      expect(e.code).toEqual("uu-todo-main/list/delete/invalidDtoIn");
      expect(Object.keys(e.paramMap.missingKeyMap).length).toEqual(1);
      expect(e.status).toEqual(400);
    }
  });

  test("Alternative - list does not exists", async () => {
    // prepare data
    let dtoIn = {
      name: "ABCD",
    };
    let result = await TestHelper.executePostCommand("list/create", dtoIn);

    expect.assertions(2);
    try {
      await TestHelper.executePostCommand("list/delete", { id: "612fb0644229f1044e926f45" });
    } catch (e) {
      expect(e.code).toEqual("uu-todo-main/list/delete/listDoesNotExist");
      expect(e.status).toEqual(400);
    }
  });
});
