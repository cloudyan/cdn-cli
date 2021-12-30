import logSymbols from 'log-symbols';
import path from 'path';
import chalk from 'chalk';
import dirGlob from 'dir-glob';
import { first } from 'lodash-es';
import { getFiles } from './files.mjs';
import { config } from './config.mjs';
import { upload } from './upload/index.mjs';
// import { __dirname } from './utils.mjs';

// const configPath = path.resolve(__dirname, '../config.json');

// 安全检查
// 如果上传的文件包含了 package.json 则取消上传

async function deployAction(from = './', to = './cdn', options = {}) {
  // console.log(from, to);
  getFiles(from, to, options).then(files => {
    const securityCheck = files.some((file) => { return /package\.json$/.test(file.from) });
    // console.log(files, securityCheck);
    if (securityCheck) {
      console.log(`\n操作取消: 请检查你上传的目录是否符合预期 ${path.resolve('.', from)}\n`);
      // throw Error(`操作取消: 请检查你上传的目录是否符合预期 ${from}`);
      process.exit(1);
    }

    // console.log(files);
    upload(files);
  });
}

export default deployAction;
