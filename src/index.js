const Vault = require('./vault').Vault;
const vault = new Vault({
  nodeEnv: process.env.NODE_CREDENTIALS_ENV || process.env.NODE_ENV,
});

module.exports = vault;
module.exports.default = vault;
module.exports.Vault = Vault;
