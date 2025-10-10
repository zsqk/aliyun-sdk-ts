#!/usr/bin/env -S deno run -A
/**
 * CLI: before-upload
 *
 * 基于 beforeUpload 封装的命令行工具。
 *
 * 功能:
 *  - 遍历本地目录计算文件 CRC64
 *  - 分批获取 OSS 上同名文件元数据
 *  - 输出对比结果 (支持 JSON)
 *  - 可选写入结果文件 / 删除本地相同文件
 *
 * 环境变量 (可与参数混用, 参数优先):
 *  - OSS_ACCESS_KEY_ID
 *  - OSS_ACCESS_KEY_SECRET
 *
 * 使用示例:
 *  deno run -A cli/oss-before-upload.ts \
 *    --bucket my-bucket \
 *    --endpoint oss-cn-beijing.aliyuncs.com \
 *    --local dist \
 *    --oss-dir assets \
 *    --write-result .cache/plan.json \
 *    --remove-same \
 *    --verbose
 */

import { parseArgs } from '@std/cli/parse-args';
import { beforeUpload } from '../src/oss/upload.ts';

function printHelp() {
  console.log(
    `Usage: deno run -A cli/oss-before-upload.ts [options]\n\nOptions:\n  --bucket <name>                 OSS Bucket 名称 (必须)\n  --endpoint <host>               OSS endpoint (默认: oss-cn-beijing.aliyuncs.com)\n  --local <dir>                   本地目录 (必须)\n  --oss-dir <dir>                 OSS 目标前缀 (可选)\n  --ak <id>                       AccessKeyId (或使用环境变量 OSS_ACCESS_KEY_ID)\n  --sk <secret>                   AccessKeySecret (或使用环境变量 OSS_ACCESS_KEY_SECRET)\n  --max-batch <n>                 每批获取元信息最大数量 (默认 100)\n  --write-result <file>           将结果写入文件 (JSON)\n  --remove-same                   删除与 OSS 相同的本地文件\n  --json                          仅输出 JSON 结果 (机器可读)\n  --verbose                       输出详细日志\n  -h, --help                      显示帮助\n\n示例:\n  deno run -A cli/oss-before-upload.ts --bucket b --local ./dist --oss-dir assets --ak xxx --sk yyy --verbose\n`,
  );
}

if (import.meta.main) {
  const args = parseArgs(Deno.args, {
    string: [
      'bucket',
      'endpoint',
      'local',
      'oss-dir',
      'ak',
      'sk',
      'max-batch',
      'write-result',
    ],
    boolean: [
      'verbose',
      'help',
      'h',
      'json',
      'remove-same',
    ],
    alias: { h: 'help' },
    default: {
      endpoint: 'oss-cn-beijing.aliyuncs.com',
      'max-batch': '100',
    },
  });

  if (args.help) {
    printHelp();
    Deno.exit(0);
  }

  const bucket = args.bucket as string | undefined;
  const localDir = args.local as string | undefined;
  if (!bucket || !localDir) {
    console.error('[error] --bucket 与 --local 均为必填');
    printHelp();
    Deno.exit(1);
  }

  const accessKeyId = (args.ak as string | undefined) ||
    Deno.env.get('OSS_ACCESS_KEY_ID') || '';
  const accessKeySecret = (args.sk as string | undefined) ||
    Deno.env.get('OSS_ACCESS_KEY_SECRET') || '';
  if (!accessKeyId || !accessKeySecret) {
    console.error(
      '[error] AccessKeyId / AccessKeySecret 未提供 (--ak/--sk 或环境变量)',
    );
    Deno.exit(1);
  }

  const ossDir = args['oss-dir'] as string | undefined;
  const endpoint = args.endpoint as string as 'oss-cn-beijing.aliyuncs.com';
  const verbose = !!args.verbose;
  const jsonOnly = !!args.json;
  const removeSame = !!args['remove-same'];
  const maxBatchSize = parseInt(String(args['max-batch']), 10) || 100;
  const writeResultTo = args['write-result'] as string | undefined;

  try {
    const results = await beforeUpload({ bucket, ossDir, localDir }, {
      accessKeyId,
      accessKeySecret,
      endpoint,
      verbose,
      maxBatchSize,
      writeResultTo,
      removeSame,
    });

    if (jsonOnly) {
      console.log(JSON.stringify(results, null, 2));
    } else {
      const same = results.filter((r) => r.same).length;
      const diff = results.filter((r) => r.ossHash && !r.same).length;
      const missing = results.filter((r) => !r.ossHash).length;
      console.log(
        `Summary: same=${same} diff=${diff} missing=${missing} total=${results.length}`,
      );
      for (const r of results) {
        const status = r.same ? 'SAME' : (r.ossHash ? 'DIFF' : 'NEW');
        console.log(`${status}\t${r.path}`);
      }
    }
  } catch (e) {
    console.error('[error] beforeUpload failed:', e);
    Deno.exit(1);
  }
}
