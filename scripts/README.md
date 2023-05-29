# cdn-libs


此项目用于 cdn externals 提取

NOTE: 此项目 libs 只允许新增, 不允许修改

> cdn 会设置客户端强缓存（目前缓存一年）, 所以更新文件, 客户端并不会生效

cdnHost 可用域名

- `https://cdn.xxx.com`

功能列表

- [x] 提供 down 方法，下载 cdn 资源到指定文件目录
  - [x] 已适配 cdn.bootcdn.net
    - `npm run down https://cdn.bootcdn.net/ajax/libs/vConsole/3.2.0/vconsole.min.js`
  - [x] 已适配 gw.alipayobjects.com
    - `npm run down https://gw.alipayobjects.com/as/g/h5-lib/vue/2.5.13/vue.min.js`
- [x] 发布 `npm run deploy`
  - [x] 将 source 目录下内容发布到 oss cdn 上
- [x] 提供预览列表功能，将所有资源更新到文档列表，便于查阅复制
  - [x] 预览 `npm run list`
  - [x] 格式为 `${cdnHost}/libs/${pkgName}/${version}/${xxx.js}`


路径规划

文件结构参考 https://www.unpkg.com/

```js
// 参考，去掉 ajax
https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js
https://www.unpkg.com/react@16.7.0/umd/react.production.min.js

// 格式
${域名}/${应用名}/${资源}

// 举例
https://cdn.xxx.com/libs/h5a/0.2.1/analytics.js
https://cdn.xxx.com/libs/h5a/0.2.1/analytics-integration-latte-bank-stats.js

https://cdn.xxx.com/libs/antv-g6/4.5.1/g6.min.js
```

域名可能绑定多个, 可随时替换
