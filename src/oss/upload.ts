import { ALIYUN_OSS_ENDPOINT } from './endpoint.ts';

export async function beforeUpload({ bucket, ossDir = '', localDir }: {
  bucket: string;
  /**
   * OSS 上的文件夹路径, 如不填则为根目录
   */
  ossDir?: string;
  /**
   * 本地文件夹路径
   */
  localDir: string;
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
}): Promise<{ path: string; hash: string; ossHash?: string }[]> {
  // 1. 遍历本地文件夹, 获取所有文件路径
  // 2. 计算每个文件的 hash 值
  // 3. batchGetObjectMeta 检查 OSS 上同名文件的 hash 值
  // 4. 返回每个路径的对比结果

  // Implementation here
  return [];
}
