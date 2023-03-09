#!/usr/bin/env node

const { Command } = require('commander');
const pkg = require('../package.json');
const updateCheck = require('../lib/update');
const { initConfig, clearConfig } = require('../lib/init');
const deployAction = require('../lib/deploy');

// https://github.com/tj/commander.js/blob/HEAD/Readme_zh-CN.md
const program = new Command();
program.version(pkg.version, '-v, --version', 'output the current version');

program
  .command('update')
  .description('Check the @deepjs/cdn-cli version.')
  .action(() => {
    updateCheck()
  })

program
  .command('init')
  .description('Initial configuration.')
  .action(() => {
    initConfig()
  })

program
  .command('clear')
  .description('Clear configuration.')
  .action(() => {
    clearConfig()
  })

program
  .command('deploy')
  .argument('[source]', 'Select the files to be deployed', './')
  .argument('[target]', 'Select the target path to be deployed', './cdn')
  .option('-s, --site', 'Site deployment mode')
  .option('-p, --preview', 'Upload preview check')
  .option('-f, --force', 'Force overwrite upload')
  .action((source, target, options) => {
    deployAction(source, target, options);
  })

program.parse(process.argv);
