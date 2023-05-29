import * as path from 'path';
import download from 'download';
import fse from 'fs-extra';
import { isFileSync } from './utils.js';

const { existsSync, copySync, statSync } = fse;

// npm run down https://cdn.bootcdn.net/ajax/libs/vConsole/3.2.0/vconsole.min.js
const url = process.argv.slice(2)[0]

// 示例
// const urlArrs = [
//   'https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js',
//   'https://cdn.bootcdn.net/ajax/libs/antv-g6/4.5.0/g6.min.js',
// ]

// 如果已存在，应该提示不要下载，但可以强制下载，用于对比，不要提交入库

;(async () => {
  const file = cdnAdaptor(url)

  // 先检查当前目录下文件是否存在
  const fileFullPath = path.join(file.filepath)
  // console.log(downfileFullPath)
  if (existsSync(fileFullPath)) {
    console.log(`\nurl: ${url}`)
    console.log(`\n请不要覆盖下载, 该文件已存在: ${file.filepath}`)
    console.log(`\n`)
  } else {
    console.log('正在下载: ', url, '\n');
    const downpath = `./source/${dir.join('/')}`;
    await download(url, downpath);
    console.log('下载完成');
  }
})();


function cdnAdaptor(url) {
  const dir = url.replace(/^https?:\/\//, '').split('/');
  // console.log('dir', dir)
  let filepath = ''

  // 适配不同 cdn 地址
  if (dir[0] === 'cdn.bootcdn.net') {
    // https://cdn.bootcdn.net/ajax/libs/vConsole/3.2.0/vconsole.min.js
    dir.shift();
    dir.shift();
    filepath = `./source/${dir.join('/')}`;
    dir.pop();
  } else if (dir[0] === 'gw.alipayobjects.com') {
    // https://gw.alipayobjects.com/as/g/h5-lib/vue/2.5.13/vue.min.js
    dir.shift();
    dir.shift();
    dir.shift();
    dir.shift();
    dir.unshift('libs');
    filepath = `./source/${dir.join('/')}`;
    dir.pop();
  }

  const downpath =

  return {
    url,
    dir,
    filepath,
  }
}
