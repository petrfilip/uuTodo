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

describe("list list uuCMD tests", () => {
  test("HDS - list list without pageInfo", async () => {
    // prepare data
    let dtoIn = {
      name: "ABCD",
    };
    let result = await TestHelper.executePostCommand("list/create", dtoIn);

    expect(result.data.name).toEqual(dtoIn.name);
    expect(result.data.awid).toEqual(TestHelper.awid);
    expect(result.data.uuAppErrorMap).toEqual({});

    // execute the test
    let result1 = await TestHelper.executeGetCommand("list/list", {});
    expect(result1.data.uuAppErrorMap).toEqual({});

    expect(result1.data.pageInfo.pageIndex).toEqual(0);
    expect(result1.data.pageInfo.pageSize).toEqual(500);
    expect(result1.data.itemList.length).toEqual(1);
    expect(result1.data.itemList[0].name).toEqual(dtoIn.name);
  });

  test("HDS - list list with pageInfo", async () => {
    // prepare data

    let result1 = await TestHelper.executePostCommand("list/create", { name: "1" });
    let result2 = await TestHelper.executePostCommand("list/create", { name: "2" });
    let result3 = await TestHelper.executePostCommand("list/create", { name: "3" });
    let result4 = await TestHelper.executePostCommand("list/create", { name: "4" });

    // execute the test
    const pageInfo = {
      pageIndex: 0,
      pageSize: 3,
    };

    let resultList = await TestHelper.executeGetCommand("list/list", { pageInfo });
    expect(resultList.data.uuAppErrorMap).toEqual({});

    expect(resultList.data.pageInfo.pageIndex).toEqual(0);
    expect(resultList.data.pageInfo.pageSize).toEqual(3);
    expect(resultList.data.itemList.length).toEqual(3);
    expect(resultList.data.itemList[0].name).toEqual(result1.name);
    expect(resultList.data.itemList[1].name).toEqual(result2.name);
    expect(resultList.data.itemList[2].name).toEqual(result3.name);
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
      await TestHelper.executeGetCommand("list/list", { deadline: "2031-08-06" });
    } catch (e) {
      expect(e.code).toEqual("uu-todo-main/list/delete/invalidDtoIn");
      expect(Object.keys(e.paramMap.missingKeyMap).length).toEqual(1);
      expect(e.status).toEqual(400);
    }
  });
});
