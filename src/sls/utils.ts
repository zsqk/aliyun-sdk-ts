import _Sls20201230 from '@alicloud/sls20201230';
import * as $OpenApi from '@alicloud/openapi-client';
import { AliyunSlsEndpoint } from './endpoint.ts';

/**
 * [类型] SLS 请求客户端
 */
export type SLSClientType = _Sls20201230.default;

/**
 * SLS 请求客户端
 */
export const Sls20201230 = _Sls20201230.default;

/**
 * 创建 SLS 客户端
 */
export function createClient(
  { accessKeyId, accessKeySecret, endpoint }: {
    accessKeyId: string;
    accessKeySecret: string;
    endpoint: AliyunSlsEndpoint;
  },
): SLSClientType {
  const config = new $OpenApi.Config({
    accessKeyId,
    accessKeySecret,
    endpoint,
  });
  // config.endpoint = `cn-beijing.log.aliyuncs.com`;
  return new Sls20201230(config);
}
