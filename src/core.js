var crypto = require('crypto');
const algorithm = 'aes-256-cbc';

function isObject(variable) {
  return variable !== undefined && variable !== null && variable.constructor === Object;
}

function isPromiseOrAsync(variable) {
  return (
    variable !== undefined &&
    variable !== null &&
    variable.constructor &&
    (variable.constructor.name === 'Promise' || variable.constructor.name === 'AsyncFunction')
  );
}

const resolveSubTypes = (value, fnc) => {
  if (isObject(value)) {
    return transformValues(value, fnc);
  } else if (Array.isArray(value)) {
    const subTypesResult = value.map((subValue) => resolveSubTypes(subValue, fnc));
    if (isPromiseOrAsync(fnc)) {
      return Promise.all(subTypesResult);
    }
    return subTypesResult;
  } else if (typeof value === 'string' || typeof value == 'number') {
    return fnc(value);
  }
  return value;
};

// Only transform string or numbers, transform only deep values for Objects and Arrays
const transformValues = (object, fnc) => {
  if (isPromiseOrAsync(fnc)) {
    return Object.entries(object).reduce(async (memo, [key, value]) => {
      const result = await memo;
      result[key] = await resolveSubTypes(value, fnc);
      return result;
    }, Promise.resolve({}));
  }
  return Object.entries(object).reduce((memo, [key, value]) => {
    const result = memo;
    result[key] = resolveSubTypes(value, fnc, { async: false });
    return result;
  }, {});
};
exports.transformValues = transformValues;

const generateIV = () =>
  new Promise((resolve, reject) => {
    crypto.pseudoRandomBytes(16, (err, iv) => {
      if (err) reject(err);
      resolve(iv);
    });
  });

const encrypt = async (key, text, ivBase64 = null) => {
  const iv = ivBase64 ? new Buffer.from(ivBase64, 'base64') : await generateIV();
  var cipher = crypto.createCipheriv(algorithm, key, iv);
  var ciphertext = '';
  ciphertext += cipher.update(text, 'utf-8', 'binary');
  ciphertext += cipher.final('binary');
  ciphertext = new Buffer.from(ciphertext, 'binary');
  var cipherBundle = [ciphertext.toString('base64'), iv.toString('base64')].join('--');

  return cipherBundle;
};

exports.encrypt = encrypt;

const encryptJSON = async (encKey, text, ivBase64 = null) => {
  const obj = JSON.parse(text);
  const objWithValuesEncrypted = await transformValues(obj, async (value) => {
    return encrypt(encKey, `${value}`, ivBase64);
  });
  return JSON.stringify(objWithValuesEncrypted, 0, 2);
};
module.exports.encryptJSON = encryptJSON;

const decrypt = (key, text) => {
  var parts = text.split('--', 2);
  var ciphertext = new Buffer.from(parts[0], 'base64');
  var iv = new Buffer.from(parts[1], 'base64');

  var decipher = crypto.createDecipheriv(algorithm, key, iv);
  var plaintext = '';
  plaintext += decipher.update(ciphertext);
  plaintext += decipher.final();
  return [plaintext, parts[1]];
};
exports.decrypt = decrypt;

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
module.exports.decryptJSON = decryptJSON;

const newKey = () => {
  return crypto.randomBytes(16).toString('hex');
};
exports.newKey = newKey;
