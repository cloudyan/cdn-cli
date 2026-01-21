module.exports = {
  rules: [
    {
      from: 'dist',
      to: '.',
      ignore: ['**/*.map', '**/.DS_store'],
      noCache: ['**/*.html'],
      lastUpload: ['**/*.html'],
    },
  ],
  environments: {
    production: {
      // 文档: https://help.aliyun.com/zh/oss/user-guide/regions-and-endpoints
      // 公共云
      //   Endpoint 格式: https://<region>.aliyuncs.com
      //   Endpoint 示例: https://oss-cn-hangzhou.aliyuncs.com
      // 金融云
      //   Endpoint 格式: https://<region>.aliyuncs.com
      //   Endpoint 示例: https://oss-cn-hzjbp-b-internal.aliyuncs.com
      type: 'aliyun',
      region: 'oss-cn-hangzhou',
      bucket: 'xxx',
      accessKeyId: 'xxx',
      accessKeySecret: 'xxx',
      domain: 'https://xxx.xxx.com',, // 这个未使用
    },
    testing: {
      // 注意关注价格: https://www.qiniu.com/prices/kodo#payasyougo
      // 文档:
      //   存储区域和访问域名: https://developer.qiniu.com/kodo/1671/region-endpoint-fq
      //   AWS S3 协议服务域名: https://developer.qiniu.com/kodo/4088/s3-access-domainname
      // AWS S3 协议格式: http(s)://<存储桶bucket名称>.s3.<存储地域Endpoint>.qiniucs.com
      // AWS S3 协议示例: http(s)://cdn-xxx-com.s3.cn-east-1.qiniucs.com
      // NOTE: 可在 产品服务-对象存储-空间管理-空间概览 中查看
      type: 'qiniu',
      region: 'cn-east-1',
      bucket: 'xxx',
      accessKey: 'xxx',
      secretKey: 'xxx',
      domain: 'https://xxx.xxx.com',
    },
    development: {
      type: 'tencent',
      region: '',
      bucket: '',
      appId: '',
      secretId: '',
      secretKey: '',
      domain: '',
    },
  },
};
