const core = require('../src/core');
require('./helpers/matchers');
const complexJSON = require('./examples/transformValues/complex.json');

describe('core', () => {
  let NODE_MASTER_KEY = '8aa93853b3ff01c5b5447529a9c33cb9';
  let credentials = { key: 'value' };
  let credentialsString = JSON.stringify(credentials);
  test('encrypt', async () => {
    const result = await core.encrypt(NODE_MASTER_KEY, credentialsString);
    expect(result).validEncrypted();
  });

  test('decrypt', async () => {
    const [result, iv] = await core.decrypt(
      NODE_MASTER_KEY,
      'dwAhexc3PhUrX9i4gutpy6Hb8endKm7hMCQALPspYEc=--84X822lxzoPbO9Jh2knEGA=='
    );
    expect(JSON.parse(result)).toEqual(credentials);
  });

  test('transformValues sync', () => {
    const result = core.transformValues(complexJSON, (value) => `${value} MOCK`);
    expect(result).toMatchSnapshot();
  });

  test('transformValues async', async () => {
    const result = await core.transformValues(complexJSON, async (value) => `${value} MOCK`);
    expect(result).toMatchSnapshot();
  });
});
