import type { PutObjectOptions } from 'ali-oss';
import Oss from 'ali-oss';
import kleur from 'kleur';
import * as logger from '../logger';

const { green, yellow, red } = kleur;

class Aliyun implements Upload {
  private client: Oss;
  private i: number = 1;
  private fileCount: number = 0;

  constructor(environment: Environment.Aliyun) {
    this.client = new Oss({
      region: environment.region,
      bucket: environment.bucket,
      accessKeyId: environment.accessKeyId,
      accessKeySecret: environment.accessKeySecret,
    });
  }

  private async checkFile(file: File): Promise<boolean> {
    try {
      const result = await this.client.list(
        {
          prefix: file.to,
          'max-keys': 50,
        },
        {},
      );
      return (result.objects || []).some((item) => item.name === file.to);
    } catch (error) {
      return false;
    }
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

      let retryCount = 0;
      const maxRetries = 3; // 默认重试3次

      const uploadAction = () => {
        retryCount++;
        const retryInfo = retryCount > 1 ? `第${retryCount - 1}次重试` : '';
        logger.info(
          `开始上传 ${this.i}/${this.fileCount}: ${retryInfo} ${file.to}`,
        );

        this.client
          .put(file.to, file.from, putObjectOptions)
          .then((result) => {
            if (result.res.status === 200) {
              logger.info(
                `${green('上传成功')} ${this.i}/${this.fileCount}: ${file.to}`,
              );
              return resolve();
            }
            throw new Error(`Failed to upload ${file.to}`);
          })
          .catch((err) => {
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
              reject(err);
            }
          });
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
          if (file.isNoCache || !(await this.checkFile(file))) {
            const result = await this.put(file);
            this.i++;
            return result;
          } else {
            const result = await this.client.head(file.to);
            const timeStr = new Date(result.res.headers['last-modified'])
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

export default Aliyun;
