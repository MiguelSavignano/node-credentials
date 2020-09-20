const YAML = require('yaml');
const { get } = require('lodash');
const fs = require('fs');
const core = require('./core');
const render = require('./template-render').render;

class Vault {
  constructor({
    decryptFnc,
    encryptFnc,
    credentialsFilePath,
    nodeEnv = process.env.NODE_CREDENTIALS_ENV || process.env.NODE_ENV || 'development',
    masterKey,
  } = {}) {
    this.credentialsFilePath = this._inferCredentialsFilePath(credentialsFilePath);
    this.format = this._inferFormat();
    this._setCredentialsFormatAdapter(decryptFnc, encryptFnc);
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

  _inferCredentialsFilePath(credentialsFilePath) {
    if (credentialsFilePath) return credentialsFilePath;
    if (fs.existsSync('credentials.json')) return 'credentials.json';
    if (fs.existsSync('credentials.yaml')) return 'credentials.yaml';
    return 'credentials.json';
  }

  _inferFormat() {
    if (/^.*\.(json)$/.test(this.credentialsFilePath)) {
      return 'json';
    }
    return 'yaml';
  }

  _setCredentialsFormatAdapter(decryptFnc, encryptFnc) {
    if (decryptFnc && encryptFnc) {
      this.decryptFnc = decryptFnc;
      this.encryptFnc = encryptFnc;
      this.parser = JSON;
    } else if (this.format === 'json') {
      this.decryptFnc = core.decryptJSON;
      this.encryptFnc = core.encryptJSON;
      this.parser = JSON;
    } else if (this.format === 'yaml') {
      this.decryptFnc = core.decryptYAML;
      this.encryptFnc = core.encryptYAML;
      this.parser = YAML;
    } else {
      this.decryptFnc = core.decrypt;
      this.encryptFnc = core.encrypt;
      this.parser = JSON;
    }
  }

  setCredentials(credentials) {
    this._credentials = { ...credentials };
    this._credentialsEnv = get(credentials, this.nodeEnv, {});
  }

  config({ masterKey, path, nodeEnv } = {}) {
    if (masterKey) this.masterKey = masterKey;
    if (path) this.credentialsFilePath = path;
    if (nodeEnv) this.nodeEnv = this.nodeEnv;

    const key = this.getMasterKey();
    const text = fs.readFileSync(`${this.credentialsFilePath}`, 'utf8');
    const [credentialsText, iv] = this.decryptFnc(key, text);
    const credentialsTextRendered = render(credentialsText);
    const credentials = this.parser.parse(credentialsTextRendered);
    this.setCredentials(credentials);
    this.configured = true;
    return credentials;
  }

  async encryptFile() {
    const masterKey = this.getMasterKey(true);
    const text = fs.readFileSync(this.credentialsFilePath, 'utf8').trim();
    let iv;
    try {
      iv = fs.readFileSync(`${this.credentialsFilePath}.iv`, 'utf8').trim();
    } catch {
      iv = null;
    }
    const cipherBundle = await this.encryptFnc(masterKey, text, iv);
    fs.writeFileSync(`${this.credentialsFilePath}`, cipherBundle);
    try {
      fs.unlinkSync(`${this.credentialsFilePath}.iv`, 'utf8');
    } catch {}

    return `${this.credentialsFilePath}`;
  }

  decryptFile() {
    const masterKey = this.getMasterKey(true);
    const text = fs.readFileSync(`${this.credentialsFilePath}`, 'utf8');
    const [decryptCredentials, iv] = this.decryptFnc(masterKey, text);
    fs.writeFileSync(`${this.credentialsFilePath}`, decryptCredentials, 'utf8');
    fs.writeFileSync(`${this.credentialsFilePath}.iv`, iv, 'utf8');
    return this.credentialsFilePath;
  }

  createNewKey() {
    const newKey = core.newKey();
    fs.writeFileSync(`${this.credentialsFilePath}.key`, newKey);
    return newKey;
  }

  getMasterKey(force = true) {
    try {
      return (
        this.masterKey ||
        process.env.NODE_MASTER_KEY ||
        fs.readFileSync(`${this.credentialsFilePath}.key`, 'utf8').trim()
      );
    } catch (e) {
      if (force) {
        throw new Error('Missing master key, check .key file or the NODE_MASTER_KEY enviroment variable');
      }
      return undefined;
    }
  }
}
module.exports.Vault = Vault;
