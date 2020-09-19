const fs = require('fs');
const commandLineUsage = require('command-line-usage');
const Vault = require('./vault').Vault;

const init = ({ path }) => {
  const vault = new Vault({ credentialsFilePath: path });
  if (fs.existsSync(`${vault.credentialsFilePath}.key`)) {
    console.log('Warning credentials.json.key exists, delete credentials.json.key to generate new key');
  } else {
    const masterKey = vault.getMasterKey(false) || vault.createNewKey();
    fs.writeFileSync(`${vault.credentialsFilePath}.key`, masterKey);
    vault
      .encryptFile()
      .then(() => {
        try {
          fs.unlinkSync(`${vault.credentialsFilePath}.iv`);
        } catch {}
      })
      .catch((error) => console.error(error));
  }
};

const encrypt = async ({ path }) => {
  const vault = new Vault({ credentialsFilePath: path });
  vault
    .encryptFile()
    .then(() => {})
    .catch(console.error);
};

const edit = ({ path }) => {
  const vault = new Vault({ credentialsFilePath: path });

  if (fs.existsSync(`${vault.credentialsFilePath}.iv`)) {
    encrypt({ path });
  } else if (fs.existsSync(`${vault.credentialsFilePath}`)) {
    decrypt({ path });
  }
};

const decrypt = ({ path }) => {
  const vault = new Vault({ credentialsFilePath: path });
  vault.decryptFile();
};

const help = () => {
  const sections = [
    {
      header: 'node-vault',
      content: 'encrypted your credentials',
    },
    {
      header: 'Synopsis',
      content: 'node-vault <command> <options>',
    },
    {
      header: 'Command List',
      content: [
        { name: 'help', summary: 'help' },
        {
          name: 'init',
          summary: 'create credentials.json.key and encrypt your credentials.json',
        },
        { name: 'encrypt', summary: 'encrypt credentials.json' },
        { name: 'decrypt', summary: 'decrypt credentials.json' },
        { name: 'edit', summary: 'decrypt/encrypt' },
      ],
    },
    {
      header: 'Options',
      content: [{ name: '-p, --path', summary: 'Path for credentials.json file' }],
    },
  ];
  const usage = commandLineUsage(sections);
  console.log(usage);
};

module.exports = {
  init,
  encrypt,
  edit,
  decrypt,
  help,
};
