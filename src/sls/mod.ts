import aliyunsdk from 'aliyun-sdk';

/**
 * 查询日志
 * @param p 查询参数
 * @param options 配置
 * @returns 日志数据
 */
export function queryLog(
  p: {
    /**
     * 项目名称
     */
    projectName: string;
    /**
     * 日志库名称
     */
    logstoreName: string;
    /**
     * 开始时间，精度为秒
     */
    from: number;
    /**
     * 结束时间，精度为秒
     */
    to: number;
    /**
     * 日志主题
     */
    topic?: string;
    /**
     * 查询的关键词，不输入则查询全部日志数据
     */
    query?: string;
  },
  options: {
    /**
     * AccessKey ID
     */
    accessKeyId: string;
    /**
     * AccessKey Secret
     */
    secretAccessKey: string;
    /**
     * 日志服务的域名
     */
    endpoint: string;
    /**
     * SDK版本号，固定值
     */
    apiVersion: string;
  },
) {
  console.log('aliyunsdk.SLS', Deno.inspect(aliyunsdk.SLS));
  const sls = new aliyunsdk.SLS({
    accessKeyId: options.accessKeyId,
    secretAccessKey: options.secretAccessKey,
    endpoint: options.endpoint,
    apiVersion: options.apiVersion,
  });
  console.log('sls', Deno.inspect(sls));
  return new Promise((resolve, reject) => {
    sls.executeLogStoreSql(p, (err: Error | null, data: unknown) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}
