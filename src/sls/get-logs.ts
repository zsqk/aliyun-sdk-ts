import type { UNIX_TIMESTAMP } from '../types/common.ts';
import type { ALIYUN_SLS_ENDPOINT } from './endpoint.ts';

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
  const headers = new Headers({
    'x-acs-date': new Date().toISOString(),
    host: endpoint,
    authorization:
      'ACS3-HMAC-SHA256 Credential=YourAccessKeyId,SignedHeaders=host;x-acs-action;x-acs-content-sha256;x-acs-date;x-acs-signature-nonce;x-acs-version,Signature=e521358f7776c97df52e6b2891a8bc73026794a071b50c3323388c4e0df64804',
    /**
     * 请求正文Hash摘要后再base-16编码的结果，与HashedRequestPayload一致。
     */
    'x-acs-content-sha256': '',
  });
  if (headersAction) {
    for (const [key, value] of Object.entries(headersAction)) {
      headers.set(key, value);
    }
  }

  console.log('url', Deno.inspect(url));
  const res = await fetch(url, { method, headers });
  return res.json();
}

/**
 * doc: https://help.aliyun.com/zh/sls/developer-reference/api-sls-2020-12-30-getlogs
 */
export async function getLogs(
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
      'x-acs-version': '2020-12-30',
    },
  });
  return res;
}
