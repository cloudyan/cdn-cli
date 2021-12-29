#!/usr/bin/env node --experimental-json-modules

import { Command } from 'commander';
import pkg from '../package.json';
import updateCheck from '../src/update.mjs';
import deployAction from '../src/deploy.mjs';

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
  .command('deploy')
  .argument('[source]', 'Select the files to be deployed')
  .argument('[target]', 'Select the target path to be deployed')
  .option('-s, --site', 'Deploy as a site')
  .action((source, target, options) => {
    if (options.site) {
      console.log('站点部署模式'); // 修改配置项
    }
    deployAction(source, target, options);
  })

program.parse(process.argv);
