import { ALIYUN_OSS_ENDPOINT } from './endpoint.ts';
import { batchGetObjectMeta } from './get-meta.ts';

// Lazy import inside function to avoid cost when not used
type BeforeUploadResult = {
  /**
   * OSS 对象相对路径
   */
  path: string;
  /**
   * 本地文件的 CRC64 校验码 (使用 @zsqk/crc64 计算)
   */
  hash: string;
  /**
   * OSS 上的 CRC64 校验码 (x-oss-hash-crc64ecma)
   * 如果对象不存在则无此字段
   */
  ossHash?: string;
};

/**
 * 在真正上传前对比本地文件与 OSS 上同路径文件的 CRC64 校验码, 以便跳过已存在且内容一致的文件。
 *
 * 步骤:
 * 1. 遍历 localDir 递归收集文件 (忽略目录 / 符号链接)
 * 2. 计算每个文件的 CRC64 (使用 jsr:@zsqk/crc64)
 * 3. 构造对应的 OSS 对象路径 (ossDir + 相对路径)
 * 4. batchGetObjectMeta 获取 OSS 上对象的元信息 (含 x-oss-hash-crc64ecma)
 * 5. 返回数组, 每项包含 path (OSS 对象路径), hash (本地 CRC64), 以及可选的 ossHash
 *
 * 典型用例: 根据结果决定哪些文件需要上传, 哪些可以跳过。
 */
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
}): Promise<BeforeUploadResult[]> {
  /**
   * 1. 遍历本地文件夹, 获取所有文件相对路径 (使用 posix 分隔符)
   * 2. 使用 @zsqk/crc64 计算每个文件的 hash (crc64ecma) 值
   * 3. 调用 batchGetObjectMeta 检查 OSS 上同名文件的 hash 值 (x-oss-hash-crc64ecma)
   * 4. 返回每个路径的对比结果 (本地 hash 与 OSS hash)
   */

  // Deno 无法直接使用 file:// 前缀的字符串路径, 需要转换为 URL 对象
  let localDirPath: string | URL = localDir;
  if (localDir.startsWith('file://')) {
    localDirPath = new URL(localDirPath);
  }

  // 提前校验目录是否存在
  try {
    const stat = await Deno.stat(localDirPath);
    if (!stat.isDirectory) {
      throw new Error(`localDir is not a directory: ${localDir}`);
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(`Failed to access localDir '${localDir}': ${msg}`);
  }

  // 规范化 ossDir: 去除首尾 '/', 保留中间, 若为空则为 ''
  const normOssDir = ossDir ? ossDir.replace(/^\/+|\/+$/g, '') + '/' : '';

  const root = await Deno.realPath(localDirPath);
  const fileInfos: { abs: string; rel: string; ossPath: string }[] = [];

  // 递归遍历
  async function walk(dir: string) {
    for await (const entry of Deno.readDir(dir)) {
      const abs = `${dir}/${entry.name}`;
      if (entry.isDirectory) {
        await walk(abs);
      } else if (entry.isSymlink) {
        // 忽略符号链接, 避免循环/不可预期指向
        if (verbose) console.log(`[beforeUpload] Skip symlink: ${abs}`);
      } else if (entry.isFile) {
        // 计算相对路径, 使用 posix 分隔符
        let rel = abs.slice(root.length + 1);
        // 兼容 Windows 路径分隔符 (虽然当前运行于 macOS / Linux 通常无此问题)
        rel = rel.replace(/\\/g, '/');
        const ossPath = normOssDir + rel;
        fileInfos.push({ abs, rel, ossPath });
      }
    }
  }

  await walk(root);

  if (verbose) {
    console.log(
      `[beforeUpload] Collected ${fileInfos.length} files under ${localDir}`,
    );
  }

  if (fileInfos.length === 0) return [];

  // 动态导入 crc64 (延迟开销, 并允许 tree-shaking 未使用场景)
  const { crc64 } = await import('@zsqk/crc64');

  // 排序以确保稳定输出 (便于测试与缓存命中)
  fileInfos.sort((a, b) => a.ossPath.localeCompare(b.ossPath));

  // 计算本地 hash: 控制并发以避免占用过多内存 (简易实现)
  const concurrency = 8;
  const localHashes: { path: string; hash: string }[] = [];
  let index = 0;
  async function worker() {
    while (index < fileInfos.length) {
      const current = fileInfos[index++];
      const data = await Deno.readFile(current.abs);
      const hash = crc64(data);
      localHashes.push({ path: current.ossPath, hash });
    }
  }
  const workers = Array.from({
    length: Math.min(concurrency, fileInfos.length),
  }, () => worker());
  await Promise.all(workers);
  // 保证与 fileInfos 顺序一致
  localHashes.sort((a, b) => a.path.localeCompare(b.path));

  if (verbose) {
    console.log('[beforeUpload] Local CRC64 computed for all files');
  }

  // 批量获取 OSS 上的 crc64 (忽略不存在文件导致的 reject)
  const metas = await batchGetObjectMeta(
    fileInfos.map((f) => ({ bucket, path: f.ossPath })),
    { accessKeyId, accessKeySecret, endpoint, verbose },
  );

  const results: BeforeUploadResult[] = localHashes.map((lh, idx) => {
    const meta = metas[idx];
    if (meta.status === 'fulfilled') {
      return {
        path: lh.path,
        hash: lh.hash,
        ossHash: meta.value.crc64ecma ?? undefined,
      };
    }
    return { path: lh.path, hash: lh.hash }; // 文件可能不存在
  });

  if (verbose) {
    const diffCount = results.filter((r) =>
      r.ossHash && r.ossHash !== r.hash
    ).length;
    const sameCount = results.filter((r) =>
      r.ossHash && r.ossHash === r.hash
    ).length;
    const missingCount = results.filter((r) => !r.ossHash).length;
    console.log('[beforeUpload] Summary:', {
      sameCount,
      diffCount,
      missingCount,
    });
  }

  return results;
}
