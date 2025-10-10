/**
 * Aliyun OSS supported endpoint regions (public cloud only).
 * {@link https://help.aliyun.com/zh/oss/regions-and-endpoints doc}
 *
 * Coverage:
 *  - Explicit list of currently documented public regions (external network access).
 *  - Some regions are marked deprecated in the official docs (retained for backward compatibility).
 *
 * Notes:
 *  - This list is intentionally strict (no generic `string` fallback) to surface typos at compile time.
 *  - Aliyun may introduce new regions; update this list as needed.
 */
/** Public (external) OSS regions. */
export type AliyunOssPublicRegion =
  | 'cn-hangzhou'
  | 'cn-shanghai'
  | 'cn-nanjing' // Deprecated (kept for compatibility)
  | 'cn-fuzhou' // Deprecated (kept for compatibility)
  | 'cn-wuhan-lr'
  | 'cn-qingdao'
  | 'cn-beijing'
  | 'cn-zhangjiakou'
  | 'cn-huhehaote'
  | 'cn-wulanchabu'
  | 'cn-shenzhen'
  | 'cn-heyuan'
  | 'cn-guangzhou'
  | 'cn-chengdu'
  | 'cn-hongkong'
  | 'rg-china-mainland'
  | 'ap-northeast-1' // Tokyo
  | 'ap-northeast-2' // Seoul
  | 'ap-southeast-1' // Singapore
  | 'ap-southeast-3' // Kuala Lumpur
  | 'ap-southeast-5' // Jakarta
  | 'ap-southeast-6' // Manila
  | 'ap-southeast-7' // Bangkok
  | 'eu-central-1' // Frankfurt
  | 'eu-west-1' // London
  | 'us-west-1' // Silicon Valley
  | 'us-east-1' // Virginia
  | 'na-south-1' // Mexico
  | 'me-east-1'; // Dubai

/**
 * Internal-only (intranet) regions (no public internet endpoint is provided).
 * Used mainly for government / dedicated environments.
 */
export type AliyunOssInternalOnlyRegion = 'cn-north-2-gov-1';

/**
 * Public (internet) OSS endpoints.
 * Pattern (most cases): `oss-${region}.aliyuncs.com`.
 * Includes additional finance cloud public endpoints explicitly documented.
 */
export type AliyunOssPublicEndpoint =
  | `oss-${AliyunOssPublicRegion}.aliyuncs.com`
  | // Finance cloud public endpoints (explicit in docs)
  'oss-cn-hzfinance.aliyuncs.com'
  | 'oss-cn-shanghai-finance-1-pub.aliyuncs.com'
  | 'oss-cn-szfinance.aliyuncs.com'
  | 'oss-cn-shenzhen-finance-1-pub.aliyuncs.com'
  | 'oss-cn-beijing-finance-1-pub.aliyuncs.com';

/**
 * Internal (intranet) OSS endpoints.
 * Pattern (standard cases): `oss-${region}-internal.aliyuncs.com`.
 * Includes documented finance cloud and government cloud intranet variants.
 */
export type AliyunOssInternalEndpoint =
  | 'oss-cn-hangzhou-internal.aliyuncs.com'
  | 'oss-cn-shanghai-internal.aliyuncs.com'
  | 'oss-cn-nanjing-internal.aliyuncs.com'
  | 'oss-cn-fuzhou-internal.aliyuncs.com'
  | 'oss-cn-wuhan-lr-internal.aliyuncs.com'
  | 'oss-cn-qingdao-internal.aliyuncs.com'
  | 'oss-cn-beijing-internal.aliyuncs.com'
  | 'oss-cn-zhangjiakou-internal.aliyuncs.com'
  | 'oss-cn-huhehaote-internal.aliyuncs.com'
  | 'oss-cn-wulanchabu-internal.aliyuncs.com'
  | 'oss-cn-shenzhen-internal.aliyuncs.com'
  | 'oss-cn-heyuan-internal.aliyuncs.com'
  | 'oss-cn-guangzhou-internal.aliyuncs.com'
  | 'oss-cn-chengdu-internal.aliyuncs.com'
  | 'oss-cn-hongkong-internal.aliyuncs.com'
  | 'oss-ap-northeast-1-internal.aliyuncs.com'
  | 'oss-ap-northeast-2-internal.aliyuncs.com'
  | 'oss-ap-southeast-1-internal.aliyuncs.com'
  | 'oss-ap-southeast-3-internal.aliyuncs.com'
  | 'oss-ap-southeast-5-internal.aliyuncs.com'
  | 'oss-ap-southeast-6-internal.aliyuncs.com'
  | 'oss-ap-southeast-7-internal.aliyuncs.com'
  | 'oss-eu-central-1-internal.aliyuncs.com'
  | 'oss-eu-west-1-internal.aliyuncs.com'
  | 'oss-us-west-1-internal.aliyuncs.com'
  | 'oss-us-east-1-internal.aliyuncs.com'
  | 'oss-na-south-1-internal.aliyuncs.com'
  | 'oss-me-east-1-internal.aliyuncs.com'
  // Finance cloud intranet examples (explicitly documented)
  | 'oss-cn-hzjbp-a-internal.aliyuncs.com'
  | 'oss-cn-hzjbp-b-internal.aliyuncs.com'
  | 'oss-cn-shanghai-finance-1-internal.aliyuncs.com'
  | 'oss-cn-shenzhen-finance-1-internal.aliyuncs.com'
  | 'oss-cn-shenzhen-finance-1-pub-internal.aliyuncs.com'
  | 'oss-cn-shanghai-finance-1-pub-internal.aliyuncs.com'
  | 'oss-cn-hzfinance-internal.aliyuncs.com'
  | 'oss-cn-szfinance-internal.aliyuncs.com'
  // Government cloud intranet region
  | 'oss-cn-north-2-gov-1-internal.aliyuncs.com';

/** Union of all supported (public + internal) documented OSS endpoints. */
export type AliyunOssEndpoint =
  | AliyunOssPublicEndpoint
  | AliyunOssInternalEndpoint;
