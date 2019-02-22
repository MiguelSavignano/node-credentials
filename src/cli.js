const fs = require("fs");
const commandLineUsage = require("command-line-usage");
const Vault = require("./vault").Vault;

const init = ({ path }) => {
  const vault = new Vault({ credentialsFilePath: `${path}/credentials.json` });
  if (fs.existsSync(`${vault.credentialsFilePath}.enc`)) {
    console.log(
      "Warning credentials.json.enc exists, ensure decrypt file before generate new key"
    );
  } else if (fs.existsSync(`${vault.credentialsFilePath}.key`)) {
    console.log(
      "Warning credentials.json.key exists, delete credentials.json.key to generate new key"
    );
  } else {
    vault.createNewKey();
    vault.encryptFile();
    fs.unlinkSync(`${vault.credentialsFilePath}`);
  }
};

const encrypt = ({ path }) => {
  const vault = new Vault({
    credentialsFilePath: `${path}/credentials.json`
  });
  if (fs.existsSync(`${vault.credentialsFilePath}.key`)) {
    vault.encryptFile();
    fs.unlinkSync(`${vault.credentialsFilePath}`);
  } else {
    console.log(
      "Warning credentials.json.key not exists, create new key with init"
    );
  }
};

const edit = ({ path }) => {
  const vault = new Vault({
    credentialsFilePath: `${path}/credentials.json`
  });
  if (!fs.existsSync(`${vault.credentialsFilePath}.enc`)) {
    console.log("Error credentials.json.enc not exists");
  } else {
    vault.editCredentials();
    fs.unlinkSync(`${vault.credentialsFilePath}.enc`);
  }
};

const help = () => {
  const sections = [
    {
      header: "node-vault",
      content: "encrypted your credentials"
    },
    {
      header: "Synopsis",
      content: "node-vault <command> <options>"
    },
    {
      header: "Command List",
      content: [
        { name: "help", summary: "help" },
        {
          name: "init",
          summary:
            "create credentials.json.key and encrypt your credentials.json"
        },
        { name: "encrypt", summary: "encrypt credentials.json" },
        { name: "edit", summary: "decrypt alias" }
      ]
    }
  ];
  const usage = commandLineUsage(sections);
  console.log(usage);
};

module.exports = {
  init,
  encrypt,
  edit,
  help
};
