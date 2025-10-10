// 文档:
// https://help.aliyun.com/zh/oss/regions-and-endpoints

/**
 * 阿里云对象存储支持的 endpoint（公共云）
 *
 * 参考: https://help.aliyun.com/zh/oss/regions-and-endpoints
 *
 * 包含常见的公网（外网）和内网（intranet）地址模式。
 * 使用 TypeScript 模板字面量类型以覆盖常见 region 与域名组合：
 * - 外网示例: oss-cn-hangzhou.aliyuncs.com
 * - 内网示例: oss-cn-hangzhou-internal.aliyuncs.com
 *
 * 说明：这并不穷尽所有可能的 endpoint（阿里云会不定期增加 region），
 * 但覆盖了公共云的大多数常见 region 和内外网域名模式。
 */
export type ALIYUN_OSS_PUBLIC_REGION =
  | 'cn-hangzhou'
  | 'cn-shanghai'
  | 'cn-beijing'
  | 'cn-shenzhen'
  | 'cn-qingdao'
  | 'cn-hongkong'
  | 'ap-southeast-1' // 新加坡
  | 'ap-southeast-2' // 马来西亚 / 印尼 等
  | 'ap-southeast-3' // 暂用占位
  | 'ap-northeast-1' // 东京
  | 'eu-central-1' // 德国（中欧）
  | 'us-west-1' // 美西
  | 'us-east-1' // 美东
  | 'me-east-1' // 中东
  | 'cn-zhangjiakou'
  | 'cn-huhehaote'
  | 'cn-shenzhen-finance-1';

/** 部分 gov / 专属 region 只提供内网访问（不提供公网 endpoint） */
export type ALIYUN_OSS_INTERNAL_ONLY_REGION = 'cn-north-2-gov-1';

/** 外网 endpoint，例如: oss-cn-hangzhou.aliyuncs.com */
export type ALIYUN_OSS_PUBLIC_ENDPOINT =
  `oss-${ALIYUN_OSS_PUBLIC_REGION}.aliyuncs.com`;

/** 内网 endpoint，例如: oss-cn-hangzhou-internal.aliyuncs.com */
export type ALIYUN_OSS_INTERNAL_ENDPOINT =
  | `oss-${ALIYUN_OSS_PUBLIC_REGION}-internal.aliyuncs.com`
  // 政府/专属 region 的内网 endpoint
  | `oss-${ALIYUN_OSS_INTERNAL_ONLY_REGION}-internal.aliyuncs.com`;

/** 所有支持的公共云 OSS endpoint */
export type ALIYUN_OSS_ENDPOINT =
  | ALIYUN_OSS_PUBLIC_ENDPOINT
  | ALIYUN_OSS_INTERNAL_ENDPOINT;
