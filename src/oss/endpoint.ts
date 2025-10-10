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
  | 'cn-nanjing' // 南京, 关停中
  | 'cn-fuzhou' // 福州, 关停中
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
  | 'ap-northeast-1' // 东京
  | 'ap-northeast-2' // 首尔
  | 'ap-southeast-1' // 新加坡
  | 'ap-southeast-3' // 吉隆坡
  | 'ap-southeast-5' // 雅加达
  | 'ap-southeast-6' // 马尼拉
  | 'ap-southeast-7' // 曼谷
  | 'eu-central-1' // 法兰克福
  | 'eu-west-1' // 伦敦
  | 'us-west-1' // 硅谷
  | 'us-east-1' // 弗吉尼亚
  | 'na-south-1' // 墨西哥
  | 'me-east-1'; // 迪拜

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

// 支持文档中类似 `oss-cn-hzjbp-a-internal.aliyuncs.com` 的内网形式，
// 其中 region 可能包含额外的后缀（例如 cn-hzjbp-a）。
// 使用更宽松的模板以覆盖这些官方内网 endpoint。
/** 一些官方内网 region 使用带额外后缀的 region 名（例如 cn-hzjbp-a），
 *  列举这些额外的内网 region 以保持类型严格。若后续需要支持更多
 *  类似 region，可在此处扩展。 */
export type ALIYUN_OSS_INTERNAL_EXTRA_REGION = 'cn-hzjbp-a';

/** 所有支持的公共云 OSS endpoint（严格列出文档中的外网与内网 endpoint） */
export type ALIYUN_OSS_ENDPOINT =
  | ALIYUN_OSS_PUBLIC_ENDPOINT
  | ALIYUN_OSS_INTERNAL_ENDPOINT;
