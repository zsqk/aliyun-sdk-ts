import type { UNIX_TIMESTAMP } from '../types/common.ts';
import type { AliyunSlsEndpoint } from './endpoint.ts';
import { getLogs } from './get-logs.ts';
import { z } from 'zod';

const FCRequestMetricsSchema = z.object({
  functionName: z.string(),
  /**
   * 函数执行时间
   */
  durationMs: z.string().transform((val) => Number(val)),
  instanceID: z.string(),
  qualifier: z.string(),
  versionId: z.string(),
  requestId: z.string(),
  resourceMode: z.string(),
  hostname: z.string(),
  /**
   * 总内存
   */
  memoryMB: z.string().transform((val) => Number(val)),
  /**
   * 占用内存
   */
  memoryUsageMB: z.string().transform((val) => Number(val)),
  invocationStartTimestamp: z.string().transform((val) => Number(val)),
  invocationType: z.string(),
  activeInstances: z.string(),
  activeInstancesPerFunction: z.string(),
  /**
   * 调度时间
   */
  scheduleLatencyMs: z.string().transform((val) => Number(val)),
  /**
   * 公网 IP (可能为 CDN 的 IP)
   */
  ipAddress: z.string(),
  /**
   * 函数执行开始时间 ms
   */
  invokeFunctionStartTimestamp: z.string().transform((val) => Number(val)),
  isColdStart: z.string().transform((val) => val === 'true'),
  hasFunctionError: z.string().transform((val) => val === 'true'),
  requestURI: z.string(),
  statusCode: z.string(),
  triggerType: z.string(),
  clientIP: z.string(),
  operation: z.string(),
  invokeFunctionLatencyMs: z.string().transform((val) => Number(val)),
  method: z.string(),
  __topic__: z.string(),
  __source__: z.string(),
  __time__: z.string(),
});

type FCRequestMetrics = z.infer<typeof FCRequestMetricsSchema>;

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
    endpoint: AliyunSlsEndpoint;
    project: string;
    logstore: string;
  },
): Promise<FCRequestMetrics[]> {
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

  if (!res.body) {
    throw new Error(Deno.inspect(res));
  }

  return res.body.map((log) => FCRequestMetricsSchema.parse(log));
}
