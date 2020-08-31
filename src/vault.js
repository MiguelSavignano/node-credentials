const core = require('./core');
const render = require('./template-render').render;
const fs = require('fs');
const { get } = require('lodash');

class Vault {
  constructor({
    decryptFnc = core.decryptJSON,
    encryptFnc = core.encryptJSON,
    credentialsFilePath = 'credentials.json',
    nodeEnv = process.env.NODE_CREDENTIALS_ENV || process.env.NODE_ENV || 'development',
    masterKey,
  } = {}) {
    this.decryptFnc = decryptFnc;
    this.encryptFnc = encryptFnc;
    this.credentialsFilePath = credentialsFilePath;
    this.masterKey = masterKey;
    this._credentials = {};
    this._credentialsEnv = {};
    this.nodeEnv = nodeEnv === '' ? 'development' : nodeEnv;
    this.configured = false;
  }

  get credentials() {
    if (!this.configured) {
      this.config();
    }
    return this._credentials;
  }

  get credentialsEnv() {
    if (!this.configured) {
      this.config();
    }
    return this._credentialsEnv;
  }

  setCredentials(credentials) {
    this._credentials = { ...credentials };
    this._credentialsEnv = get(credentials, this.nodeEnv, {});
  }

  config({ keyValue, path } = {}) {
    if (path) {
      this.credentialsFilePath = path;
    }
    const key = keyValue || this.getMasterKey();
    const text = fs.readFileSync(`${this.credentialsFilePath}.enc`, 'utf8');
    const [credentialsText, iv] = this.decryptFnc(key, text);
    const credentialsTextRendered = render(credentialsText);
    const credentials = JSON.parse(credentialsTextRendered);
    this.setCredentials(credentials);
    this.configured = true;
    return credentials;
  }

  async encryptFile({ keyValue } = {}) {
    const key = keyValue || this.getMasterKey();
    const text = fs.readFileSync(this.credentialsFilePath, 'utf8').trim();
    let iv;
    try {
      iv = fs.readFileSync(`${this.credentialsFilePath}.iv`, 'utf8').trim();
    } catch {
      iv = null;
    }
    const cipherBundle = await this.encryptFnc(key, text, iv);
    fs.writeFileSync(`${this.credentialsFilePath}.enc`, cipherBundle);
    return `${this.credentialsFilePath}.enc`;
  }

  editCredentials({ keyValue } = {}) {
    const key = keyValue || this.getMasterKey();
    const text = fs.readFileSync(`${this.credentialsFilePath}.enc`, 'utf8');
    const [decryptCredentials, iv] = this.decryptFnc(key, text);
    fs.writeFileSync(`${this.credentialsFilePath}`, decryptCredentials, 'utf8');
    fs.writeFileSync(`${this.credentialsFilePath}.iv`, iv, 'utf8');
    return this.credentialsFilePath;
  }

  createNewKey() {
    const newKey = core.newKey();
    fs.writeFileSync(`${this.credentialsFilePath}.key`, newKey);
    return newKey;
  }

  getMasterKey() {
    try {
      return (
        this.masterKey ||
        process.env.NODE_MASTER_KEY ||
        fs.readFileSync(`${this.credentialsFilePath}.key`, 'utf8').trim()
      );
    } catch {
      return undefined;
    }
  }
}
module.exports.Vault = Vault;
