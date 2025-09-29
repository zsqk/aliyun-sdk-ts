import { GetObjectMetaRequest, HeadObjectRequest } from '@alicloud/oss20190517';
import { ALIYUN_OSS_ENDPOINT } from './endpoint.ts';
import * as $Util from '@alicloud/tea-util';
import { CommonResponseHeaders, createClient } from './util.ts';

type GetObjectMetaResponse = {
  /**
   * Object通过生命周期规则转储为冷归档或者深度冷归档存储类型的时间。
   */
  transitionTime: string | null;
  /**
   * Object的最后一次访问时间。时间格式为HTTP 1.1协议中规定的GMT时间。
   * 开启访问跟踪后，该字段的值会随着文件被访问的时间持续更新。
   * 如果关闭了访问跟踪，则不再返回该字段。
   */
  lastAccessTime: string | null;
  /**
   * Object最后一次修改时间。时间格式为HTTP 1.1协议中规定的GMT时间。
   */
  lastModified: string | null;
  /**
   * Object的版本ID。只有查看Object指定版本的元数据信息时才显示该字段。
   */
  versionId: string | null;
  /**
   * (文档未明确列出) Object的CRC64-ECMA校验码。
   */
  crc64ecma: string | null;
} & CommonResponseHeaders;

/**
 * [API] GetObjectMeta 获取对象的元信息
 * {@link https://help.aliyun.com/zh/oss/developer-reference/getobjectmeta 官方文档}
 *
 * @param param0 - 包含 bucket 和 path 的对象
 * @param param1 - 包含 accessKeyId、accessKeySecret 和 endpoint 的对象
 * @param param1.verbose - 可选，啰嗦模式，开启后会打印返回的响应用于调试
 * @returns
 */
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
  verbose = false,
}: {
  accessKeyId: string;
  accessKeySecret: string;
  endpoint: ALIYUN_OSS_ENDPOINT;
  verbose?: boolean;
}): Promise<GetObjectMetaResponse> {
  // Implementation here
  const client = createClient({ accessKeyId, accessKeySecret, endpoint });
  const request = new GetObjectMetaRequest({});
  const headers: { [key: string]: string } = {};
  const runtime = new $Util.RuntimeOptions({});

  const res = await client.getObjectMetaWithOptions(
    bucket,
    path,
    request,
    headers,
    runtime,
  );

  if (res.statusCode !== 200) {
    throw new Error(`Failed to get object meta: ${res.statusCode}`);
  }

  if (verbose) {
    // Only print the full response when verbose/debugging is requested
    // Keep this conditional to avoid noisy output in normal usage
    console.log('res', res);
  }

  // Extract relevant metadata from headers

  const h = new Headers(res.headers);

  // 文档中写明的字段
  const contentLength = h.get('Content-Length');
  const etag = h.get('ETag');
  const transitionTime = h.get('x-oss-transition-time');
  const lastAccessTime = h.get('x-oss-last-access-time');
  const lastModified = h.get('Last-Modified');
  const versionId = h.get('x-oss-version-id');

  // 实测存在但文档中不明确的字段
  const crc64ecma = h.get('x-oss-hash-crc64ecma');

  return {
    contentLength,
    etag,
    transitionTime,
    lastAccessTime,
    lastModified,
    versionId,
    crc64ecma,
  };
}

type HeadObjectResponse = {
  /**
   * Object通过生命周期规则转储为冷归档或者深度冷归档存储类型的时间。
   */
  transitionTime: string | null;
  /**
   * Object的最后一次访问时间。时间格式为HTTP 1.1协议中规定的GMT时间。
   * 开启访问跟踪后，该字段的值会随着文件被访问的时间持续更新。
   * 如果关闭了访问跟踪，则不再返回该字段。
   */
  lastAccessTime: string | null;
  /**
   * Object最后一次修改时间。时间格式为HTTP 1.1协议中规定的GMT时间。
   */
  lastModified: string | null;
  /**
   * Object的版本ID。只有查看Object指定版本的元数据信息时才显示该字段。
   */
  versionId: string | null;
  /**
   * 表示该Object的64位CRC值。该64位CRC根据CRC64/XZ计算得出。
   * 对OSS支持CRC64校验前创建的Object，调用HeadObject接口时可能不会返回此响应头。
   */
  crc64ecma: string | null;
  /**
   * (文档未明确列出) Object 的 MIME 类型
   */
  contentType: string | null;
} & CommonResponseHeaders;

/**
 * [API] HeadObject 获取文件的元信息
 * {@link https://help.aliyun.com/zh/oss/developer-reference/headobject 官方文档}
 *
 * @param param0
 */
export async function headObject({ bucket, path }: {
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
  verbose = false,
}: {
  accessKeyId: string;
  accessKeySecret: string;
  endpoint: ALIYUN_OSS_ENDPOINT;
  verbose?: boolean;
}): Promise<HeadObjectResponse> {
  const client = createClient({ accessKeyId, accessKeySecret, endpoint });
  const request = new HeadObjectRequest({});
  const headers: { [key: string]: string } = {};
  const runtime = new $Util.RuntimeOptions({});

  const res = await client.headObjectWithOptions(
    bucket,
    path,
    request,
    headers,
    runtime,
  );

  if (res.statusCode !== 200) {
    throw new Error(`Failed to head object: ${res.statusCode}`);
  }

  if (verbose) {
    // Only print the full response when verbose/debugging is requested
    // Keep this conditional to avoid noisy output in normal usage
    console.log('res', res);
  }

  // Extract relevant metadata from headers

  const h = new Headers(res.headers);

  // 文档中写明的字段
  const etag = h.get('ETag');
  const transitionTime = h.get('x-oss-transition-time');
  const lastAccessTime = h.get('x-oss-last-access-time');
  const lastModified = h.get('Last-Modified');
  const versionId = h.get('x-oss-version-id');
  const crc64ecma = h.get('x-oss-hash-crc64ecma');

  // 实测存在但文档中不明确的字段
  const contentLength = h.get('Content-Length');
  const contentType = h.get('Content-Type');

  return {
    contentLength,
    etag,
    transitionTime,
    lastAccessTime,
    lastModified,
    versionId,
    crc64ecma,
    contentType,
  };
}
