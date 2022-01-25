// const { fileURLToPath } = require('url');
const { dirname } = require('path');
// const { existsSync, copySync, statSync } = require('fs-extra');
const fse = require('fs-extra');

const { existsSync, copySync, statSync } = fse;

// https://stackoverflow.com/questions/64383909/dirname-is-not-defined-in-node-14-version
// exports.__filename = fileURLToPath(import.meta.url);
// exports.__dirname = dirname(__filename);

exports.isFileSync = (path) => {
  const stat = statSync(path);

  return stat.isFile();
};

exports.isDirectorySync = (path) => {
  const stat = statSync(path);

  return stat.isDirectory();
};

exports.copyFileSync = (from, to) => {
  copySync(from, to);
};

exports.checkFileExist = (to) => {
  return new Promise((resolve, reject) => {
    if (existsSync(to)) {
      reject();
    } else {
      resolve();
    }
  });
};
