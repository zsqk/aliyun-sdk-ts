// src/config.ts
/**
 * 全局配置：啰嗦模式（verbose）
 *
 * 优先级：
 * 1. 运行时通过 setVerbose() 覆盖
 * 2. 环境变量 ALIYUN_SDK_VERBOSE（支持 1/true/yes/on，不区分大小写）
 * 3. 环境变量 SDK_VERBOSE（回退）
 * 4. 默认 false
 *
 * 注意：读取环境变量需要 Deno 运行时的 --allow-env 权限。
 */

const TRUTHY = new Set(['1', 'true', 'yes', 'on']);

function parseEnvFlag(name: string): boolean | undefined {
  try {
    const v = Deno.env.get(name);
    if (!v) return undefined;
    return TRUTHY.has(v.trim().toLowerCase());
  } catch {
    // 无权限读取或其它错误时不抛出，返回 undefined 以使用默认值
    return undefined;
  }
}

const envVerbose = parseEnvFlag('ALIYUN_SDK_VERBOSE') ??
  parseEnvFlag('SDK_VERBOSE');
let runtimeVerbose = envVerbose ?? false;

/**
 * 返回当前啰嗦模式状态
 */
export function isVerbose(): boolean {
  return runtimeVerbose;
}

/**
 * 运行时设置啰嗦模式
 */
export function setVerbose(value: boolean): void {
  runtimeVerbose = !!value;
}
