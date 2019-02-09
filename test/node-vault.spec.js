var fs = require("fs");
const nodeVault = require("../node-vault");
require("./helpers/matchers");
let NODE_MASTER_KEY = "8aa93853b3ff01c5b5447529a9c33cb9";

describe("node-vault", () => {
  let credentialsPath = __dirname + "/examples/credentials.json";

  afterEach(() => {
    fs.unlinkSync(`${credentialsPath}.enc`);
  });

  test("encrypt", async () => {
    expect(
      await nodeVault.encrypt({
        keyValue: NODE_MASTER_KEY,
        credentialsFilePath: credentialsPath
      })
    ).validEncryptedFile();
  });
});
