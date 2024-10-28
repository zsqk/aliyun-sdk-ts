import { getLogs } from './get-logs.ts';
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
