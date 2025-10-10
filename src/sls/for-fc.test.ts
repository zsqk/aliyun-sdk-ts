import { setVerbose } from '../config.ts';
import { getFCRequestMetrics } from './for-fc.ts';
import { delay } from '@std/async/delay';

let project = '';
let logstore = '';
let accessKeyId = '';
let accessKeySecret = '';

Deno.test.beforeAll(() => {
  setVerbose(true);

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
      from: new Date('2025-10-10T00:00:00+08:00').getTime() / 1000,
      to: new Date('2025-10-11T01:00:00+08:00').getTime() / 1000,
      fcName: 's1-dapi',
      line: 3,
    }, {
      accessKeyId,
      accessKeySecret,
      endpoint: 'cn-beijing.log.aliyuncs.com',
      project,
      logstore,
    });

    console.log('res', res);
    await delay(3000); // Wait for any pending operations to complete
  },
});
