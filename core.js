var crypto = require("crypto");
var fs = require("fs");

const encrypt = (key, text, callback) => {
  const algorithm = "aes-256-cbc";
  crypto.randomBytes(16, (err, iv) => {
    if (err) return callback(err);

    var cipher = crypto.createCipheriv(algorithm, key, iv);
    var ciphertext = "";
    ciphertext += cipher.update(text, "utf-8", "binary");
    ciphertext += cipher.final("binary");
    ciphertext = new Buffer(ciphertext, "binary");
    var cipherBundle = [
      ciphertext.toString("base64"),
      iv.toString("base64")
    ].join("--");

    callback(null, cipherBundle);
  });
};
exports.encrypt = encrypt;

const decrypt = (key, text) => {
  const algorithm = "aes-256-cbc";
  var parts = text.split("--", 2);
  var ciphertext = new Buffer(parts[0], "base64");
  var iv = new Buffer(parts[1], "base64");

  var decipher = crypto.createDecipheriv(algorithm, key, iv);
  var plaintext = "";
  plaintext += decipher.update(ciphertext);
  plaintext += decipher.final();
  return plaintext;
};
exports.decrypt = decrypt;

const newKey = () => {
  return crypto.randomBytes(16).toString("hex");
};
exports.newKey = newKey;
