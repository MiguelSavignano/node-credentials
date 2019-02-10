var fs = require("fs");

const validEncrypted = value => {
  return value.length > 16;
};
expect.extend({
  validEncrypted(value) {
    const pass = validEncrypted(value);
    return {
      pass,
      message: () =>
        pass
          ? `valid encrypted length: ${value.length}`
          : `invalid encrypted length: ${value.length}`
    };
  }
});

expect.extend({
  async validEncryptedFile(value) {
    const pass = validEncrypted(fs.readFileSync(value));
    return {
      pass,
      message: () =>
        pass
          ? `valid encrypted file length: ${value.length}`
          : `invalid encrypted file length: ${value.length}`
    };
  }
});

expect.extend({
  async fileContains(filePath, fileText) {
    const pass = fileText === fs.readFileSync(filePath, "utf8");

    return {
      pass: pass,
      message: () => (pass ? `valid file` : `invalid contains ${fileText}`)
    };
  }
});
