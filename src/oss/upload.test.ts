import { beforeUpload } from './upload.ts';

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

Deno.test('beforeUpload', async () => {
  const res = await beforeUpload({
    bucket,
    localDir: import.meta.resolve('../../test-data'),
    // localDir: '/Users/zheren/git/aliyun-sdk-ts/test-data',
  }, {
    accessKeyId,
    accessKeySecret,
    endpoint: 'oss-cn-beijing.aliyuncs.com',
    verbose: true,
  });

  console.log('res', res);
});
