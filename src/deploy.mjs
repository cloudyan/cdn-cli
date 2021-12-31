import logSymbols from 'log-symbols';
import path from 'path';
import chalk from 'chalk';
import { getFiles } from './files.mjs';
import { config } from './config.mjs';
import { upload } from './upload/index.mjs';
// import { __dirname } from './utils.mjs';

// const configPath = path.resolve(__dirname, '../config.json');

// 安全检查
// 如果上传的文件包含了 package.json 则取消上传
function securityCheck(files, from) {
  const securityCheck = files.some((file) => { return /package\.json$/.test(file.from) });
  if (securityCheck) {
    console.log(`\n操作取消: 请检查上传目录是否符合预期 ${path.resolve('.', from)}\n`);
    process.exit(1);
  }
}

async function deployAction(from = './', to = './cdn', options = {}) {
  // console.log(from, to);
  getFiles(from, to, options).then(files => {
    securityCheck(files, from);

    if (options.site) {
      console.log('\n当前为: 站点部署模式\n'); // 修改配置项
    }

    if (options.check) {
      console.log(files);
      process.exit(1);
    } else {
      upload(files);
    }
  });
}

export default deployAction;
