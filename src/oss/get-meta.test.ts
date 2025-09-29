import { delay } from '@std/async/delay';
import { getObjectMeta, headObject } from './get-meta.ts';

let bucket = '';
let accessKeyId = '';
let accessKeySecret = '';

Deno.test.beforeAll(() => {
  bucket = Deno.env.get('TEST_OSS_BUCKET') ?? '';
  accessKeyId = Deno.env.get('TEST_OSS_ACCESS_KEY_ID') ?? '';
  accessKeySecret = Deno.env.get('TEST_OSS_ACCESS_KEY_SECRET') ?? '';

  if (!accessKeyId) {
    throw new Error('TEST_OSS_ACCESS_KEY_ID is required');
  }
  if (!accessKeySecret) {
    throw new Error('TEST_OSS_ACCESS_KEY_SECRET is required');
  }
  if (!bucket) {
    throw new Error('TEST_OSS_BUCKET is required');
  }

  console.log({ bucket, accessKeyId, accessKeySecret });
});

Deno.test('getObjectMeta', async () => {
  const res = await getObjectMeta({
    bucket,
    path: 'assets/Info-DRcPtTHZ.css',
  }, {
    accessKeyId,
    accessKeySecret,
    endpoint: 'oss-cn-beijing.aliyuncs.com',
    verbose: true,
  });

  console.log('res', res);
  await delay(5000); // Wait for any pending operations to complete
});

Deno.test('headObject', async () => {
  const res = await headObject({
    bucket,
    path: 'assets/Info-DRcPtTHZ.css',
  }, {
    accessKeyId,
    accessKeySecret,
    endpoint: 'oss-cn-beijing.aliyuncs.com',
    verbose: true,
  });

  console.log('res', res);
  await delay(5000); // Wait for any pending operations to complete
});
