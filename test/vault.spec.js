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
      myKey: 'password',
      myKeyEnv: '<%= process.env.ENV_CREDENTIAL %>',
    });
  });
});

describe('node-vault credentials with auto config', () => {
  let credentialsFilePath = __dirname + '/examples/decrypt/credentials.json';

  test('credentials', () => {
    const vault = new Vault({ credentialsFilePath });
    process.env.NODE_MASTER_KEY = NODE_MASTER_KEY;
    expect(vault.credentials).toEqual({
      myKey: 'password',
      myKeyEnv: 'MY_ENV_CREDENTIAL',
    });
    process.env.NODE_MASTER_KEY = undefined;
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
      myKey: 'password',
      myKeyEnv: 'MY_ENV_CREDENTIAL',
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
      myKey: 'password',
      myKeyEnv: 'MY_ENV_CREDENTIAL',
    });
  });
});

describe('node-vault credentialsEnv', () => {
  const vaultFactory = ({ nodeEnv }) => {
    return new Vault({
      nodeEnv,
      masterKey: NODE_MASTER_KEY,
      credentialsFilePath: __dirname + '/examples/encryptDecryptEnv/credentials.json',
    });
  };

  test('NODE_ENV=development', () => {
    const vault = vaultFactory({ nodeEnv: 'development' });
    expect(vault.credentialsEnv).toEqual({
      myKey: 'password',
    });
  });

  test('NODE_ENV=test', () => {
    const vault = vaultFactory({ nodeEnv: 'test' });
    expect(vault.credentialsEnv).toEqual({
      myKey: 'password test',
    });
  });

  test('NODE_ENV=production', () => {
    const vault = vaultFactory({ nodeEnv: 'production' });
    expect(vault.credentialsEnv).toEqual({
      myKey: process.env.ENV_CREDENTIAL,
    });
  });

  test('NODE_ENV=es.production', () => {
    const vault = new Vault({
      nodeEnv: 'es.development',
      masterKey: NODE_MASTER_KEY,
      credentialsFilePath: __dirname + '/examples/encryptDecryptEnv/credentialsByCountry.json',
    });

    expect(vault.credentialsEnv).toEqual({ myKey: 'ES password' });
  });
});

describe('node-vault', () => {
  let credentialsFilePath = __dirname + '/examples/encryptDecryptEnv/credentials.json';
  afterEach(() => {
    fs.unlinkSync(`${credentialsFilePath}.key`);
  });

  test('newKey', () => {
    const vault = new Vault({ credentialsFilePath });
    expect(vault.createNewKey()).toHaveLength(32);
  });
});
