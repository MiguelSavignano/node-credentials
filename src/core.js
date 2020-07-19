var crypto = require('crypto');
const { type } = require('os');

const encrypt = (key, text) =>
  new Promise((resolve, reject) => {
    const algorithm = 'aes-256-cbc';
    crypto.randomBytes(16, (err, iv) => {
      if (err) {
        console.error('ERROR encrypted', err);
        reject(err);
      }
      var cipher = crypto.createCipheriv(algorithm, key, iv);
      var ciphertext = '';
      ciphertext += cipher.update(text, 'utf-8', 'binary');
      ciphertext += cipher.final('binary');
      ciphertext = new Buffer.from(ciphertext, 'binary');
      var cipherBundle = [
        ciphertext.toString('base64'),
        iv.toString('base64'),
      ].join('--');

      resolve(cipherBundle);
    });
  });
exports.encrypt = encrypt;

const encryptJSON = async (encKey, object) => {
  return await Object.entries(object).reduce(async (memo, [key, value]) => {
    const result = await memo;
    try {
      result[key] = await encrypt(encKey, value);
      return result;
    } catch (e) {
      console.error(e);
    }
  }, Promise.resolve({}));
};

function isObject(variable) {
  return (
    variable !== undefined &&
    variable !== null &&
    variable.constructor === Object
  );
}

const transformValues = async (object, fnc) => {
  return await Object.entries(object).reduce(async (memo, [key, value]) => {
    const result = await memo;
    try {
      if (isObject(value)) {
        result[key] = await transformValues(value, fnc);
      } else if (Array.isArray(value)) {
        result[key] = await Promise.all(
          value.map((subValue) => {
            if (typeof subValue === 'string' || typeof subValue === 'number') {
              return fnc(subValue);
            } else {
              return transformValues(subValue, fnc);
            }
          }),
        );
      } else if (typeof value === 'string' || typeof value == 'number') {
        result[key] = await fnc(value);
      } else {
        result[key] = value;
      }
      return result;
    } catch (e) {
      console.error(e);
    }
  }, Promise.resolve({}));
};

exports.transformValues = transformValues;

const decrypt = (key, text) => {
  const algorithm = 'aes-256-cbc';
  var parts = text.split('--', 2);
  var ciphertext = new Buffer.from(parts[0], 'base64');
  var iv = new Buffer.from(parts[1], 'base64');

  var decipher = crypto.createDecipheriv(algorithm, key, iv);
  var plaintext = '';
  plaintext += decipher.update(ciphertext);
  plaintext += decipher.final();
  return plaintext;
};
exports.decrypt = decrypt;

const newKey = () => {
  return crypto.randomBytes(16).toString('hex');
};
exports.newKey = newKey;
