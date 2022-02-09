import { resolve } from 'path';
import fs from 'fs';
import { checkFileExist, copyFileSync, __dirname } from './utils.js';

const configTplPath = resolve(__dirname, '../templates/cdn.config.js');
const configTargetPath = resolve(process.env.HOME, '.cdn.config.js');
// console.log(process.env);
// console.log(configTargetPath);

export function initConfig() {
  checkFileExist(configTargetPath)
    .then(() => {
      copyFileSync(configTplPath, configTargetPath)
      console.log('\n~/.cdn.config.js 初始化完成\n')
    })
    .catch(() => {
      console.log('\n~/.cdn.config.js 文件已存在\n');
    });
}

export function clearConfig() {
  checkFileExist(configTargetPath)
    .then(() => {
      console.log('\n不存在配置文件\n');
    })
    .catch(() => {
      fs.unlinkSync(configTargetPath);
      console.log('\n配置清除成功\n');
    });
}

export function getLocalConfig() {
  return checkFileExist(configTargetPath)
  .catch(() => {
    return import(configTargetPath);
  }).then(() => {
    console.log('\n无本地配置\n');
    return {default: {}}
  });
}
