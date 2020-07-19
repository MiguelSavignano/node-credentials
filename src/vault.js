const core = require('./core');
const render = require('./template-render').render;
var fs = require('fs');

class Vault {
  constructor({
    decryptFnc = core.decrypt,
    encryptFnc = core.encrypt,
    credentialsFilePath = 'credentials.json',
    nodeEnv = 'development',
  } = {}) {
    this.decryptFnc = decryptFnc;
    this.encryptFnc = encryptFnc;
    this.credentialsFilePath = credentialsFilePath;
    this.credentials = {};
    this.credentialsEnv = {};
    this.nodeEnv = nodeEnv === '' ? 'development' : nodeEnv;
  }

  setCredentials(credentials) {
    this.credentials = { ...credentials };
    this.credentialsEnv = { ...credentials[this.nodeEnv] };
  }

  config({ keyValue, path } = {}) {
    if (path) {
      this.credentialsFilePath = `${path}/credentials.json`;
    }
    const key = keyValue || this.getMasterKey();
    const text = fs.readFileSync(`${this.credentialsFilePath}.enc`, 'utf8');
    const credentialsText = this.decryptFnc(key, text);
    const credentialsTextRendered = render(credentialsText);
    const credentials = JSON.parse(credentialsTextRendered);
    this.setCredentials(credentials);
    return credentials;
  }

  async encryptFile({ keyValue } = {}) {
    const key = keyValue || this.getMasterKey();
    const text = fs.readFileSync(this.credentialsFilePath, 'utf8').trim();
    const cipherBundle = await this.encryptFnc(key, text);
    fs.writeFileSync(`${this.credentialsFilePath}.enc`, cipherBundle);
    return `${this.credentialsFilePath}.enc`;
  }

  editCredentials({ keyValue } = {}) {
    const key = keyValue || this.getMasterKey();
    const text = fs.readFileSync(`${this.credentialsFilePath}.enc`, 'utf8');
    const decryptCredentials = this.decryptFnc(key, text);
    fs.writeFileSync(`${this.credentialsFilePath}`, decryptCredentials, 'utf8');
    return this.credentialsFilePath;
  }

  createNewKey() {
    const newKey = core.newKey();
    fs.writeFileSync(`${this.credentialsFilePath}.key`, newKey);
    return newKey;
  }

  getMasterKey() {
    return process.env.NODE_MASTER_KEY || fs.readFileSync(`${this.credentialsFilePath}.key`, 'utf8').trim();
  }
}
module.exports.Vault = Vault;
