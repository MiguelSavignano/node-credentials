const core = require('../src/core');

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

async function run() {
  const result = await core.encryptYAML('NODE_MASTER_KEY', yaml);
  console.log(result)
}

run()
