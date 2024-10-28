import type { UNIX_TIMESTAMP } from '../types/common.ts';
import type { ALIYUN_SLS_ENDPOINT } from './endpoint.ts';
import { getLogs } from './get-logs.ts';

/**
 * 获取 FC 请求指标
 */
export async function getFCRequestMetrics(
  { from, to, requestId }: {
    from: UNIX_TIMESTAMP;
    to: UNIX_TIMESTAMP;
    requestId?: string;
  },
  {
    accessKeyId,
    accessKeySecret,
    endpoint,
    project,
    logstore,
  }: {
    accessKeyId: string;
    accessKeySecret: string;
    endpoint: ALIYUN_SLS_ENDPOINT;
    project: string;
    logstore: string;
  },
) {
  const res = await getLogs({
    project,
    logstore,
    from,
    to,
    query: requestId ? `requestId: ${requestId}` : undefined,
  }, {
    accessKeyId,
    accessKeySecret,
    endpoint,
  });

  return res.body;
}

// invokeFunctionLatencyMs
// durationMs 函数执行时间
// scheduleLatencyMs 调度时间
// memoryMB 总内存
// memoryUsageMB 占用内存
// isColdStart 是否冷启动
// hasFunctionError 是否有函数错误
