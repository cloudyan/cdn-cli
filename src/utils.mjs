// import { existsSync, copySync, statSync } from 'fs-extra';
import pkg from 'fs-extra';
const { existsSync, copySync, statSync } = pkg;

export const isFileSync = (path) => {
  const stat = statSync(path);

  return stat.isFile();
};

export const isDirectorySync = (path) => {
  const stat = statSync(path);

  return stat.isDirectory();
};

export const copyFileSync = (from, to) => {
  copySync(from, to);
};

export const canCopyFile = (to) => {
  return new Promise((resolve, reject) => {
    if (existsSync(to)) {
      reject();
    } else {
      resolve();
    }
  });
};
