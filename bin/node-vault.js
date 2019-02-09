#! /usr/bin/env node
const fs = require("fs");
const commandLineArgs = require("command-line-args");
const commandLineUsage = require("command-line-usage");
const Vault = require("../src/node-vault").Vault;
const mainDefinitions = [{ name: "command", defaultOption: true }];
const mainOptions = commandLineArgs(mainDefinitions, {
  stopAtFirstUnknown: true
});
const argv = mainOptions._unknown || [];

const encrypt = options => {
  const vault = new Vault();
  if (fs.existsSync(`${vault.credentialsFilePath}.key`)) {
    vault.encryptFile();
    fs.unlinkSync(`${vault.credentialsFilePath}`);
  } else {
    console.log(
      "Warning credentials.json.key not exists, create new key with init"
    );
  }
};

const edit = () => {
  const vault = new Vault();
  if (!fs.existsSync(`${vault.credentialsFilePath}.enc`)) {
    console.log("Error credentials.json.enc not exists");
  } else {
    vault.editCredentials();
    fs.unlinkSync(`${vault.credentialsFilePath}.enc`);
  }
};

const init = () => {
  const vault = new Vault();
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
        { name: "decrypt", summary: "decrypt credentials.json.enc" },
        { name: "edit", summary: "decrypt alias" }
      ]
    }
  ];
  const usage = commandLineUsage(sections);
  console.log(usage);
};

const commandCase = { encrypt, edit, decrypt: edit, init, help };

const optionsCase = {
  encrypt: [{ name: "--out", type: String }]
};

const command = mainOptions.command;
const options = commandLineArgs(optionsCase[command], { argv });
const uknowFnc = () => console.log("invalid command");
const commandFnc = commandCase[command] || uknowFnc;
commandFnc(options);
