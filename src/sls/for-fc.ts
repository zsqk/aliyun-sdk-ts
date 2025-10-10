import type { UNIX_TIMESTAMP } from '../types/common.ts';
import type { AliyunSlsEndpoint } from './endpoint.ts';
import { getLogs } from './get-logs.ts';
import { z } from 'zod';

export type FCRequestMetrics = {
  functionName: string;
  /**
   * 函数执行时间
   */
  durationMs: number;
  instanceID: string;
  qualifier: string;
  versionId: string;
  requestId: string;
  resourceMode: string;
  hostname: string;
  /**
   * 总内存
   */
  memoryMB: number;
  /**
   * 占用内存
   */
  memoryUsageMB: number;
  invocationStartTimestamp: number;
  invocationType: string;
  activeInstances: string;
  activeInstancesPerFunction: string;
  /**
   * 调度时间
   */
  scheduleLatencyMs: number;
  /**
   * 公网 IP (可能为 CDN 的 IP)
   */
  ipAddress: string;
  /**
   * 函数执行开始时间 ms
   */
  invokeFunctionStartTimestamp: number;
  isColdStart: boolean;
  hasFunctionError: boolean;
  requestURI: string;
  statusCode: string;
  triggerType: string;
  clientIP: string;
  operation: string;
  invokeFunctionLatencyMs: number;
  method: string;
  __topic__: string;
  __source__: string;
  __time__: string;
};

const FCRequestMetricsSchema: z.ZodSchema<FCRequestMetrics> = z.object({
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
   * `z.union([z.string(), z.number()]).transform((val) => Number(val))`
   */
  scheduleLatencyMs: z.coerce.number(),
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

/**
 * 获取 FC 请求指标
 */
export async function getFCRequestMetrics(
  { from, to, requestId, fcName }: {
    from: UNIX_TIMESTAMP;
    to: UNIX_TIMESTAMP;
    requestId?: string;
    /**
     * Function Compute 函数名称
     */
    fcName?: string;
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
  const querys: string[] = [];
  if (requestId) {
    querys.push(`requestId: ${requestId}`);
  }
  const query = querys.length ? querys.join(' AND ') : undefined;
  const res = await getLogs({
    project,
    logstore,
    from,
    to,
    query,
    topic: fcName ? `FCRequestMetrics:/${fcName}` : undefined,
  }, {
    accessKeyId,
    accessKeySecret,
    endpoint,
  });

  if (!res.body) {
    throw new Error(Deno.inspect(res));
  }

  return res.body.map((log: unknown) => FCRequestMetricsSchema.parse(log));
}
