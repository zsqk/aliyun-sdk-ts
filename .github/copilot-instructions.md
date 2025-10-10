# Guidance for AI coding agents working on aliyun-sdk-ts

This file gives focused, actionable guidance so an AI assistant can be productive quickly in this repository.

Keep instructions short (20-50 lines) and reference key files and commands.

---

1. Big picture

- Purpose: a TypeScript (Deno-first) thin SDK / helper layer for Aliyun services (OSS, SLS) and a small CLI utility (`cli/oss-before-upload.ts`).
- Major components:
  - `src/oss/*`: OSS helpers (endpoint types, util.createClient -> wraps `@alicloud/oss20190517`), metadata and upload helpers (CRC64-based pre-upload checks).
  - `src/sls/*`: SLS helpers (create client wrappers around `@alicloud/sls20201230` and request helpers like `getLogs`).
  - `cli/`: small command-line utilities that call the library code.
- Design note: prefer lazy/dynamic imports for heavy dependencies (see `beforeUpload` in `src/oss/upload.ts` which lazy-imports `@zsqk/crc64`) to avoid startup cost in CLI paths that don't use them.

2. Developer workflows (Deno)

- Run tests (unit/runtime): `deno test --unstable` (add `--no-check` to skip TypeScript errors when the repo has ambient type issues).
- Common debug/test flags: `--allow-env` (some tests rely on env), `--no-check` (skip TS type checking), `-A` (allow all for CLI runs).
- Format/lint: `deno fmt` and `deno lint` (config in `deno.json`).
- Run CLI example (before-upload):
  ```bash
  deno run -A cli/oss-before-upload.ts \
    --bucket my-bucket --endpoint oss-cn-beijing.aliyuncs.com --local dist \
    --ak $OSS_ACCESS_KEY_ID --sk $OSS_ACCESS_KEY_SECRET
  ```

3. Project-specific conventions

- Compatible npm and jsr packages can be used with Deno. Configure imports in `deno.json`. Prefer using the alias imports defined in `deno.json`.
- Types-first: many modules export strict TypeScript types (e.g., `src/oss/endpoint.ts`). Keep changes backward-compatible: prefer widening union types conservatively.
- Lazy/dynamic imports: heavy libs (crc64, large SDKs) may be dynamically imported inside functions to reduce CLI startup or test runtime cost.
- Path normalization: upload code expects POSIX paths for OSS keys; convert backslashes when necessary (see `beforeUpload` path handling).
- Tests and runtime rely on environment variables for credentials. Use `--allow-env` when running tests that invoke network or SDK code.

4. Integration points & external deps

- `deno.json` imports map references:
  - `@alicloud/oss20190517`, `@alicloud/sls20201230`, `@alicloud/openapi-client` (npm via import map)
  - `@zsqk/crc64` via `jsr:` scheme
  - `zod` for runtime validation
- SDK clients are created by `createClient` functions which construct an `$OpenApi.Config` and return the `.default` export of the SDK (see `src/oss/util.ts`, `src/sls/get-logs.ts`).

5. Files to examine first (examples)

- `src/oss/endpoint.ts` — endpoint typing rules and region list (change here affects many call sites).
- `src/oss/util.ts` — `createClient` pattern for OSS client creation.
- `src/oss/upload.ts` — CRC64 pre-upload workflow, path handling, batching logic.
- `cli/oss-before-upload.ts` — CLI usage example and flags.
- `deno.json` — import map / compiler options; essential for running and linting.

6. Common pitfalls to avoid

- Do not assume `.default` exists on imported SDKs without checking types — some SDK types are imported as types only; use runtime-safe access.
- Avoid global `string`-template widening for endpoints; prefer explicit region unions (this repo values strictness for endpoint types).
- Tests may fail locally if environment variables or Deno permissions are not set; run with `--allow-env` and appropriate network permissions when necessary.

---

If anything is unclear or you'd like more examples (e.g., adding a new region to `endpoint.ts`, or a micro-change to `beforeUpload`), tell me which area to expand and I'll iterate.
