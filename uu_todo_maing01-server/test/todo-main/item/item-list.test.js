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

async function prepareTestData() {
  let listA = await TestHelper.executePostCommand("list/create", { name: "list A" });
  let itemA1 = await TestHelper.executePostCommand("item/create", { listId: listA.id, text: "item A 1" });
  let itemA2 = await TestHelper.executePostCommand("item/create", { listId: listA.id, text: "item A 2" });
  let itemA3 = await TestHelper.executePostCommand("item/create", { listId: listA.id, text: "item A 3" });
  let itemA4 = await TestHelper.executePostCommand("item/create", { listId: listA.id, text: "item A 4" });

  itemA1 = await TestHelper.executePostCommand("item/setFinalState", {
    id: itemA1.id,
    state: "cancelled",
  });

  let listB = await TestHelper.executePostCommand("list/create", { name: "list B" });
  let itemB1 = await TestHelper.executePostCommand("item/create", { listId: listB.id, text: "item B 1" });
  let itemB2 = await TestHelper.executePostCommand("item/create", { listId: listB.id, text: "item B 2" });
  let itemB3 = await TestHelper.executePostCommand("item/create", { listId: listB.id, text: "item B 3" });
  return listA;
}

describe("item list uuCMD tests", () => {
  test("HDS - list by listId and state", async () => {
    // prepare data
    let listA = await prepareTestData();

    // execute the test
    let result1 = await TestHelper.executeGetCommand("item/list", { listId: listA.id, state: "active" });
    expect(result1.data.itemList.length).toEqual(3);

    const pageInfo = {
      pageIndex: 0,
      pageSize: 1,
    };

    result1 = await TestHelper.executeGetCommand("item/list", { listId: listA.id, state: "active", pageInfo });
    expect(result1.data.itemList.length).toEqual(1);

    result1 = await TestHelper.executeGetCommand("item/list", { listId: listA.id, state: "cancelled" });
    expect(result1.data.itemList.length).toEqual(1);

    result1 = await TestHelper.executeGetCommand("item/list", { listId: listA.id, state: "completed" });
    expect(result1.data.itemList.length).toEqual(0);
  });

  test("HDS - list by state", async () => {
    // prepare data
    await prepareTestData();

    // execute the test
    let result1 = await TestHelper.executeGetCommand("item/list", { state: "active" });
    expect(result1.data.itemList.length).toEqual(6);

    const pageInfo = {
      pageIndex: 0,
      pageSize: 1,
    };

    result1 = await TestHelper.executeGetCommand("item/list", { state: "active", pageInfo });
    expect(result1.data.itemList.length).toEqual(1);

    result1 = await TestHelper.executeGetCommand("item/list", { state: "cancelled" });
    expect(result1.data.itemList.length).toEqual(1);

    result1 = await TestHelper.executeGetCommand("item/list", { state: "completed" });
    expect(result1.data.itemList.length).toEqual(0);
  });

  test("HDS - just list ", async () => {
    // prepare data
    await prepareTestData();

    // execute the test
    let result1 = await TestHelper.executeGetCommand("item/list", {});
    expect(result1.data.itemList.length).toEqual(7);

    const pageInfo = {
      pageIndex: 0,
      pageSize: 2,
    };

    result1 = await TestHelper.executeGetCommand("item/list", { pageInfo });
    expect(result1.data.itemList.length).toEqual(2);
  });

  test("Alternative - invalid dtoIn", async () => {
    expect.assertions(2);
    try {
      await TestHelper.executeGetCommand("item/list", { state: "abcd" });
    } catch (e) {
      expect(e.code).toEqual("uu-todo-main/item/list/invalidDtoIn");
      expect(e.status).toEqual(400);
    }
  });
});
