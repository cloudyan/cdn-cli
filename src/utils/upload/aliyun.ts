import type { PutObjectOptions } from 'ali-oss';
import Oss from 'ali-oss';
import * as logger from '../logger';

class Aliyun implements Upload {
  private client: Oss;

  constructor(environment: Environment.Aliyun) {
    this.client = new Oss({
      region: environment.region,
      bucket: environment.bucket,
      accessKeyId: environment.accessKeyId,
      accessKeySecret: environment.accessKeySecret,
    });
  }

  private put(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const putObjectOptions: PutObjectOptions = file.isNoCache
        ? {
            headers: {
              'Cache-Control': 'no-cache',
            },
          }
        : {};
      this.client.put(file.to, file.from, putObjectOptions).then((result) => {
        if (result.res.status === 200) {
          logger.uploadSuccess(file);
          return resolve();
        }
        logger.uploadFail(file);
        console.log(result);
        reject(new Error(`Failed to upload ${file.to}`));
      });
    });
  }

  public async upload(files: File[]): Promise<void> {
    try {
      await Promise.all(files.map((file) => this.put(file)));
    } catch (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }
  }
}

export default Aliyun;
