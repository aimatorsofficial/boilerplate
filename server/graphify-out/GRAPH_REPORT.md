# Graph Report - server  (2026-10-02)

## Corpus Check
- 40 files · ~4,340 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: .example 1, (none) 1)

## Summary
- 255 nodes · 551 edges · 11 communities
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.83)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2166bb72`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- src/app.ts
- users.schema.ts
- validate.ts
- users.service.ts
- users.docs.ts
- server.ts
- compilerOptions
- devDependencies
- request-id.ts
- tsconfig.build.json

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 15 edges
2. `AppError` - 14 edges
3. `express` - 12 edges
4. `createApp()` - 11 edges
5. `UsersRepository` - 11 edges
6. `vitest` - 9 edges
7. `ERROR_CODES` - 9 edges
8. `scripts` - 8 edges
9. `HTTP_STATUS` - 8 edges
10. `errorHandler()` - 8 edges

## Surprising Connections (you probably didn't know these)
- `createApp()` --indirect_call--> `requestId()`  [INFERRED]
  src/app.ts → src/middleware/request-id.ts
- `createApp()` --calls--> `createDocsRouter()`  [EXTRACTED]
  src/app.ts → src/docs/swagger.ts
- `createApp()` --indirect_call--> `errorHandler()`  [INFERRED]
  src/app.ts → src/middleware/error-handler.ts
- `createApp()` --indirect_call--> `notFound()`  [INFERRED]
  src/app.ts → src/middleware/not-found.ts
- `createApp()` --calls--> `createUsersService()`  [EXTRACTED]
  src/app.ts → src/modules/users/users.service.ts

## Import Cycles
- None detected.

## Communities (11 total, 0 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.05
Nodes (37): dependencies, @asteasolutions/zod-to-openapi, compression, cors, express, helmet, pino, pino-http (+29 more)

### Community 1 - "src/app.ts"
Cohesion: 0.11
Nodes (27): compression, cors, helmet, pino-http, swagger-ui-express, vitest, app, APP_NAME (+19 more)

### Community 2 - "users.schema.ts"
Cohesion: 0.12
Nodes (25): express, src_constants_index_pagination, src_constants_index_user_limits, BODY_SIZE_LIMIT, PAGINATION, USER_LIMITS, buildPageMeta(), Page (+17 more)

### Community 3 - "validate.ts"
Cohesion: 0.13
Nodes (25): supertest, createApp(), ERROR_CODES, ErrorCode, src_constants_index_error_codes, src_constants_index_error_status, src_constants_index_errorcode, src_constants_index_httpstatus (+17 more)

### Community 4 - "users.service.ts"
Cohesion: 0.17
Nodes (14): ref_node_crypto, createRepositories(), Repositories, createMemoryUsersRepository(), PaginationQuery, toSkip(), UsersRepository, CreateUserInput (+6 more)

### Community 5 - "users.docs.ts"
Cohesion: 0.13
Nodes (21): @asteasolutions/zod-to-openapi, dataResponse(), emptyResponse(), errorResponse(), errorResponseSchema, jsonBody(), jsonContent(), listResponse() (+13 more)

### Community 6 - "server.ts"
Cohesion: 0.14
Nodes (13): pino, zod, commaSeparatedUrls, env, envSchema, loadEnv(), validSource, src_constants_index_shutdown_timeout_ms (+5 more)

### Community 7 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, esModuleInterop, forceConsistentCasingInFileNames, lib, module, moduleResolution, noImplicitOverride, noUncheckedIndexedAccess (+8 more)

### Community 8 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, eslint, @eslint/js, pino-pretty, prettier, supertest, tsx, @types/compression (+8 more)

### Community 9 - "request-id.ts"
Cohesion: 0.23
Nodes (9): ERROR_STATUS, HTTP_HEADERS, HTTP_STATUS, HttpStatus, REQUEST_ID_PATTERN, src_constants_index_http_headers, src_constants_index_request_id_pattern, readTrustedRequestId() (+1 more)

### Community 10 - "tsconfig.build.json"
Cohesion: 0.50
Nodes (3): ./tsconfig.json, exclude, extends

## Knowledge Gaps
- **98 isolated node(s):** `name`, `version`, `private`, `type`, `node` (+93 more)
  These have ≤1 connection - possible missing edges. (Counts symbols only; 110 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.105) - this node is a cross-community bridge._
- **Why does `express` connect `users.schema.ts` to `package.json`, `src/app.ts`, `validate.ts`, `request-id.ts`?**
  _High betweenness centrality (0.101) - this node is a cross-community bridge._
- **Why does `zod` connect `server.ts` to `package.json`, `users.schema.ts`, `validate.ts`, `users.docs.ts`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `createApp()` (e.g. with `errorHandler()` and `notFound()`) actually correct?**
  _`createApp()` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _98 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05263157894736842 - nodes in this community are weakly interconnected._
- **Should `src/app.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._