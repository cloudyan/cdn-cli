import { config, setConfig } from './config';
import { upload } from './utils';

// 取消监听器数量限制
process.setMaxListeners(0);

const deploy = async (environment: string): Promise<any> => {
  await setConfig(environment);

  console.log(
    `${'状态'.padStart(4)}${'缓存'.padStart(
      8,
    )}${'本地资源 -> 远端资源'.padStart(16)}`,
  );

  let files: File[] = config.rules.map((rule) => rule.files).flat();

  await upload(
    config.environment.type,
    files.filter((file) => !file.isLastUpload),
  );
  await upload(
    config.environment.type,
    files.filter((file) => file.isLastUpload),
  );
};

export { deploy };
