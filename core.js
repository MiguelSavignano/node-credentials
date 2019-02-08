var crypto = require("crypto");
var fs = require("fs");

// NODE_MASTER_KEY
const encrypt = (json, callback) => {
  const algorithm = "aes-256-cbc";
  const key =
    process.env.NODE_MASTER_KEY ||
    fs.readFileSync("credentials.json.key", "utf8").trim();
  crypto.randomBytes(16, (err, iv) => {
    if (err) return callback(err);

    var cipher = crypto.createCipheriv(algorithm, key, iv);
    var ciphertext = "";
    ciphertext += cipher.update(JSON.stringify(json), "utf-8", "binary");
    ciphertext += cipher.final("binary");
    ciphertext = new Buffer(ciphertext, "binary");
    var cipherBundle = [
      ciphertext.toString("base64"),
      iv.toString("base64")
    ].join("--");

    callback(null, cipherBundle);
  });
};

const decrypt = ({
  encryptedFilePath = "credentials.json.enc",
  keyPath = "credentials.json.key",
  keyValue = process.env.NODE_MASTER_KEY
} = {}) => {
  const key = keyValue || fs.readFileSync(keyPath, "utf8").trim();
  const credentialsEnryptedText = fs.readFileSync(encryptedFilePath, "utf8");
  const decryptCredentials = decryptString(key, credentialsEnryptedText);
  const credentials = JSON.parse(decryptCredentials);
  return credentials;
};
exports.decrypt = decrypt;

const decryptString = (keyValue, text) => {
  const algorithm = "aes-256-cbc";
  var parts = text.split("--", 2);
  var ciphertext = new Buffer(parts[0], "base64");
  var iv = new Buffer(parts[1], "base64");

  var decipher = crypto.createDecipheriv(algorithm, keyValue, iv);
  var plaintext = "";
  plaintext += decipher.update(ciphertext);
  plaintext += decipher.final();
  return plaintext;
};
exports.decryptString = decryptString;

const newKey = () => {
  return crypto.randomBytes(16).toString("hex");
};
exports.newKey = newKey;
