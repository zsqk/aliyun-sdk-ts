import { getFCRequestMetrics } from './for-fc.ts';
import { delay } from '@std/async/delay';

let project = '';
let logstore = '';
let accessKeyId = '';
let accessKeySecret = '';

Deno.test.beforeAll(() => {
  project = Deno.env.get('TEST_SLS_PROJECT') ?? '';
  logstore = Deno.env.get('TEST_SLS_LOGSTORE') ?? '';
  accessKeyId = Deno.env.get('TEST_SLS_ACCESS_KEY_ID') ?? '';
  accessKeySecret = Deno.env.get('TEST_SLS_ACCESS_KEY_SECRET') ?? '';

  if (!project) {
    throw new Error('TEST_SLS_PROJECT is required');
  }
  if (!logstore) {
    throw new Error('TEST_SLS_LOGSTORE is required');
  }
  if (!accessKeyId) {
    throw new Error('TEST_SLS_ACCESS_KEY_ID is required');
  }
  if (!accessKeySecret) {
    throw new Error('TEST_SLS_ACCESS_KEY_SECRET is required');
  }

  console.log({ project, logstore, accessKeyId, accessKeySecret });
});

Deno.test({
  name: 'getFCRequestMetrics',
  fn: async () => {
    const res = await getFCRequestMetrics({
      from: 1730008970,
      to: 1730208970,
      requestId: '1-671f5a9d-133d0cca-3d06b48af8c5',
    }, {
      accessKeyId,
      accessKeySecret,
      endpoint: 'cn-beijing.log.aliyuncs.com',
      project,
      logstore,
    });

    console.log(' res', res);
    await delay(5000); // Wait for any pending operations to complete
  },
});
