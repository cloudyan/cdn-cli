import Cos from 'cos-nodejs-sdk-v5';
import fs from 'fs-extra';
import * as logger from '../logger';

class Tencent implements Upload {
  private client: Cos;
  private readonly bucket: string;
  private readonly region: string;

  constructor(environment: Environment.Tencent) {
    this.client = new Cos({
      SecretId: environment.secretId,
      SecretKey: environment.secretKey,
    });
    this.bucket = environment.bucket;
    this.region = environment.region;
  }

  put(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.putObject(
        {
          Bucket: this.bucket,
          Region: this.region,
          Key: file.to,
          Body: fs.createReadStream(file.from),
          ContentLength: fs.statSync(file.from).size,
          CacheControl: file.isNoCache ? 'no-cache' : undefined,
        },
        (err, data) => {
          if (data.statusCode === 200) {
            logger.uploadSuccess(file);
            resolve();
            return;
          }
          logger.uploadFail(file);
          logger.error(err.message);
          reject(new Error(`Failed to upload ${file.to}: ${err.message}`));
        },
      );
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

export default Tencent;
