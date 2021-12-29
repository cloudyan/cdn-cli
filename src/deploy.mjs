import logSymbols from 'log-symbols';
import path from 'path';
import chalk from 'chalk';
import { getFiles } from './files.mjs';
// import { __dirname } from './utils.mjs';

// const configPath = path.resolve(__dirname, '../config.json');

async function deployAction(from = './', to = './cdn', options = {}) {
  // console.log(from, to);
  getFiles(from, to, options).then(res => {
    console.log(res);
  });
}

export default deployAction;
