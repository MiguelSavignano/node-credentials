const core = require('./src/core');

const KEY = 'c46c2c59282fcc03325c582f286aaa79';

const obj = {
  apike: '1234',
  password: '12344',
};

(async () => {
  const r = await core.transformValues(obj, (value) => {
    return core.encrypt(KEY, value);
  });
  console.log(r);
})();
