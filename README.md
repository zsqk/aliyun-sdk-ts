# aliyun-sdk-ts

Aliyun SDK for TypeScript

阿里云官方的 SDK 分为几种:

1. <https://www.npmjs.com/package/aliyun-sdk>
   已经长期没有更新, 并且没有标注替代方案.
2. <https://www.npmjs.com/package/@alicloud/sls20201230/>
   从开发者中心 <https://api.aliyun.com/api-tools/sdk/Sls?version=2020-12-30>
   可进入. 但一方面文档欠缺, 一方面真怕哪天又不维护了.

除此之外, 阿里云的 API 也比较乱, 或者说从不同文档处得到的许多信息都冲突.
应该是在迭代的过程中没有及时更新文档导致.

因为 API 文档也不够好, 所以优先使用 `@alicloud/sls20201230` 这种 SDK.
