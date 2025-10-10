import type { UNIX_TIMESTAMP } from '../types/common.ts';
import type { AliyunSlsEndpoint } from './endpoint.ts';
import { BaseParams, getLogs } from './get-logs.ts';
import { z } from 'zod';

/**
 * FCRequestMetrics 原始字段
 * 来自日志服务的原始字段，全部为字符串类型
 */
type FCRequestMetricsOriginal = {
  functionName: string;
  /**
   * 版本的别名, 比如 `LATEST`
   */
  qualifier: string;
  versionId: string;
  instanceID: string;
  activeInstancesPerFunction: string;
  method: string;
  requestURI: string;
  statusCode: string;
  hostname: string;
  isColdStart: string;
  resourceMode: string;
  durationMs: string;
  invocationType: string;
  scheduleLatencyMs: string;
  operation: string;
  memoryMB: string;
  memoryUsageMB: string;
  activeInstances: string;
  ipAddress: string;
  invokeFunctionStartTimestamp: string;
  hasFunctionError: string;
  triggerType: string;
  clientIP: string;
  requestId: string;
  invokeFunctionLatencyMs: string;
  invocationStartTimestamp: string;
  __pack_meta__?: string;
  __topic__?: string;
  __source__?: string;
  '__tag__:__pack_id__'?: string;
  '__tag__:__receive_time__'?: string;
  __time__?: string;
};

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
  activeInstances: number;
  activeInstancesPerFunction: number;
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
  /**
   * 是否为冷启动 (true | false)
   */
  isColdStart: boolean;
  hasFunctionError: boolean;
  requestURI: string;
  statusCode: string;
  triggerType: string;
  clientIP: string;
  operation: string;
  /**
   * 函数执行时间 ms
   */
  invokeFunctionLatencyMs: number;
  method: string;
  __topic__: string;
  __source__: string;
  __time__: string;
};

const FCRequestMetricsSchema: z.ZodSchema<
  FCRequestMetrics,
  z.ZodTypeDef,
  FCRequestMetricsOriginal
> = z.object({
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
  activeInstances: z.string().transform((val) => Number(val)),
  activeInstancesPerFunction: z.string().transform((val) => Number(val)),
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

/**
 * 获取 FC 请求指标
 */
export async function getFCRequestMetrics(
  { from, to, requestId, fcName, ...rest }: {
    from: UNIX_TIMESTAMP;
    to: UNIX_TIMESTAMP;
    requestId?: string;
    /**
     * Function Compute 函数名称
     */
    fcName?: string;
  } & BaseParams,
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
    ...rest,
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
