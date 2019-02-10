var fs = require("fs");
const Vault = require("../src/vault").Vault;
require("./helpers/matchers");
let NODE_MASTER_KEY = "8aa93853b3ff01c5b5447529a9c33cb9";
const MY_ENV_CREDENTIAL = "MY_ENV_CREDENTIAL";

process.env.ENV_CREDENTIAL = MY_ENV_CREDENTIAL;

describe("node-vault", () => {
  let credentialsFilePath = __dirname + "/examples/encrypt/credentials.json";

  afterEach(() => {
    fs.unlinkSync(`${credentialsFilePath}.enc`);
  });

  test("encryptFile", async () => {
    const vault = new Vault({ credentialsFilePath });

    expect(
      await vault.encryptFile({
        keyValue: NODE_MASTER_KEY
      })
    ).validEncryptedFile();
  });
});

describe("node-vault", () => {
  let credentialsFilePath = __dirname + "/examples/decrypt/credentials.json";

  afterEach(() => {
    fs.unlinkSync(`${credentialsFilePath}`);
  });
  test("editCredentials", () => {
    const vault = new Vault({ credentialsFilePath });
    const result = vault.editCredentials({
      keyValue: NODE_MASTER_KEY
    });
    const fileText = fs.readFileSync(result, "utf8");

    expect(JSON.parse(fileText)).toEqual({
      my_key: "password",
      my_key_env: "<%= process.env.ENV_CREDENTIAL %>"
    });
  });
});

describe("node-vault config", () => {
  let credentialsFilePath = __dirname + "/examples/decrypt/credentials.json";

  test("config", () => {
    const vault = new Vault({ credentialsFilePath });
    vault.config({
      keyValue: NODE_MASTER_KEY
    });
    expect(vault.credentials).toEqual({
      my_key: "password",
      my_key_env: "MY_ENV_CREDENTIAL"
    });
  });
});
