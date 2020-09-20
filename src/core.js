const crypto = require('crypto');
const { transformValues } = require('./transformValues');
const algorithm = 'aes-256-cbc';

const generateIV = () =>
  new Promise((resolve, reject) => {
    crypto.pseudoRandomBytes(16, (err, iv) => {
      if (err) reject(err);
      resolve(iv);
    });
  });

const isInvalidKey = (encKey) => encKey.length != 32;

const generateValidKey = (baseKey) => {
  const hash = crypto.createHash('sha256');
  hash.update(baseKey);
  return hash.digest();
};

const encrypt = async (encKey, text, ivBase64 = null) => {
  if (isInvalidKey(encKey)) {
    encKey = generateValidKey(encKey);
  }

  const iv = ivBase64 ? new Buffer.from(ivBase64, 'base64') : await generateIV();
  const cipher = crypto.createCipheriv(algorithm, encKey, iv);
  let ciphertext = '';
  ciphertext += cipher.update(text, 'utf-8', 'binary');
  ciphertext += cipher.final('binary');
  ciphertext = new Buffer.from(ciphertext, 'binary');
  const cipherBundle = [ciphertext.toString('base64'), iv.toString('base64')].join('--');

  return cipherBundle;
};

const encryptJSON = async (encKey, text, ivBase64 = null) => {
  const obj = JSON.parse(text);
  const objWithValuesEncrypted = await transformValues(obj, async (value) => {
    return encrypt(encKey, value.toString(), ivBase64);
  });
  return JSON.stringify(objWithValuesEncrypted, 0, 2);
};

const decrypt = (encKey, text) => {
  if (isInvalidKey(encKey)) {
    encKey = generateValidKey(encKey);
  }
  const parts = text.split('--', 2);
  const ciphertext = new Buffer.from(parts[0], 'base64');
  if (!parts[1]) {
    throw new Error(`Invalid encrypt format for [${text.substring(0, 5)}**]`);
  }
  const iv = new Buffer.from(parts[1], 'base64');

  const decipher = crypto.createDecipheriv(algorithm, encKey, iv);
  let plaintext = '';
  plaintext += decipher.update(ciphertext);
  plaintext += decipher.final();
  return [plaintext, parts[1]];
};

const decryptJSON = (encKey, text) => {
  const obj = JSON.parse(text);
  let lastIv;
  const objWithValuesDecrypted = transformValues(obj, (value) => {
    let [plaintext, iv] = decrypt(encKey, value);
    lastIv = iv;
    return plaintext;
  });
  return [JSON.stringify(objWithValuesDecrypted, 0, 2), lastIv];
};

const newKey = () => {
  return crypto.randomBytes(16).toString('hex');
};

module.exports = { newKey, encrypt, decryptJSON, decrypt, encryptJSON };
