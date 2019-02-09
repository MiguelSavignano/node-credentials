var fs = require("fs");

const validEncrypted = value => {
  return value.length === 70;
};
expect.extend({
  async validEncrypted(value) {
    return {
      pass: validEncrypted(value),
      message: () => "valid encrypted"
    };
  }
});

expect.extend({
  async validEncryptedFile(value) {
    return {
      pass: validEncrypted(fs.readFileSync(value)),
      message: () => "valid encrypted file"
    };
  }
});

expect.extend({
  async fileContains(filePath, fileText) {
    return {
      pass: fileText == fs.readFileSync(filePath, "utf8"),
      message: () => "valid file"
    };
  }
});
