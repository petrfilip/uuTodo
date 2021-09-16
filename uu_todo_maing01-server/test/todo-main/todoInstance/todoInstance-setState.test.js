const { TestHelper } = require("uu_appg01_server-test");

beforeEach(async () => {
  await TestHelper.setup();
  await TestHelper.initUuSubAppInstance();
  await TestHelper.createUuAppWorkspace();
});

afterEach(async () => {
  await TestHelper.teardown();
});

describe("todoInstance setState uuCmd", () => {
  test("HDS - set state", async () => {
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

    result = await TestHelper.executePostCommand("todoInstance/setState", { state: "suspended" }, session);

    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();
    expect(result.data.name).toEqual(dtoIn.name);
    expect(result.data.code).toEqual(dtoIn.code);
    expect(result.data.state).toEqual("suspended");

    result = await TestHelper.executePostCommand("todoInstance/setState", { state: "active" }, session);

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
        state: "asdf",
      };
      await TestHelper.executePostCommand("todoInstance/setState", dtoIn, session);
    } catch (e) {
      expect(e.code).toEqual("uu-todo-main/setState/invalidDtoIn");
      expect(e.status).toEqual(400);
    }
  });
});
