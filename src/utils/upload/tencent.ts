import Cos from 'cos-nodejs-sdk-v5';
import fs from 'fs-extra';
import kleur from 'kleur';
import * as logger from '../logger';

const { green, yellow, red } = kleur;

class Tencent implements Upload {
  private client: Cos;
  private readonly bucket: string;
  private readonly region: string;
  private i: number = 1;
  private fileCount: number = 0;

  constructor(environment: Environment.Tencent) {
    this.client = new Cos({
      SecretId: environment.secretId,
      SecretKey: environment.secretKey,
    });
    this.bucket = environment.bucket;
    this.region = environment.region;
  }

  private async checkFile(
    file: File,
  ): Promise<{ exists: boolean; lastModified?: Date }> {
    return new Promise((resolve) => {
      this.client.headObject(
        {
          Bucket: this.bucket,
          Region: this.region,
          Key: file.to,
        },
        (err, data) => {
          if (err) {
            resolve({ exists: false });
          } else {
            resolve({
              exists: true,
              lastModified: new Date(data.headers['last-modified']),
            });
          }
        },
      );
    });
  }

  put(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      let retryCount = 0;
      const maxRetries = 3; // 默认重试3次

      const uploadAction = () => {
        retryCount++;
        const retryInfo = retryCount > 1 ? `第${retryCount - 1}次重试` : '';
        logger.info(
          `开始上传 ${this.i}/${this.fileCount}: ${retryInfo} ${file.to}`,
        );

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
              logger.info(
                `${green('上传成功')} ${this.i}/${this.fileCount}: ${file.to}`,
              );
              resolve();
              return;
            }
            if (retryCount < maxRetries) {
              logger.info(
                `${yellow('上传失败')} ${this.i}/${this.fileCount}: ${
                  file.to
                }, 准备第${retryCount}次重试`,
              );
              uploadAction();
            } else {
              logger.error(
                `${red('上传失败')} ${this.i}/${this.fileCount}: ${
                  file.to
                }, 已达到最大重试次数 ${maxRetries}`,
              );
              reject(new Error(`Failed to upload ${file.to}: ${err.message}`));
            }
          },
        );
      };

      uploadAction();
    });
  }

  public async upload(files: File[]): Promise<void> {
    try {
      this.fileCount = files.length;
      this.i = 1;
      await Promise.all(
        files.map(async (file) => {
          const checkResult = await this.checkFile(file);
          if (file.isNoCache || !checkResult.exists) {
            const result = await this.put(file);
            this.i++;
            return result;
          } else {
            const timeStr = checkResult.lastModified
              .toJSON()
              .substring(0, 19)
              .replace('T', ' ');
            logger.info(
              `${yellow('已存在,跳过')} (上传于 ${timeStr}) ${this.i++}/${
                this.fileCount
              }: ${file.to}`,
            );
          }
        }),
      );
    } catch (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }
  }
}

export default Tencent;
