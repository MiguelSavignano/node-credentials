const Vault = require('./vault').Vault;
const vault = new Vault();

module.exports = vault;
module.exports.default = vault;
module.exports.Vault = Vault;
