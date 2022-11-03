const dotenv = require('dotenv');
const core = require('../src/core');
const text = `
DOCKER_USER=docker
DOCKER_PASSWORD=my-password
`
async function run() {
  const encryptResult = await core.encryptDotenv('NODE_MASTER_KEY', text);
  console.log(encryptResult)
  const [result, lastIv] = core.decryptDotEnv('NODE_MASTER_KEY', encryptResult);
  console.log('***************')
  console.log(result, lastIv)
}

run()
