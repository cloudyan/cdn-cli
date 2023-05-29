
import * as path from 'path';
import glob from 'glob';
import dirGlob from 'dir-glob';
import fse from 'fs-extra'
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
      const fileArr = file.split('/').slice(1);
      fileArr.unshift(cdnHost)
      return {
        file: fileArr.join('/'),
        isFile: isFileSync(fullPath),
        from: fullPath,
      }
    });
    // 需要过滤掉目录
    return result.filter((file) => file.isFile).map(item => item.file);
  });
}

await getFiles(source).then(res => {
  console.log(res);

  // 将文件写入 dist/index.html
  // 可通过简单的模板编译完成
  const tpl = fse.readFileSync(path.resolve('./public/index.html'), 'utf-8')
  const content = `<ol>`+ res.map(item => {
    return `<li><a href="${item}" target="_blank" rel="noopener noreferrer nofollow">${item}</a></li>`
  }).join('\n') + '</ol>'
  // console.log(res)
  const result = compileTpl(tpl, {list: content})
  fse.writeFileSync(path.resolve('./dist/index.html'), result)
  console.log('\n生成 dist 站点成功\n')
  console.log(result)
  console.log('\n')
})

function compileTpl(tpl, data) {
  const reg = /{{([a-zA-Z_$][a-zA-Z0-9_.]*)}}/g
  return tpl.replace(reg, (row, key, offset, string) => {
    // return data[key] || raw;

    var paths = key.split('.');
    var lookup = data;
    while (paths.length > 0){
      lookup = lookup[paths.shift()];
    }
    return lookup || raw;
  })
}
