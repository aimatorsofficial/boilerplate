# Graph Report - Boilerplate  (2026-10-02)

## Corpus Check
- 87 files · ~14,554 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 2, .example 1)

## Summary
- 507 nodes · 1379 edges · 17 communities (15 shown, 2 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 23 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `fc51f062`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- AppError
- package.json
- src/app.ts
- users.schema.ts
- users.docs.ts
- CLAUDE.md
- constants/index.ts
- mongo.repositories.test.ts
- env.ts
- compilerOptions
- devDependencies
- tsconfig.build.json
- auth.schema.ts
- dependencies
- scripts
- @eslint/js
- engines

## God Nodes (most connected - your core abstractions)
1. `AppError` - 30 edges
2. `ERROR_CODES` - 25 edges
3. `vitest` - 21 edges
4. `createApp()` - 20 edges
5. `UsersRepository` - 19 edges
6. `express` - 18 edges
7. `HTTP_STATUS` - 16 edges
8. `MemoryUsersRepository` - 16 edges
9. `compilerOptions` - 15 edges
10. `ROLES` - 14 edges

## Surprising Connections (you probably didn't know these)
- `8. Testing rules` --references--> `createApp()`  [INFERRED]
  CLAUDE.md → server/src/app.ts
- `4. API rules` --references--> `errorHandler()`  [INFERRED]
  CLAUDE.md → server/src/middleware/error-handler.ts
- `4. API rules` --references--> `validate()`  [INFERRED]
  CLAUDE.md → server/src/middleware/validate.ts
- `4. API rules` --references--> `requestId()`  [INFERRED]
  CLAUDE.md → server/src/middleware/request-id.ts
- `createApp()` --indirect_call--> `errorHandler()`  [INFERRED]
  server/src/app.ts → server/src/middleware/error-handler.ts

## Import Cycles
- None detected.

## Communities (17 total, 2 thin omitted)

### Community 0 - "AppError"
Cohesion: 0.10
Nodes (39): express, ERROR_STATUS, ErrorCode, BEARER_PREFIX, HTTP_HEADERS, HttpStatus, REQUEST_ID_PATTERN, server_src_constants_index_bearer_prefix (+31 more)

### Community 1 - "package.json"
Cohesion: 0.10
Nodes (19): compression, cors, eslint, helmet, pino-http, pino-pretty, prettier, tsx (+11 more)

### Community 2 - "src/app.ts"
Cohesion: 0.14
Nodes (33): 4. API rules, ref_node_crypto, supertest, vitest, createApp(), app, HEALTH_STATUS, ERROR_CODES (+25 more)

### Community 3 - "users.schema.ts"
Cohesion: 0.06
Nodes (43): server_src_constants_index_pagination, server_src_constants_index_role, server_src_constants_index_role_values, server_src_constants_index_user_limits, PAGINATION, Role, ROLE_VALUES, MemoryUsersRepository (+35 more)

### Community 4 - "users.docs.ts"
Cohesion: 0.07
Nodes (45): @asteasolutions/zod-to-openapi, swagger-ui-express, zod, server_src_constants_index_app_version, adminOnlyResponses, BEARER_AUTH, bearerSecurity, dataResponse() (+37 more)

### Community 5 - "CLAUDE.md"
Cohesion: 0.05
Nodes (36): 10. Language and naming, 11. How to add a new feature, 12. Swapping parts (why the structure exists), 13. CI/CD (do not break), 14. Never do this, 15. Before you say "done", 16. How to work with the owner, 1. Golden rules (+28 more)

### Community 6 - "constants/index.ts"
Cohesion: 0.10
Nodes (35): argon2, jose, env, APP_NAME, APP_VERSION, SHUTDOWN_TIMEOUT_MS, server_src_constants_index_app_name, server_src_constants_index_password_hashing (+27 more)

### Community 7 - "mongo.repositories.test.ts"
Cohesion: 0.09
Nodes (24): mongodb-memory-server, mongoose, MONGO_DUPLICATE_KEY_ERROR, server_src_constants_index_collection_names, server_src_constants_index_mongo_duplicate_key_error, server_src_constants_index_mongo_server_selection_timeout_ms, describeRefreshTokensRepositoryContract(), record (+16 more)

### Community 8 - "env.ts"
Cohesion: 0.08
Nodes (24): pino, commaSeparatedUrls, envSchema, loadEnv(), requiredOnly, SECRET, validSource, COLLECTION_NAMES (+16 more)

### Community 9 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, esModuleInterop, forceConsistentCasingInFileNames, lib, module, moduleResolution, noImplicitOverride, noUncheckedIndexedAccess (+8 more)

### Community 10 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, eslint, @eslint/js, mongodb-memory-server, pino-pretty, prettier, supertest, tsx (+9 more)

### Community 11 - "tsconfig.build.json"
Cohesion: 0.50
Nodes (3): ./tsconfig.json, exclude, extends

### Community 12 - "auth.schema.ts"
Cohesion: 0.09
Nodes (25): express-rate-limit, server_src_constants_index_password_limits, server_src_constants_index_rate_limit, server_src_constants_index_rate_limit_window_ms, BODY_SIZE_LIMIT, PASSWORD_HASHING, PASSWORD_LIMITS, RATE_LIMIT (+17 more)

### Community 13 - "dependencies"
Cohesion: 0.14
Nodes (14): dependencies, argon2, @asteasolutions/zod-to-openapi, compression, cors, express, express-rate-limit, helmet (+6 more)

### Community 14 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, format, lint, seed:admin, start, test (+1 more)

## Knowledge Gaps
- **166 isolated node(s):** `name`, `version`, `private`, `type`, `node` (+161 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 191 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `4. API rules` connect `src/app.ts` to `AppError`, `CLAUDE.md`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **Why does `createApp()` connect `src/app.ts` to `AppError`, `users.docs.ts`, `CLAUDE.md`, `constants/index.ts`, `env.ts`, `auth.schema.ts`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **Why does `vitest` connect `src/app.ts` to `AppError`, `package.json`, `users.schema.ts`, `constants/index.ts`, `mongo.repositories.test.ts`, `env.ts`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `createApp()` (e.g. with `8. Testing rules` and `errorHandler()`) actually correct?**
  _`createApp()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _166 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `AppError` be split into smaller, more focused modules?**
  _Cohesion score 0.0957372466806429 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._