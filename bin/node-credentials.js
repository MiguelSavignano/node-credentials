#! /usr/bin/env node
const cli = require('../src/cli');
const commandLineArgs = require('command-line-args');

const parseCommand = () => {
  const mainDefinitions = [{ name: 'command', defaultOption: true }];
  const mainOptions = commandLineArgs(mainDefinitions, {
    stopAtFirstUnknown: true,
  });
  const argv = mainOptions._unknown || [];
  const globalOptions = [{ name: 'path', type: String }];
  const options = commandLineArgs(globalOptions, { argv });

  return {
    command: mainOptions.command,
    options: options || defaultOptions,
  };
};

const { command, options } = parseCommand();
const uknowFnc = () => console.log('invalid command');

const commandFnc = cli[command] || uknowFnc;
commandFnc(options);
