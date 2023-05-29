import fse from 'fs-extra';

const { existsSync, copySync, statSync } = fse;

export const isFileSync = (path) => {
  const stat = statSync(path);
  return stat.isFile();
};


