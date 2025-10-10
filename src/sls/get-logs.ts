import type { UNIX_TIMESTAMP } from '../types/common.ts';
import type { AliyunSlsEndpoint } from './endpoint.ts';
import { GetLogsRequest, GetLogsResponse } from '@alicloud/sls20201230';
import * as $Util from '@alicloud/tea-util';
import { createClient } from './utils.ts';
import { isVerbose } from '../config.ts';

/**
 * [类型] getLogs 的基础参数
 */
export type BaseParams = {
  /**
   * 请求返回的最大日志条数
   * 仅当 query 参数为查询语句时, 该参数有效
   * 默认值为 100
   */
  line?: number;
  /**
   * 查询开始行数
   * 仅当 query 参数为查询语句时, 该参数有效
   * 默认值为 0
   */
  offset?: number;
  /**
   * 是否按时间倒序返回日志
   *
   * - false (默认值): 按照日志时间戳升序返回日志.
   * - true: 按照日志时间戳降序返回日志.
   */
  reverse?: boolean;
};

/**
 * API doc: https://help.aliyun.com/zh/sls/developer-reference/api-sls-2020-12-30-getlogs
 * SDK doc: https://next.api.aliyun.com/document/Sls/2020-12-30/GetLogs
 */
export async function getLogs(
  { logstore, project, from, to, query, topic, line, offset, reverse }: {
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
    /**
     * 日志主题
     * 默认值为空字符串
     */
    topic?: string;
  } & BaseParams,
  {
    accessKeyId,
    accessKeySecret,
    endpoint,
  }: {
    accessKeyId: string;
    accessKeySecret: string;
    endpoint: AliyunSlsEndpoint;
  },
): Promise<GetLogsResponse> {
  const client = createClient({ accessKeyId, accessKeySecret, endpoint });

  const params: Record<string, unknown> = {
    from,
    to,
  };
  if (query) params.query = query;
  if (topic) params.topic = topic;
  if (line) params.line = line;
  if (offset) params.offset = offset;
  if (reverse) params.reverse = reverse;

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

  if (isVerbose()) console.log('getLogs res', res);

  return res;
}
