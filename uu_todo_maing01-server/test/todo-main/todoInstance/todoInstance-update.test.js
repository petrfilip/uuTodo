const { TestHelper } = require("uu_appg01_server-test");

beforeEach(async () => {
  await TestHelper.setup();
  await TestHelper.initUuSubAppInstance();
  await TestHelper.createUuAppWorkspace();
});

afterEach(async () => {
  await TestHelper.teardown();
});

describe("todoInstance uppdate uuCmd", () => {
  test("HDS - update", async () => {
    let session = await TestHelper.login("AwidLicenseOwner", false, false);

    let dtoIn = {
      name: "uuTodoMaing01",
      code: "uniqueCode",
      uuAppProfileAuthorities: "urn:uu:GGALL",
    };
    let result = await TestHelper.executePostCommand("/sys/uuAppWorkspace/init", dtoIn, session);

    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();
    expect(result.data.name).toEqual(dtoIn.name);
    expect(result.data.code).toEqual(dtoIn.code);
    expect(result.data.state).toEqual("active");

    dtoIn = {
      name: "uuTodoMaing02",
      code: "uniqueCode2",
    };
    result = await TestHelper.executePostCommand("todoInstance/update", dtoIn, session);

    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();
    expect(result.data.name).toEqual(dtoIn.name);
    expect(result.data.code).toEqual(dtoIn.code);
    expect(result.data.state).toEqual("active");
  });

  test("Alternative - invalid dtoIn", async () => {
    let session = await TestHelper.login("AwidLicenseOwner", false, false);

    let dtoIn = {
      name: "uuTodoMaing01",
      code: "uniqueCode",
      uuAppProfileAuthorities: "urn:uu:GGALL",
    };
    await TestHelper.executePostCommand("/sys/uuAppWorkspace/init", dtoIn, session);

    expect.assertions(2);
    try {
      dtoIn = {
        name: 654,
        code: 123,
      };
      await TestHelper.executePostCommand("todoInstance/update", dtoIn, session);
    } catch (e) {
      expect(e.code).toEqual("uu-todo-main/update/invalidDtoIn");
      expect(e.status).toEqual(400);
    }
  });
});
