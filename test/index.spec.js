process.env.NODE_ENV = 'test';
describe('node-vault', () => {
  test('Init with NODE_ENV', () => {
    const vault = require('../src/index');
    expect(vault.nodeEnv).toEqual('test');
  });

  test('credentials inmutable in the same process', () => {
    process.env.NODE_ENV = 'production';
    const vault = require('../src/index');
    expect(vault.nodeEnv).toEqual('test');
  });

  test('diferent credentials in the same process, new Vault', () => {
    process.env.NODE_ENV = 'test';
    const Vault = require('../src/index').Vault;
    const vault = new Vault({ nodeEnv: process.env.NODE_ENV });
    expect(vault.nodeEnv).toEqual('test');
    // the new instance it's not mutable
    process.env.NODE_ENV = 'production';
    expect(vault.nodeEnv).toEqual('test');
  });
});
