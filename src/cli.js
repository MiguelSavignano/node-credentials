const fs = require('fs');
const commandLineUsage = require('command-line-usage');
const Vault = require('./vault').Vault;
const { editContentInEditor } = require('./editContentInEditor');

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

const edit = async ({ path }) => {
  const vault = new Vault({ credentialsFilePath: path });
  const masterKey = vault.getMasterKey();

  try {
    const [content, iv] = vault.decryptFnc(masterKey, fs.readFileSync(vault.credentialsFilePath, 'utf-8'));
    const mewContent = await editContentInEditor(content);
    const encyptedContent = await vault.encryptFnc(masterKey, mewContent, iv);
    fs.writeFileSync(vault.credentialsFilePath, encyptedContent);
  } catch (err) {
    console.error(err);
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
          summary: 'encrypt your credentials file and create a credentials key file',
        },
        { name: 'encrypt', summary: 'encrypt credentials file' },
        { name: 'decrypt', summary: 'decrypt credentials file' },
        { name: 'edit', summary: 'decrypt/encrypt in text editor' },
      ],
    },
    {
      header: 'Options',
      content: [{ name: '-p, --path', summary: 'Path for credentials file' }],
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
