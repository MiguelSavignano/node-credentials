const YAML = require('yaml');

const core = require('../src/core');
require('./helpers/matchers');

describe('core', () => {
  let NODE_MASTER_KEY = '8aa93853b3ff01c5b5447529a9c33cb9';
  const SHORT_NODE_MASTER_KEY = '12345678';
  let credentials = { key: 'value' };
  let credentialsString = JSON.stringify(credentials);

  test('encrypt', async () => {
    const result = await core.encrypt(NODE_MASTER_KEY, credentialsString);
    expect(result).validEncrypted();
  });

  test('encrypt with any key length', async () => {
    const result = await core.encrypt(SHORT_NODE_MASTER_KEY, credentialsString);
    expect(result).validEncrypted();
  });

  test('encryptYAML', async () => {
    const yaml = `
      key: value
      data:
      - data1
      - data2
    `;

    const result = await core.encryptYAML(NODE_MASTER_KEY, yaml);
    const data = YAML.parse(result);

    expect(data.key).validEncrypted();
    expect(data.data[0]).validEncrypted();
    expect(data.data[1]).validEncrypted();
  });

  test('decrypt', async () => {
    const [result, iv] = await core.decrypt(
      NODE_MASTER_KEY,
      'dwAhexc3PhUrX9i4gutpy6Hb8endKm7hMCQALPspYEc=--84X822lxzoPbO9Jh2knEGA=='
    );
    expect(JSON.parse(result)).toEqual(credentials);
  });

  test('decrypt  with any key length', async () => {
    const [result, iv] = await core.decrypt(
      SHORT_NODE_MASTER_KEY,
      'YhSWFEmk0OOG1qQDmjkEjg==--hfHcXE55MQ0bDOHho2SLag=='
    );
    expect(JSON.parse(result)).toEqual(credentials);
  });

  test('newKey', () => {
    const result = core.newKey();
    expect(result).toHaveLength(32);
  });
});
