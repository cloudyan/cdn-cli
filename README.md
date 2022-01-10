# cdn-cli 工具

## 使用

```bash
npx pnpm add --global
cdn deploy [source] [target]
```

## 功能列表

配置从环境变量里取

- `update` 升级 cli 版本
- `deploy [--site] [source] [target]` 将选中目录中的文件按当前项目结构上传到目标文件夹
  - 限制上传文件到根目录（但不限制上传目录到根目录）
  - `--site` 为部署站点模式
  - `--preview` 仅做上传预览
  - `--force` 强制覆盖上传
- 配置应用用 STS, 未支持时, 先使用 ~/.cdn.config.js
  - `init` 初始化配置文件 (本地使用)
- 误传检测
  - 不能再 package.json 文件夹下直接默认操作
- `refresh <target_path>` 刷新 cdn
  - 可刷新 dir 或 file 路径, 支持多个
- 安全管控
  - 从安全方面考虑, 不应该使用 Ak/Sk 配置, 而应该使用 STS(Security Token Service，临时授权访问) 来操作
  - https://help.aliyun.com/document_detail/28801.html
  - 这里可以尝试通过 serverless 来提供 STS 服务
  - `--token <token_url>` 通过 token 上传 oss
- 接入发布系统


配置

- 可配置多个上传空间
- 可控制同时上传多个空间

访问域名和空间无强绑定关系
