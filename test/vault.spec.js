var fs = require('fs');
const Vault = require('../src/vault').Vault;
require('./helpers/matchers');
let NODE_MASTER_KEY = '8aa93853b3ff01c5b5447529a9c33cb9';
const MY_ENV_CREDENTIAL = 'MY_ENV_CREDENTIAL';

process.env.ENV_CREDENTIAL = MY_ENV_CREDENTIAL;

describe('node-vault', () => {
  let credentialsFilePath = __dirname + '/examples/encrypt/credentials.json';

  afterEach(() => {
    fs.unlinkSync(`${credentialsFilePath}.enc`);
  });

  test('encryptFile', async () => {
    const vault = new Vault({ credentialsFilePath });

    expect(
      await vault.encryptFile({
        keyValue: NODE_MASTER_KEY,
      })
    ).validEncryptedFile();
  });
});

describe('node-vault', () => {
  let credentialsFilePath = __dirname + '/examples/decrypt/credentials.json';

  afterEach(() => {
    fs.unlinkSync(`${credentialsFilePath}`);
  });
  test('editCredentials', () => {
    const vault = new Vault({ credentialsFilePath });
    const result = vault.editCredentials({
      keyValue: NODE_MASTER_KEY,
    });
    const fileText = fs.readFileSync(result, 'utf8');

    expect(JSON.parse(fileText)).toEqual({
      my_key: 'password',
      my_key_env: '<%= process.env.ENV_CREDENTIAL %>',
    });
  });
});

describe('node-vault config', () => {
  let credentialsFilePath = __dirname + '/examples/decrypt/credentials.json';

  test('config', () => {
    const vault = new Vault({ credentialsFilePath });
    vault.config({
      keyValue: NODE_MASTER_KEY,
    });
    expect(vault.credentials).toEqual({
      my_key: 'password',
      my_key_env: 'MY_ENV_CREDENTIAL',
    });
  });
});

describe('node-vault config credentialsFilePath', () => {
  test('config', () => {
    const vault = new Vault();
    vault.config({
      keyValue: NODE_MASTER_KEY,
      path: __dirname + '/examples/decrypt',
    });
    expect(vault.credentials).toEqual({
      my_key: 'password',
      my_key_env: 'MY_ENV_CREDENTIAL',
    });
  });
});

describe('node-vault credentialsEnv', () => {
  const credentialsFile = require('./examples/encryptDecryptEnv/credentials.json');

  const vaultFactory = (nodeEnv) => {
    const vault = new Vault({ nodeEnv });
    vault.config({
      keyValue: NODE_MASTER_KEY,
      path: __dirname + '/examples/encryptDecryptEnv',
    });
    return vault;
  };

  test('NODE_ENV=development', () => {
    const vault = vaultFactory('development');
    expect(vault.credentialsEnv).toEqual({
      my_key: credentialsFile.development.my_key,
    });
  });

  test('NODE_ENV=test', () => {
    const vault = vaultFactory('test');
    expect(vault.credentialsEnv).toEqual({
      my_key: credentialsFile.test.my_key,
    });
  });

  test('NODE_ENV=production', () => {
    const vault = vaultFactory('production');
    expect(vault.credentialsEnv).toEqual({
      my_key: process.env.ENV_CREDENTIAL,
    });
  });
});
