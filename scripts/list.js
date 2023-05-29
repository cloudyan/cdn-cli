
import * as path from 'path';
import glob from 'glob';
import dirGlob from 'dir-glob';
import { first } from 'lodash-es';
import { isFileSync } from './utils.js';

// 遍历目录，获取资源列表
// const source = process.argv.slice(2)[0]
const source = './source'
console.log('遍历: ', source);

const cdnHost = 'https://cdn.xxx.com'


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

async function getFiles(source) {
  const from = first(dirGlob.sync(source));
  return walk(from).then(res => {
    const result = res.map((file, index) => {
      const fullPath = path.resolve('.', file);
      // console.log(file, fullPath)
      // let to = path.join(target, fixTo(file));
      // if (to.indexOf('/') === 0) to.replace('/', '');
      const fileArr = file.split('/').slice(1);
      fileArr.unshift(cdnHost)
      return {
        file: fileArr.join('/'),
        isFile: isFileSync(fullPath),
        from: fullPath,
      }
    });
    // 需要过滤掉目录
    // 排序, 将 html 文件单独处理排序在最后
    return result.filter((file) => file.isFile).map(item => item.file);
  });
}

getFiles(source).then(res => {
  console.log(res)
})
