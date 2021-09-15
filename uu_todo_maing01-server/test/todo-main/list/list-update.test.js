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

describe("list update uuCMD tests", () => {
  test("HDS", async () => {
    // prepare data
    let dtoIn = {
      name: "ABCD",
    };
    let result = await TestHelper.executePostCommand("list/create", dtoIn);

    expect(result.data.name).toEqual(dtoIn.name);
    expect(result.data.awid).toEqual(TestHelper.awid);
    expect(result.data.uuAppErrorMap).toEqual({});

    // execute the test
    let result1 = await TestHelper.executePostCommand("list/update", { id: result.id, name: "1234" });
    expect(result1.data.id).not.toBeNull();
    expect(result1.data.name).toEqual("1234");
  });

  test("HDS - with deadline", async () => {
    // prepare data
    let dtoIn = {
      name: "Ahoj",
      deadline: "2031-08-05",
    };
    let result = await TestHelper.executePostCommand("list/create", dtoIn);

    expect(result.data.name).toEqual(dtoIn.name);
    expect(result.data.deadline).toEqual(dtoIn.deadline);
    expect(result.data.awid).toEqual(TestHelper.awid);
    expect(result.data.uuAppErrorMap).toEqual({});

    // execute the test
    let result1 = await TestHelper.executePostCommand("list/update", { id: result.id, deadline: "2031-08-06" });
    expect(result1.data.id).not.toBeNull();
    expect(result1.data.name).toEqual(dtoIn.name);
    expect(result1.data.deadline).toEqual("2031-08-06");
  });

  test("HDS - with past deadline", async () => {
    // prepare data
    let dtoIn = {
      name: "Ahoj",
      deadline: "2031-08-05",
    };
    let result = await TestHelper.executePostCommand("list/create", dtoIn);

    // expect(result.data.name).toEqual(dtoIn.name);
    // expect(result.data.deadline).toEqual(dtoIn.deadline);
    // expect(result.data.awid).toEqual(TestHelper.awid);
    // expect(result.data.uuAppErrorMap).toEqual({});

    // execute the test
    expect.assertions(2);
    try {
      await TestHelper.executePostCommand("list/update", { id: result.id, deadline: "2001-08-06" });
    } catch (e) {
      expect(e.code).toEqual("uu-todo-main/list/update/deadlineDateIsFromThePast");
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
      await TestHelper.executePostCommand("list/update", { deadline: "2031-08-06" });
    } catch (e) {
      expect(e.code).toEqual("uu-todo-main/list/update/invalidDtoIn");
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
      await TestHelper.executePostCommand("list/update", { id: "612fb0644229f1044e926f45" });
    } catch (e) {
      expect(e.code).toEqual("uu-todo-main/list/update/listDaoUpdateFailed");
      expect(e.status).toEqual(400);
    }
  });
});
