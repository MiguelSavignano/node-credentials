const nodeVault = require("../node-vault");
let NODE_MASTER_KEY = "8aa93853b3ff01c5b5447529a9c33cb9";
var fs = require("fs");
require("./helpers/matchers");

test("encrypt", async () => {
  let credentialsPath = __dirname + "/examples/credentials.json";
  expect(
    await nodeVault.encrypt({
      keyValue: NODE_MASTER_KEY,
      credentialsFilePath: credentialsPath
    })
  ).toEqual(`${credentialsPath}.enc`);
  expect(fs.readFileSync(`${credentialsPath}.enc`)).validEncrypted();
});
