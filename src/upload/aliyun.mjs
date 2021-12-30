import AliOss from 'ali-oss';

export class Aliyun {
  constructor(options = {}) {
    this.client = new AliOss(options);
  }
  uploadFile(file, options) {
    const { from, to } = file;
    return this.client.put(to, from);
  }
  checkFile(file) {
    return this.client.list({
      prefix: file.to,
      'max-keys': 50,
    });
  }
}
