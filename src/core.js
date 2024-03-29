const crypto = require('crypto');
const YAML = require('yaml');
const dotenv = require('dotenv');
const { jsonToDotEnv } = require('./dotenv');
const { transformValues, deepValuesYAMLDoc } = require('./transformValues');
const NO_ENCRYPT_COMMENT = "no-encrypt"

YAML.defaultOptions.merge = true;
const algorithm = 'aes-256-cbc';

const generateIV = (format = null) =>
  new Promise((resolve, reject) => {
    crypto.pseudoRandomBytes(16, (err, iv) => {
      if (err) reject(err);
      if (format) {
        resolve(iv.toString(format));
      } else {
        resolve(iv);
      }
    });
  });

const isInvalidKey = (encKey) => encKey.length != 32;

const generateValidKey = (baseKey) => {
  const hash = crypto.createHash('sha256');
  hash.update(baseKey);
  return hash.digest();
};

const encrypt = (encKey, text, ivBase64) => {
  if (isInvalidKey(encKey)) {
    encKey = generateValidKey(encKey);
  }

  const iv = new Buffer.from(ivBase64, 'base64');
  const cipher = crypto.createCipheriv(algorithm, encKey, iv);
  let ciphertext = '';
  ciphertext += cipher.update(text, 'utf-8', 'binary');
  ciphertext += cipher.final('binary');
  ciphertext = new Buffer.from(ciphertext, 'binary');
  const cipherBundle = [ciphertext.toString('base64'), iv.toString('base64')].join('--');
  // console.log(cipherBundle)

  return cipherBundle;
};

const encryptObject = (encKey, obj, ivBase64) => {
  const objWithValuesEncrypted = transformValues(obj, (value) => {
    return encrypt(encKey, value.toString(), ivBase64);
  });
  return objWithValuesEncrypted;
};

const encryptJSON = async (encKey, text, ivBase64 = null) => {
  ivBase64 = ivBase64 || await generateIV('base64')
  const result = encryptObject(encKey, JSON.parse(text), ivBase64);
  return JSON.stringify(result, 0, 2);
};

const encryptDotenv = async (encKey, text, ivBase64 = null) => {
  ivBase64 = ivBase64 || await generateIV('base64')
  const result = encryptObject(encKey, dotenv.parse(text), ivBase64);
  return jsonToDotEnv(result);
};

// https://eemeli.org/yaml/#documents
const encryptYAML = async (encKey, text, ivBase64 = null) => {
  ivBase64 = ivBase64 || await generateIV('base64')
  const doc = YAML.parseDocument(text, { merge: false });
  doc.contents.items.forEach(item => {
    deepValuesYAMLDoc(item, (value, comment) => {
      if (value === null) return value
      if (comment && comment.trim() == NO_ENCRYPT_COMMENT) return value
      return encrypt(encKey, value.toString(), ivBase64);
    })
  })
  return doc.toString();
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

const decryptObject = (encKey, obj) => {
  let lastIv;
  const objWithValuesDecrypted = transformValues(obj, (value) => {
    let [plaintext, iv] = decrypt(encKey, value);
    lastIv = iv;
    return plaintext;
  });
  return [objWithValuesDecrypted, lastIv];
};

const decryptDotEnv = (encKey, text) => {
  const [objWithValuesDecrypted, lastIv] = decryptObject(encKey, dotenv.parse(text));
  return [jsonToDotEnv(objWithValuesDecrypted), lastIv];
};

const decryptJSON = (encKey, text) => {
  const [objWithValuesDecrypted, lastIv] = decryptObject(encKey, JSON.parse(text));
  return [JSON.stringify(objWithValuesDecrypted, 0, 2), lastIv];
};

const decryptYAML = (encKey, text) => {
  const doc = YAML.parseDocument(text, { merge: false });
  doc.contents.items.forEach(item => {
    deepValuesYAMLDoc(item, (value, comment) => {
      if (value === null) return value
      if (comment && comment.trim() == NO_ENCRYPT_COMMENT) {
        return value
      }

      let [plaintext, iv] = decrypt(encKey, value);
      lastIv = iv;
      return plaintext;
    })
  })
  return [doc.toString(), lastIv];
};

const newKey = () => {
  return crypto.randomBytes(16).toString('hex');
};

module.exports = { generateIV, newKey, encrypt, decryptJSON, decrypt, encryptDotenv, decryptDotEnv, encryptJSON, encryptYAML, decryptYAML };
