import { getLogs } from './get-logs.ts';

const project = Deno.env.get('TEST_SLS_PROJECT')!;
const logstore = Deno.env.get('TEST_SLS_LOGSTORE')!;

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
