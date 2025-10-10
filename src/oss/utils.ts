import _Oss20190517 from '@alicloud/oss20190517';
import { AliyunOssEndpoint } from './endpoint.ts';
import * as $OpenApi from '@alicloud/openapi-client';

/**
 * [类型] OSS 客户端
 */
export type OSSClientType = InstanceType<typeof _Oss20190517>;
/**
 * OSS 客户端
 * 避免因 OSS 类型不良导致的类型错误
 */
const Oss20190517 = (_Oss20190517 as unknown as {
  default: new (config: $OpenApi.Config) => OSSClientType;
}).default;

/**
 * 创建 OSS 客户端
 */
export function createClient(
  { accessKeyId, accessKeySecret, endpoint }: {
    accessKeyId: string;
    accessKeySecret: string;
    endpoint: AliyunOssEndpoint; // prefer new PascalCase type
  },
): OSSClientType {
  const config = new $OpenApi.Config({
    accessKeyId,
    accessKeySecret,
    endpoint,
  });

  return new Oss20190517(config);
}

/**
 * 从响应头中提取通用字段
 * {@link https://help.aliyun.com/zh/oss/developer-reference/common-http-headers 官方文档}
 */
export type CommonResponseHeaders = {
  /**
   * ETag (entity tag) 在每个Object生成的时候被创建，用于标识一个Object的内容。
   * 对于Put Object请求创建的Object，ETag值是其内容的MD5值；
   * 对于其他方式创建的Object，ETag值是基于一定计算规则生成的唯一值，
   * 但不是其内容的MD5值。ETag值可以用于检查Object内容是否发生变化。
   * 默认值：无
   */
  etag: string | null;
  /**
   * RFC 2616中定义的HTTP请求内容长度。
   * 单位: 字节
   * 默认值：无
   */
  contentLength: string | null;
};
