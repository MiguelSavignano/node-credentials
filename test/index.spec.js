const nodeVault = require("../node-vault");

test("decrypt", async () => {
  expect(await nodeVault.encrypt()).toEqual("credentials.json.enc");
  expect(nodeVault.decrypt()).toEqual({ my_key: "password" });
  expect(nodeVault.editCredentials()).toEqual("credentials.json");
});
