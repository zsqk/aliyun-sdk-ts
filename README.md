# aliyun-sdk-ts

Aliyun SDK for TypeScript

阿里云官方的 SDK 分为几种:

1. <https://www.npmjs.com/package/aliyun-sdk>
   已经长期没有更新, 并且没有标注替代方案.
   之前的仓库 `aliyun/aliyun-sdk-nodejs` 已经改名为 `aliyun-UED/aliyun-sdk-js`.
2. <https://www.npmjs.com/package/@alicloud/sls20201230/>
   从开发者中心 <https://api.aliyun.com/api-tools/sdk/Sls?version=2020-12-30>
   可进入. 应该是自动生成的文档及 SDK.
   [repo](https://github.com/aliyun/alibabacloud-typescript-sdk)

除此之外, 阿里云的 API 也比较乱, 或者说从不同文档处得到的许多信息都冲突.
应该是在迭代的过程中没有及时更新文档导致.

在阿里云中, 不同的功能可能还会有专属的 SDK, 比如 OSS 的
<https://github.com/ali-sdk/ali-oss>.

目前为了方便, 统一使用阿里云自动生成的 aliyun/alibabacloud-typescript-sdk.

## 存在的问题

Aliyun SDK 依赖的 `httpx` 使用的 `globalThis.NodeJS.Timeout.unref()` 在 deno
中可能会被报内存泄漏.

### CLI: beforeUpload 预检查工具

```sh
deno install -g -A -n osscheck jsr:@zsqk/aliyun-sdk/cli/oss-before-upload
```

其中的参数 `-g` 表示全局安装, `-A` 表示完全权限, `-n osscheck` 表示重命名为 `osscheck`.

提供一个命令行工具用于在上传前对比本地目录与 OSS 上已有文件 (基于 CRC64)，可输出计划、写入文件、并可选择删除已完全相同的本地文件。

运行示例：

```bash
deno run -A cli/oss-before-upload.ts \
  --bucket my-bucket \
  --endpoint oss-cn-beijing.aliyuncs.com \
  --local dist \
  --oss-dir assets \
  --ak $OSS_ACCESS_KEY_ID \
  --sk $OSS_ACCESS_KEY_SECRET \
  --write-result .cache/before-upload.json \
  --remove-same \
  --verbose
```

参数说明：

|       参数       |                                             描述                                             |
| ---------------- | -------------------------------------------------------------------------------------------- |
| `--bucket`       | (必填) OSS Bucket 名称                                                                       |
| `--endpoint`     | endpoint，默认 `oss-cn-beijing.aliyuncs.com`                                                 |
| `--local`        | (必填) 本地文件夹路径                                                                        |
| `--oss-dir`      | OSS 目标前缀 (可选)                                                                          |
| `--ak` / `--sk`  | AccessKeyId / AccessKeySecret (或使用环境变量 `OSS_ACCESS_KEY_ID` / `OSS_ACCESS_KEY_SECRET`) |
| `--max-batch`    | 分批获取元信息的最大数量，默认 100                                                           |
| `--write-result` | 将结果写入指定 JSON 文件                                                                     |
| `--remove-same`  | 删除本地与 OSS 内容完全相同的文件                                                            |
| `--json`         | 仅输出 JSON 结果 (机器可读)                                                                  |
| `--verbose`      | 输出详细日志                                                                                 |
| `-h, --help`     | 查看帮助                                                                                     |

输出状态含义：

|  状态  |                   含义                   |
| ------ | ---------------------------------------- |
| `SAME` | 本地文件与 OSS 一致 (可跳过)            |
| `DIFF` | OSS 已存在但内容不同 (通常需要覆盖上传) |
| `NEW`  | OSS 不存在 (需要上传)                   |

可与后续真正的上传脚本配合，把 `NEW` 和 `DIFF` 过滤出来进行上传。
