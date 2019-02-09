var fs = require("fs");
const nodeVault = require("../node-vault");
require("./helpers/matchers");
let NODE_MASTER_KEY = "8aa93853b3ff01c5b5447529a9c33cb9";

// describe("node-vault", () => {
//   let credentialsPath = __dirname + "/examples/encrypt/credentials.json";

//   afterEach(() => {
//     fs.unlinkSync(`${credentialsPath}.enc`);
//   });

//   test("encrypt", async () => {
//     expect(
//       await nodeVault.encrypt({
//         keyValue: NODE_MASTER_KEY,
//         credentialsFilePath: credentialsPath
//       })
//     ).validEncryptedFile();
//   });
// });

describe("node-vault", () => {
  let credentialsPath = __dirname + "/examples/decrypt/credentials.json";

  afterEach(() => {
    fs.unlinkSync(`${credentialsPath}`);
  });
  test("editCredentials", () => {
    const result = nodeVault.editCredentials({
      keyValue: NODE_MASTER_KEY,
      credentialsFilePath: credentialsPath
    });
    expect(result).fileContains(JSON.stringify({ my_key: "password" }));
  });
});
