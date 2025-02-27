import kleur from 'kleur';
import qiniu, { form_up } from 'qiniu';
import * as logger from '../logger';

const { green, yellow, red } = kleur;

class Qiniu implements Upload {
  private client: form_up.FormUploader;
  private readonly putExtra: form_up.PutExtra;
  private readonly uploadToken: string;
  private readonly bucket: string;
  private readonly mac: qiniu.auth.digest.Mac;

  private i: number = 1;
  private fileCount: number = 0;

  constructor(environment: Environment.Qiniu) {
    this.mac = new qiniu.auth.digest.Mac(
      environment.accessKey,
      environment.secretKey,
    );
    const putPolicy = new qiniu.rs.PutPolicy({
      scope: environment.bucket,
      expires: 7200,
    });
    this.bucket = environment.bucket;
    this.uploadToken = putPolicy.uploadToken(this.mac);
    const config = new qiniu.conf.Config();
    this.client = new qiniu.form_up.FormUploader(config);
    this.putExtra = new qiniu.form_up.PutExtra();
  }

  private async checkFile(file: File): Promise<boolean> {
    return new Promise((resolve) => {
      const bucketManager = new qiniu.rs.BucketManager(this.mac);
      bucketManager.stat(this.bucket, file.to, (err, respBody, respInfo) => {
        if (err || respInfo.statusCode !== 200) {
          resolve(false);
        } else {
          const timeStr = new Date(
            +new Date(respBody.putTime / 10000) + 28800000,
          )
            .toJSON()
            .substring(0, 19)
            .replace('T', ' ');
          logger.info(
            `${green('已存在,免上传')} (上传于 ${timeStr}) ${this.i}/${
              this.fileCount
            }: ${file.to}`,
          );
          resolve(true);
        }
      });
    });
  }

  private put(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      let retryCount = 0;
      const maxRetries = 3; // 默认重试3次

      const uploadAction = () => {
        retryCount++;
        const retryInfo = retryCount > 1 ? `第${retryCount - 1}次重试` : '';
        logger.info(
          `开始上传 ${this.i}/${this.fileCount}: ${retryInfo} ${file.to}`,
        );

        this.client.putFile(
          this.uploadToken,
          file.to,
          file.from,
          this.putExtra,
          (err, respBody, respInfo) => {
            if (respInfo?.statusCode === 200) {
              logger.info(
                `${green('上传成功')} ${this.i++}/${this.fileCount}: ${
                  file.to
                }`,
              );
              return resolve();
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
              reject(
                new Error(
                  `Failed to upload ${file.to}: ${
                    err?.message || 'Unknown error'
                  }`,
                ),
              );
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
          if (file.isNoCache || !(await this.checkFile(file))) {
            return this.put(file);
          } else {
            // logger.info(`文件已存在，跳过上传: ${file.to}`);
          }
        }),
      );
    } catch (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }
  }
}

export default Qiniu;
