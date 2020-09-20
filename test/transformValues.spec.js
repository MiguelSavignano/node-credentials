const { transformValues } = require('../src/transformValues');
require('./helpers/matchers');
const complexJSON = require('./examples/transformValues/complex.json');

describe('core', () => {
  test('transformValues sync', () => {
    const result = transformValues(complexJSON, (value) => `${value} MOCK`);
    expect(result).toMatchSnapshot();
  });

  test('transformValues async', async () => {
    const result = await transformValues(complexJSON, async (value) => `${value} MOCK`);
    expect(result).toMatchSnapshot();
  });
});
