# FAQ

## MaxListenersExceededWarning 警告问题

当执行包时可能会遇到如下警告：

```bash
状态      缓存    本地资源 -> 远端资源
(node:97741) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 exit listeners added to [process]. MaxListeners is 10. Use emitter.setMaxListeners() to increase limit
(Use `node --trace-warnings ...` to show where the warning was created)
[失败]    [支持]    /Volumes/data/code/xxx/dist/favicon.ico -> https://xxx/favicon.ico
Query regions failed with HTTP Status Code 631, Body {"error":"no such bucket"}
```

### 问题原因

这个警告出现的原因是在代码中多次使用了 `process.exit(1)` 来处理上传失败的情况（在阿里云、腾讯云、七牛云等上传实现中），每次调用都会添加一个事件监听器，当监听器数量超过默认的最大值（10 个）时就会触发该警告。

### 解决方案

1. 短期解决方案：

   - 在程序启动时设置更高的监听器限制：
     ```js
     process.setMaxListeners(20); // 或更大的数值
     ```

2. 推荐的长期解决方案：
   - 重构错误处理逻辑，避免直接使用 `process.exit(1)`
     - 将直接使用`process.exit(1)` 的方式改为使用 Promise 的 reject 来传递错误
   - 使用 Promise 的 reject 来传递错误
   - 在最外层统一处理程序退出
   - 确保正确清理和移除不再需要的事件监听器

示例改进代码结构：

```js
class Uploader {
  async upload(files) {
    try {
      await Promise.all(files.map((file) => this.put(file)));
    } catch (error) {
      // 统一错误处理
      throw new Error(`Upload failed: ${error.message}`);
    }
  }

  async put(file) {
    // 失败时抛出错误而不是直接退出
    if (uploadFailed) {
      throw new Error(`Failed to upload ${file.to}`);
    }
  }
}

// 在最外层处理错误和程序退出
async function main() {
  try {
    await uploader.upload(files);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
```

## 七牛上传报 `{"error":"no such bucket"}`

```bash
Query regions failed with HTTP Status Code 631, Body {"error":"no such bucket"}
```

### 问题原因

七牛云的 `bucket` 不存在。

### 解决方案

检查核对 `bucket` 的配置名称。
