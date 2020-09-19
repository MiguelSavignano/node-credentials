const fs = require('fs');
const {
  DECRYPTED_CREDENTIALS,
  ENCRYPTED_CREDENTIALS_BY_COUNTRY,
  ENCRYPTED_CREDENTIALS,
} = require('./examples/credentialsFiles');
const { writeTempFile } = require('./helpers/writeTempFile');

const Vault = require('../src/vault').Vault;
require('./helpers/matchers');

let NODE_MASTER_KEY = '8aa93853b3ff01c5b5447529a9c33cb9';
const MY_ENV_CREDENTIAL = 'MY_ENV_CREDENTIAL';

process.env.NODE_MASTER_KEY = NODE_MASTER_KEY;
process.env.ENV_CREDENTIAL = MY_ENV_CREDENTIAL;

describe.only('node-vault', () => {
  test('encryptFile', async () => {
    const { path } = writeTempFile(DECRYPTED_CREDENTIALS);

    const vault = new Vault({
      credentialsFilePath: path,
    });

    expect(await vault.encryptFile()).validEncryptedFile();
    fs.unlinkSync(path);
  });

  test('decryptFile', async () => {
    const { path } = writeTempFile(ENCRYPTED_CREDENTIALS);

    const vault = new Vault({
      credentialsFilePath: path,
    });
    vault.decryptFile();
    const fileText = fs.readFileSync(path, 'utf8');

    expect(JSON.parse(fileText)).toEqual({
      myKey: 'password',
      myKeyEnv: '<%= process.env.ENV_CREDENTIAL %>',
    });
    fs.unlinkSync(path);
  });

  test('config', () => {
    const { path } = writeTempFile(ENCRYPTED_CREDENTIALS);

    const vault = new Vault({ credentialsFilePath: path });
    vault.config();
    expect(vault.credentials).toEqual({
      myKey: 'password',
      myKeyEnv: 'MY_ENV_CREDENTIAL',
    });
  });

  test('credentials with auto config', () => {
    const { path } = writeTempFile(ENCRYPTED_CREDENTIALS);

    const vault = new Vault({
      credentialsFilePath: path,
    });

    expect(vault.credentials).toEqual({
      myKey: 'password',
      myKeyEnv: 'MY_ENV_CREDENTIAL',
    });
    expect(vault.configured).toEqual(true);
  });

  test('createNewKey', () => {
    const { path } = writeTempFile(ENCRYPTED_CREDENTIALS);

    const vault = new Vault({ credentialsFilePath: path });
    expect(vault.createNewKey()).toHaveLength(32);
    fs.unlinkSync(`${path}.key`);
  });
});

describe('node-vault credentialsEnv', () => {
  const { path } = writeTempFile(ENCRYPTED_CREDENTIALS);

  const vaultFactory = ({ nodeEnv }) => {
    return new Vault({
      nodeEnv,
      masterKey: NODE_MASTER_KEY,
      credentialsFilePath: path,
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
    const { path } = writeTempFile(ENCRYPTED_CREDENTIALS_BY_COUNTRY);

    const vault = new Vault({
      nodeEnv: 'es.development',
      credentialsFilePath: path,
    });

    expect(vault.credentialsEnv).toEqual({ myKey: 'ES password' });
  });
});
