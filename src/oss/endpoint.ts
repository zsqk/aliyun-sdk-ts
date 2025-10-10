// Documentation:
// https://help.aliyun.com/zh/oss/regions-and-endpoints

/**
 * Aliyun OSS supported endpoints (public cloud)
 * {@link https://help.aliyun.com/zh/oss/regions-and-endpoints doc}
 *
 * Includes common public (external) and internal (intranet) endpoint patterns.
 * Uses TypeScript template literal types to cover common region and domain combos:
 * - Public example: oss-cn-hangzhou.aliyuncs.com
 * - Internal example: oss-cn-hangzhou-internal.aliyuncs.com
 *
 * Note: This does not exhaust all possible endpoints (Aliyun may add regions),
 * but covers most common public-cloud regions and their internal/external domain patterns.
 */
export type ALIYUN_OSS_PUBLIC_REGION =
  | 'cn-hangzhou'
  | 'cn-shanghai'
  | 'cn-nanjing' // Nanjing (deprecated)
  | 'cn-fuzhou' // Fuzhou (deprecated)
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

/** 部分 gov / 专属 region 只提供内网访问（不提供公网 endpoint） */
export type ALIYUN_OSS_INTERNAL_ONLY_REGION = 'cn-north-2-gov-1';

/** 外网 endpoint，例如: oss-cn-hangzhou.aliyuncs.com */
/** 公网（外网）Endpoint：显式列出以保证严格性（含公共云和金融云对外公开的公网 endpoint） */
export type ALIYUN_OSS_PUBLIC_ENDPOINT =
  | `oss-${ALIYUN_OSS_PUBLIC_REGION}.aliyuncs.com`
  | // 金融云对外公开的公网 endpoint（文档列出，需要额外的 region id）
  'oss-cn-hzfinance.aliyuncs.com'
  | 'oss-cn-shanghai-finance-1-pub.aliyuncs.com'
  | 'oss-cn-szfinance.aliyuncs.com'
  | 'oss-cn-shenzhen-finance-1-pub.aliyuncs.com'
  | 'oss-cn-beijing-finance-1-pub.aliyuncs.com';

/** 内网 endpoint，例如: oss-cn-hangzhou-internal.aliyuncs.com */
/** 内网 endpoint：显式列出文档中的所有标准内网 endpoint 以及金融云/政务云的内网特例 */
export type ALIYUN_OSS_INTERNAL_ENDPOINT =
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
  // 金融云内网特例（文档示例）
  | 'oss-cn-hzjbp-a-internal.aliyuncs.com'
  | 'oss-cn-hzjbp-b-internal.aliyuncs.com'
  | 'oss-cn-shanghai-finance-1-internal.aliyuncs.com'
  | 'oss-cn-shenzhen-finance-1-internal.aliyuncs.com'
  | 'oss-cn-shenzhen-finance-1-pub-internal.aliyuncs.com'
  | 'oss-cn-shanghai-finance-1-pub-internal.aliyuncs.com'
  | 'oss-cn-hzfinance-internal.aliyuncs.com'
  | 'oss-cn-szfinance-internal.aliyuncs.com'
  // 政务云内网
  | 'oss-cn-north-2-gov-1-internal.aliyuncs.com';

/** 所有支持的公共云 OSS endpoint（严格列出文档中的外网与内网 endpoint） */
export type ALIYUN_OSS_ENDPOINT =
  | ALIYUN_OSS_PUBLIC_ENDPOINT
  | ALIYUN_OSS_INTERNAL_ENDPOINT;
