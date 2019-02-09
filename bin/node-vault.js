#! /usr/bin/env node
const commandLineArgs = require("command-line-args");
const fs = require("fs");
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
  console.log("help");
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
