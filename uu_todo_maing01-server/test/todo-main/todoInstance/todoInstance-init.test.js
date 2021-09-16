const { TestHelper } = require("uu_appg01_server-test");

beforeEach(async () => {
  await TestHelper.setup();
  await TestHelper.initUuSubAppInstance();
  await TestHelper.createUuAppWorkspace();
});

afterEach(async () => {
  await TestHelper.teardown();
});

describe("Testing the init uuCmd...", () => {
  test("HDS - init", async () => {
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
  });

  test("Alternative - invalid dtoIn", async () => {
    expect.assertions(2);
    try {
      let session = await TestHelper.login("AwidLicenseOwner", false, false);

      let dtoIn = {
        id: "asdf",
      };
      let result = await TestHelper.executePostCommand("/sys/uuAppWorkspace/init", dtoIn, session);
    } catch (e) {
      expect(e.code).toEqual("uu-todo-main/init/invalidDtoIn");
      expect(e.status).toEqual(400);
    }
  });
});
