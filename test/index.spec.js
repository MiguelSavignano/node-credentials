const nodeVault = require("../node-vault");

test("decrypt", () => {
  expect(nodeVault.decrypt()).toEqual({ my_key: "password" });
});

test("decrypt file", () => {
  expect(nodeVault.editCredentials()).toEqual("credentials.json");
});
