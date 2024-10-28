import type { UNIX_TIMESTAMP } from '../types/common.ts';
import type { ALIYUN_SLS_ENDPOINT } from './endpoint.ts';
import Sls20201230 from '@alicloud/sls20201230';
import * as $OpenApi from '@alicloud/openapi-client';
import * as $Util from '@alicloud/tea-util';

/**
 * 创建 SLS 客户端
 */
function createClient(
  { accessKeyId, accessKeySecret, endpoint }: {
    accessKeyId: string;
    accessKeySecret: string;
    endpoint: ALIYUN_SLS_ENDPOINT;
  },
): Sls20201230.default {
  const config = new $OpenApi.Config({
    accessKeyId,
    accessKeySecret,
    endpoint,
  });
  // config.endpoint = `cn-beijing.log.aliyuncs.com`;
  return new Sls20201230.default(config);
}

/**
 * API doc: https://help.aliyun.com/zh/sls/developer-reference/api-sls-2020-12-30-getlogs
 * SDK doc: https://next.api.aliyun.com/document/Sls/2020-12-30/GetLogs
 */
export async function getLogs(
  { logstore, project, from, to, query }: {
    /**
     * Project 名称
     */
    project: string;
    /**
     * Logstore 名称
     */
    logstore: string;
    /**
     * 开始时间 (包含)
     */
    from: UNIX_TIMESTAMP;
    /**
     * 结束时间 (不包含)
     */
    to: UNIX_TIMESTAMP;
    /**
     * 查询语句
     */
    query?: string;
  },
  {
    accessKeyId,
    accessKeySecret,
    endpoint,
  }: {
    accessKeyId: string;
    accessKeySecret: string;
    endpoint: ALIYUN_SLS_ENDPOINT;
  },
) {
  const client = createClient({ accessKeyId, accessKeySecret, endpoint });

  const params: Record<string, unknown> = {
    from,
    to,
  };
  if (query) params.query = query;

  const getLogsRequest = new Sls20201230.GetLogsRequest(params);
  const runtime = new $Util.RuntimeOptions({});
  const headers: { [key: string]: string } = {};

  const res = await client.getLogsWithOptions(
    project,
    logstore,
    getLogsRequest,
    headers,
    runtime,
  );

  return res;
}

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
