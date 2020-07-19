const core = require('./src/core');

const KEY = 'c46c2c59282fcc03325c582f286aaa79';

const obj = {
  apike: '1234',
  password: 12344,
  keys: ['1234', '123'],
  config: [
    {
      data: 'data',
    },
    {
      data: 'data2',
    },
    '12345',
    78,
  ],
  errors: [[1]],
  error: null,
  data2: undefined,
  database: {
    user: '1234',
    password: '12345',
  },
};

(async () => {
  const r = await core.transformValues(obj, (value) => {
    return core.encrypt(KEY, `${value}`);
  });
  console.log(r);
})();
