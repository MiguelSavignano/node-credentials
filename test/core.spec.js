const YAML = require('yaml');

const core = require('../src/core');
require('./helpers/matchers');

describe('core', () => {
  let NODE_MASTER_KEY = '8aa93853b3ff01c5b5447529a9c33cb9';
  const SHORT_NODE_MASTER_KEY = '12345678';
  let credentials = { key: 'value' };
  let credentialsString = JSON.stringify(credentials);

  test('encrypt', () => {
    const result = core.encrypt(NODE_MASTER_KEY, credentialsString, "SlFF0O9iHgKpcds+/6nbEg==");
    expect(result).validEncrypted();
  });

  test('encrypt with any key length', () => {
    const result = core.encrypt(SHORT_NODE_MASTER_KEY, credentialsString, "SlFF0O9iHgKpcds+/6nbEg==");
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

  test('encryptYAML with merge keys', async () => {
    const yaml = `
      source: &base
        a: "password1" # my comment 1
        b: "password2"
        c:
          - ca: 1
          - cb: 2
      target:
        <<: *base
        d: "password4"
        e: null
    `;

    const result = await core.encryptYAML(NODE_MASTER_KEY, yaml, "SlFF0O9iHgKpcds+/6nbEg==");
    expect(result).toMatchSnapshot();
  });

  test('encryptYAML with no-encrypt comments', async () => {
    const yaml = `
    public_key: value #no-encrypt
    secret: value2
    data2:
     - name: name # no-encrypt
       password: mypassword
    data:
     - data1
     - data2 # no-encrypt
    `;

    const result = await core.encryptYAML(NODE_MASTER_KEY, yaml, "SlFF0O9iHgKpcds+/6nbEg==");
    expect(result).toMatchSnapshot();
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
