import type { UNIX_TIMESTAMP } from '../types/common.ts';
import type { ALIYUN_SLS_ENDPOINT } from './endpoint.ts';
import { GetLogsRequest } from '@alicloud/sls20201230';
import * as $Util from '@alicloud/tea-util';
import { createClient } from './utils.ts';

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

  const getLogsRequest = new GetLogsRequest(params);
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
