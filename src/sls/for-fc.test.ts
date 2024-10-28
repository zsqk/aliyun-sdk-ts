import { getFCRequestMetrics } from './for-fc.ts';

const project = Deno.env.get('TEST_SLS_PROJECT')!;
const logstore = Deno.env.get('TEST_SLS_LOGSTORE')!;
const accessKeyId = Deno.env.get('TEST_SLS_ACCESS_KEY_ID')!;
const accessKeySecret = Deno.env.get('TEST_SLS_ACCESS_KEY_SECRET')!;

Deno.test('getFCRequestMetrics', async () => {
  console.log('project', project);
  console.log('logstore', logstore);
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

  console.log(res);
});
