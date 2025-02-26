import qiniu, { form_up } from 'qiniu';
import * as logger from '../logger';

class Qiniu implements Upload {
  private client: form_up.FormUploader;
  private readonly putExtra: form_up.PutExtra;
  private readonly uploadToken: string;

  constructor(environment: Environment.Qiniu) {
    const mac = new qiniu.auth.digest.Mac(
      environment.accessKey,
      environment.secretKey,
    );
    const putPolicy = new qiniu.rs.PutPolicy({
      scope: environment.bucket,
      expires: 7200,
    });
    this.uploadToken = putPolicy.uploadToken(mac);
    const config = new qiniu.conf.Config();
    this.client = new qiniu.form_up.FormUploader(config);
    this.putExtra = new qiniu.form_up.PutExtra();
  }

  private put(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.putFile(
        this.uploadToken,
        // Fixed to path problems
        file.to, // file.to.substring(1),
        file.from,
        this.putExtra,
        (err, respBody, respInfo) => {
          if (respInfo?.statusCode === 200) {
            logger.uploadSuccess(file);
            return resolve();
          }
          logger.uploadFail(file);
          console.log(err?.message);
          reject(
            new Error(
              `Failed to upload ${file.to}: ${err?.message || 'Unknown error'}`,
            ),
          );
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

export default Qiniu;
