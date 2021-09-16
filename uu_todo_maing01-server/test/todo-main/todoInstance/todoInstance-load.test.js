const { TestHelper } = require("uu_appg01_server-test");

beforeAll(async () => {
  await TestHelper.setup();
  await TestHelper.initUuSubAppInstance();
  await TestHelper.createUuAppWorkspace();
});

afterAll(async () => {
  await TestHelper.teardown();
});

describe("todoInstance load", () => {
  test("HDS - load", async () => {
    let session = await TestHelper.login("AwidLicenseOwner", false, false);

    let dtoIn = {
      name: "uuTodoMaing01",
      code: "uniqueCode",
      sysState: "active",
      uuAppProfileAuthorities: "urn:uu:GGALL",
    };
    let result = await TestHelper.executePostCommand("/sys/uuAppWorkspace/init", dtoIn, session);

    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toBeDefined();

    let result1 = await TestHelper.executeGetCommand("sys/uuAppWorkspace/load", {});

    expect(result1.data.id).not.toBeNull();
    expect(result1.data.name).toEqual(dtoIn.name);
    expect(result1.data.code).toEqual(dtoIn.code);
    expect(result1.data.authorizedProfileList[0]).toEqual("Authorities");
  });
});
