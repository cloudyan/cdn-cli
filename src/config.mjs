
export const config = {
  auths: {
    aliyun: {

    },
    cloudai: {

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
  envPrefix: '',
  // https://help.aliyun.com/document_detail/31913.html
  // https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Caching
  options: {
    headers: {
      // 'Cache-Control': 'max-age=31536000',
      // Expires: '', // 格式 2022-10-12T00:00:00.000Z
      // 'Content-Encoding': 'gzip'
    }
  },
}
