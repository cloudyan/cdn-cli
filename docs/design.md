# cdn-cli 工具

## 输出 log

输出格式

```bash
状态      缓存    本地资源 -> 远端资源
[成功] [不支持] ./dist/static/img/v1/2x/1.png -> /static/img/v1/2x/1.png
[成功]   [支持] ./dist/static/img/v1/2x/2.png -> /static/img/v1/2x/2.png
[失败]   [支持] ./dist/static/img/v1/2x/3.png -> /static/img/v1/2x/3.png
[失败] [不支持] ./dist/static/img/v1/2x/4.png -> /static/img/v1/2x/4.png
```

## 功能列表

配置从环境变量里取

- 配置应用用 STS, 未支持时, 先使用 ~/.cdn.config.js 或环境变量支持
  - `init` 初始化配置文件 (本地使用)
- 误传检测
  - 对 source 目录包含 package.json 文件的，做警告提示
- `deploy [source] [target]`
  - 默认 source 和 target 从配置项中读取
    - 允许命令行传入 --source 上传目录 --target 目标目录
  - 限制上传文件到根目录（但不限制上传目录到根目录）
  - `--preview` 仅做上传预览（仅输出日志，不做真实上传）
  - `--force` 强制覆盖上传(默认功能关闭)
  - 缓存配置，从配置项中读取
    - `cache-control: max-age=<seconds>` max-age=31536000
    - `cache-control: no-cache`
- `refresh <target_path>` 刷新 cdn，暂无需支持
  - 可刷新 dir 或 file 路径, 支持多个
- 安全管控（暂无需支持）
  - 从安全方面考虑, 不应该使用 Ak/Sk 配置, 而应该使用 STS(Security Token Service，临时授权访问) 来操作
  - https://help.aliyun.com/document_detail/28801.html
  - 这里可以尝试通过 serverless 来提供 STS 服务
  - `--token <token_url>` 通过 token 上传 oss
- 接入发布系统
  - 可使用环境变量配置 Ak/Sk 等
- 关于浏览
  - 阿里云可以使用 [oss-browser](https://github.com/aliyun/oss-browser/blob/develop/README-CN.md)
  - 七牛可以使用 [kodo-browser](https://developer.qiniu.com/kodo/5972/kodo-browser)
