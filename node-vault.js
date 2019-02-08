const core = require("./core");
var fs = require("fs");

const createNewKey = (path = "./credentials.json.key") => {
  fs.writeFileSync(path, core.newKey());
};
module.exports.createNewKey = createNewKey;

const editCredentials = ({
  encryptedFilePath = "credentials.json.enc",
  keyPath = "credentials.json.key",
  outPath = "credentials.json"
} = {}) => {
  const credentials = core.decrypt(encryptedFilePath, keyPath);
  fs.writeFileSync(outPath, JSON.stringify(credentials), "utf8");
  return outPath;
};
module.exports.editCredentials = editCredentials;

module.exports.encrypt = core.encrypt;
module.exports.decrypt = core.decrypt;
