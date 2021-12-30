import chalk from 'chalk';
import { config } from '../config.mjs';
import { Aliyun } from './aliyun.mjs';
import { Qiniu } from './qiniu.mjs';
import { Tencent } from './tencent.mjs';
import * as logger from '../logger.mjs';

const { red, green } = chalk;

export const uploadAdapters = {
  aliyun: Aliyun,
  qiniu: Qiniu,
  tencent: Tencent,
}

// 选择的要上传的空间
const selectedEnvs = [
  'aliyun',
];

export async function upload(files) {
  return Promise.all(selectedEnvs.map(env => {
    const auth = config.auths[env];
    const uploadAdapter = uploadAdapters[auth.type];
    const adapter = new uploadAdapter(auth);
    const uploader = new Upload(adapter, files, config);
    return uploader.uploadFiles(files);
  }))
}

class Upload {
  constructor(adapter, files, options = {}) {
    this.adapter = adapter;
    this.config = options;
    this.files = files;
    this.idx = 1;
    this.fileCount = files.length;
  }
  calcPrefix() {
    return '';
  }
  uploadFiles() {
    let i = 0;
    const { fileCount } = this;
    return Promise.all(this.files.map((file) => {
      // const uploadName = `${this.calcPrefix()}/${file.name}`.replace('//', '/');
      if (this.config.existCheck !== true) {
        return this.uploadFile(file, i++)
      } else {
        return this.adapter.checkFile(file).then(res => {
          const arr = (res.objects || []).filter(item => item.name === file.to)
          if (arr && arr.length > 0) {
            const timeStr = getTimeStr(new Date(res.objects[0].lastModified))
            logger.info(`${green('已存在,免上传')} (上传于 ${timeStr}) ${++i}/${fileCount}: ${file.to}`)
          } else {
            throw new Error('not exist & need upload')
          }
        }).catch((err) => {
          // 覆盖上传
          return this.uploadFile(file, i++);
        });
      }
    }))
  }
  uploadFile(file, idx) {
    return new Promise((resolve, reject) => {
      const { from, to } = file;
      file.$retryTime = 0;
      const self = this;
      const { idx, fileCount, adapter } = this;
      function uploadAction() {
        file.$retryTime++;
        logger.info(`开始上传 ${idx}/${fileCount}: ${file.$retryTime > 1 ? '第' + (file.$retryTime - 1) + '次重试' : ''}`, file.to);
        adapter.uploadFile(file, {})
          .then((result) => {
            logger.info(`上传成功 ${idx}/${fileCount}: ${file.to}`)
            resolve();
          }).catch(err => {
            if (file.$retryTime <= self.config.retryTimes) {
              uploadAction();
            } else {
              reject(err);
            }
          })
      }
    });
  }
}

function getTimeStr(d) {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}`
}
