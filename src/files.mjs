// 获取所有要上传的资源
import * as path from 'path';
import glob from 'glob';
import dirGlob from 'dir-glob';
import { first } from 'lodash-es';
import { isFileSync } from './utils.mjs';
import { config } from './config.mjs';

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

export async function getFiles(source, target, options) {
  const from = first(dirGlob.sync(source));
  return walk(from).then(res => {
    const result = res.filter((file) => {
      // 过滤文件
      if (!options.site && config.excludeDeploy.test(file)) return false;
      if (config.exclude.test(file)) return false;
      return true;
    }).map((file, index) => {
      // console.log(file);
      const fullPath = path.resolve('.', file);
      let to = path.join(target, file.replace(path.dirname(from), ''));
      if (to.indexOf('/') === 0) to.replace('/', '');
      return {
        isFile: isFileSync(fullPath),
        from: fullPath,
        to,
      }
    })
    return result;
  });
}
