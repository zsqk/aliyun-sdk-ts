import type { UNIX_TIMESTAMP } from '../types/common.ts';
import type { ALIYUN_SLS_ENDPOINT } from './endpoint.ts';
import { queryLog } from './mod.ts';

Deno.test('queryLog', async () => {
  const res = await queryLog(
    {
      projectName: 'test',
      logstoreName: 'test',
      from: 1727664000,
      to: 1727667600,
    },
    {
      accessKeyId: '',
      secretAccessKey: '',
      endpoint: '',
      apiVersion: '2015-06-01',
    },
  );
  console.log(res);
});

async function slsFetch({
  protocol = 'https',
  endpoint,
  method,
  path,
  query,
  headers: headersAction,
}: {
  /**
   * 协议类型
   * @default 'https'
   */
  protocol?: 'http' | 'https';
  endpoint: ALIYUN_SLS_ENDPOINT;
  method?: 'POST' | 'GET';
  path: string;
  query?: Record<string, string>;
  /**
   * 自定义的 headers
   */
  headers?: Record<string, string>;
}) {
  const url = new URL(`${protocol}://${endpoint}${path}`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      url.searchParams.set(key, value);
    }
  }
  const headersInit = new Headers();
  if (headersAction) {
    for (const [key, value] of Object.entries(headersAction)) {
      headersInit.set(key, value);
    }
  }
  const res = await fetch(url, { method, headers: headersInit });
  return res.json();
}

/**
 * doc: https://help.aliyun.com/zh/sls/developer-reference/api-sls-2020-12-30-getlogs
 */
async function getLogs(
  { logstore, project }: {
    logstore: string;
    /**
     * Project 名称
     */
    project: string;
    from: UNIX_TIMESTAMP;
    to: UNIX_TIMESTAMP;
  },
  {
    accessKeyId,
    secretAccessKey,
    endpoint,
  }: {
    accessKeyId: string;
    secretAccessKey: string;
    endpoint: ALIYUN_SLS_ENDPOINT;
  },
) {
  const res = await slsFetch({
    endpoint,
    method: 'GET',
    path: `/logstores/${logstore}`,
    query: {
      type: 'log',
      project,
    },
    headers: {
      'x-acs-action': 'log:GetLogStoreLogs',
    },
  });
  console.log(res);
  return res;
}

const project = '';
const logstore = '';

Deno.test('getLogs', async () => {
  const res = await getLogs({
    project,
    logstore,
    from: 1727635200,
    to: 1727674800,
  }, {
    accessKeyId: '',
    secretAccessKey: '',
    endpoint: 'cn-beijing.log.aliyuncs.com',
  });

  console.log(res);
});
