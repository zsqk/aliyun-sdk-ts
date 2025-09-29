import Oss20190517 from '@alicloud/oss20190517';
import { ALIYUN_OSS_ENDPOINT } from './endpoint.ts';
import * as $OpenApi from '@alicloud/openapi-client';

/**
 * 创建 OSS 客户端
 */
export function createClient(
  { accessKeyId, accessKeySecret, endpoint }: {
    accessKeyId: string;
    accessKeySecret: string;
    endpoint: ALIYUN_OSS_ENDPOINT;
  },
): Oss20190517.default {
  const config = new $OpenApi.Config({
    accessKeyId,
    accessKeySecret,
    endpoint,
  });
  // config.endpoint = `cn-beijing.log.aliyuncs.com`;
  return new Oss20190517.default(config);
}
