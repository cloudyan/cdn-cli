const { resolve } = require('path');
const fs = require('fs');
const { checkFileExist, copyFileSync } = require('./utils');

const configTplPath = resolve(__dirname, '../templates/cdn.config.js');
const configTargetPath = resolve(process.env.HOME, '.cdn.config.js');
// console.log(process.env);
// console.log(configTargetPath);

exports.initConfig = function initConfig() {
  checkFileExist(configTargetPath)
    .then(() => {
      copyFileSync(configTplPath, configTargetPath)
      console.log('\n~/.cdn.config.js 初始化完成\n')
    })
    .catch(() => {
      console.log('\n~/.cdn.config.js 文件已存在\n');
    });
}

exports.clearConfig = function clearConfig() {
  checkFileExist(configTargetPath)
    .then(() => {
      console.log('\n不存在配置文件\n');
    })
    .catch(() => {
      fs.unlinkSync(configTargetPath);
      console.log('\n配置清除成功\n');
    });
}

exports.getLocalConfig = function getLocalConfig() {
  return checkFileExist(configTargetPath)
  .catch(() => {
    return require(configTargetPath);
  }).then(() => {
    console.log('\n无本地配置\n');
    return {default: {}}
  });
}
