// 获取所有要上传的资源
const path = require('path');
const glob = require('glob');
const dirGlob = require('dir-glob');
const { first } = require('lodash');
const { isFileSync } = require('./utils');
const { config } = require('./config');

/**
 * 遍历目录
 * @param {string} from
 */
const walk = (from) => {
  return new Promise((resolve) => {
    glob(from, {}, (err, matches) => {
      if (err) {
        logger.error(err.message);
        process.exit(1);
      }
      resolve(matches);
    });
  });
};

exports.getFiles = async function getFiles(source, target, options) {
  const from = first(dirGlob.sync(source));
  return walk(from).then(res => {
    const arr = res.filter((file) => {
      // 过滤文件
      if (!options.site && config.excludeDeploy.test(file)) return false;
      if (config.exclude.test(file)) return false;
      return true;
    });
    const fixTo = from === '**' ? f => f : f => f.replace(path.dirname(from), '');
    const result = arr.map((file, index) => {
      const fullPath = path.resolve('.', file);
      let to = path.join(target, fixTo(file));
      if (to.indexOf('/') === 0) to.replace('/', '');
      return {
        isFile: isFileSync(fullPath),
        from: fullPath,
        to,
      }
    });
    // 需要过滤掉目录
    // 排序, 将 html 文件单独处理排序在最后
    return result.filter((file) => file.isFile);
  });
}
