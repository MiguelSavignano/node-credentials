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
  errors: [[1, 2, 3]],
  complex: [[1, { data: [{ a: 4, b: [[8]] }] }]],
  error: null,
  data2: undefined,
  database: {
    user: '1234',
    password: '12345',
  },
  ff: () => {},
};

(async () => {
  const r = await core.transformValues(obj, (value) => {
    return core.encrypt(KEY, `${value}`);
  });
  console.log(JSON.stringify(r, null, 2));
})();
