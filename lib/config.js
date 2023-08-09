function genEnvConfig(type) {
  let prefix = `CDN_${type}`;
  if (type === 'aliyun' && !process.env[`${prefix}_ACCESS_KEY_ID`]) {
    prefix = 'WEBPACK_ALIOSS_PLUGIN';
  }
  return {
    type: `${type}`,
    region: process.env[`${prefix}_REGION`],
    bucket: process.env[`${prefix}_BUCKET`],
    accessKeyId: process.env[`${prefix}_ACCESS_KEY_ID`],
    accessKeySecret: process.env[`${prefix}_ACCESS_KEY_SECRET`],
  }
}

// 默认 html 设置 304
// 其他资源设置强缓存一年
function getHeaders(types) {
  return {
    'Cache-Control': 'max-age=31536000',
  }
}

function getConfig() {
  // 获取本地配置

  const config = genEnvConfig('aliyun')

  console.log('config', config);

  return {
    auths: {
      aliyun: {
        ...genEnvConfig('aliyun'),
      },
      qiniu: {
        ...genEnvConfig('qiniu'),
      },
      tencent: {
        ...genEnvConfig('tencent'),
      },
    },
    retryTimes: 3, // 重试次数: number(>=0),
    existCheck: true, // false: 直接上传; true: 先检测,若已存在则不重新上传(不报错)
    // prefix 或者 ossBaseDir + project 二选一
    cdnBaseDir: 'auto_upload_ci',
    project: '',
    prefix: '',
    exclude: /\.(DS_store|css\.map|js\.map)$/,
    excludeDeploy: /\.(html)$/,
    enableLog: false,
    ignoreError: false,
    removeMode: true,
    gzip: true,
    // https://help.aliyun.com/document_detail/31913.html
    // https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Caching
    options: {
      headers: {
        'Cache-Control': 'no-cache', // html
        // 'Cache-Control': 'max-age=31536000', // 非 html
        // Expires: '', // 格式 2022-10-12T00:00:00.000Z
        // 'Content-Encoding': 'gzip'
      }
    },
  }
}

// default config
exports.config = getConfig();
