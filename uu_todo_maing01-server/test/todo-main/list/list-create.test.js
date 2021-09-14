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

describe("list create uuCMD tests", () => {
  test("HDS", async () => {
    let dtoIn = {
      name: "ABCD",
    };
    let result = await TestHelper.executePostCommand("list/create", dtoIn);

    expect(result.data.name).toEqual(dtoIn.name);
    expect(result.data.awid).toEqual(TestHelper.awid);
    expect(result.data.uuAppErrorMap).toEqual({});
  });
  test("HDS - with deadline", async () => {
    let dtoIn = {
      name: "Ahoj",
      deadline: "2031-08-05",
    };
    let result = await TestHelper.executePostCommand("list/create", dtoIn);

    expect(result.data.name).toEqual(dtoIn.name);
    expect(result.data.deadline).toEqual(dtoIn.deadline);
    expect(result.data.awid).toEqual(TestHelper.awid);
    expect(result.data.uuAppErrorMap).toEqual({});
  });

  test("Alternative - invalid dtoIn", async () => {
    expect.assertions(3);
    try {
      await TestHelper.executePostCommand("list/create", {});
    } catch (e) {
      expect(e.code).toEqual("uu-todo-main/list/create/invalidDtoIn");
      expect(Object.keys(e.paramMap.missingKeyMap).length).toEqual(1);
      expect(e.status).toEqual(400);
    }
  });

  test("Alternative - invalid deadline", async () => {
    expect.assertions(2);
    try {
      await TestHelper.executePostCommand("list/create", {
        name: "Ahoj",
        deadline: "1031-08-05",
      });
    } catch (e) {
      expect(e.code).toEqual("uu-todo-main/list/create/deadlineDateIsFromThePast");
      expect(e.status).toEqual(400);
    }
  });
});
