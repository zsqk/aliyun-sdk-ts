// GetObjectMeta
import Oss20190517, { GetObjectMetaRequest } from '@alicloud/oss20190517';
import { ALIYUN_OSS_ENDPOINT } from './endpoint.ts';
import * as $OpenApi from '@alicloud/openapi-client';
import * as $Util from '@alicloud/tea-util';

/**
 * 创建 OSS 客户端
 */
function createClient(
  { accessKeyId, accessKeySecret, endpoint }: {
    accessKeyId: string;
    accessKeySecret: string;
    endpoint: ALIYUN_OSS_ENDPOINT;
  },
): Oss20190517 {
  const config = new $OpenApi.Config({
    accessKeyId,
    accessKeySecret,
    endpoint,
  });
  // config.endpoint = `cn-beijing.log.aliyuncs.com`;
  return new Oss20190517(config);
}

export async function getObjectMeta({ bucket, path }: {
  /**
   * Bucket 名称
   */
  bucket: string;
  /**
   * Object Path
   */
  path: string;
}, {
  accessKeyId,
  accessKeySecret,
  endpoint,
}: {
  accessKeyId: string;
  accessKeySecret: string;
  endpoint: ALIYUN_OSS_ENDPOINT;
}) {
  // Implementation here
  const client = createClient({ accessKeyId, accessKeySecret, endpoint });
  const request = new GetObjectMetaRequest({});
  const headers: { [key: string]: string } = {};
  const runtime = new $Util.RuntimeOptions({});

  await client.getObjectMetaWithOptions(
    bucket,
    path,
    request,
    headers,
    runtime,
  );
}
