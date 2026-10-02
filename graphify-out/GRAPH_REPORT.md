# Graph Report - Boilerplate  (2026-10-03)

## Corpus Check
- 96 files · ~16,688 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 6, .example 1)

## Summary
- 554 nodes · 1522 edges · 17 communities (15 shown, 2 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 27 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d80b8188`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- constants/index.ts
- server/package.json
- vitest
- users.mongo.ts
- users.docs.ts
- CLAUDE.md
- users.service.ts
- package.json
- auth.tokens.ts
- compilerOptions
- devDependencies
- tsconfig.build.json
- users.schema.ts
- dependencies
- scripts
- @eslint/js
- engines

## God Nodes (most connected - your core abstractions)
1. `AppError` - 33 edges
2. `ERROR_CODES` - 28 edges
3. `vitest` - 24 edges
4. `createApp()` - 24 edges
5. `express` - 20 edges
6. `UsersRepository` - 19 edges
7. `HTTP_STATUS` - 18 edges
8. `MemoryUsersRepository` - 16 edges
9. `ROLES` - 15 edges
10. `errorHandler()` - 15 edges

## Surprising Connections (you probably didn't know these)
- `8. Testing rules` --references--> `createApp()`  [INFERRED]
  CLAUDE.md → server/src/app.ts
- `4. API rules` --references--> `errorHandler()`  [INFERRED]
  CLAUDE.md → server/src/middleware/error-handler.ts
- `4. API rules` --references--> `requestId()`  [INFERRED]
  CLAUDE.md → server/src/middleware/request-id.ts
- `4. API rules` --references--> `validate()`  [INFERRED]
  CLAUDE.md → server/src/middleware/validate.ts
- `createApp()` --calls--> `createDocsRouter()`  [EXTRACTED]
  server/src/app.ts → server/src/docs/swagger.ts

## Import Cycles
- None detected.

## Communities (17 total, 2 thin omitted)

### Community 0 - "constants/index.ts"
Cohesion: 0.07
Nodes (70): 4. API rules, express, express-rate-limit, ref_node_crypto, createApp(), app, HEALTH_STATUS, ERROR_CODES (+62 more)

### Community 1 - "server/package.json"
Cohesion: 0.10
Nodes (20): compression, cors, eslint, helmet, pino-http, pino-pretty, prettier, prom-client (+12 more)

### Community 2 - "vitest"
Cohesion: 0.08
Nodes (36): @sentry/node, supertest, vitest, APP_VERSION, SHUTDOWN_TIMEOUT_MS, HTTP_STATUS, server_src_constants_index_api_prefix, server_src_constants_index_api_routes (+28 more)

### Community 3 - "users.mongo.ts"
Cohesion: 0.05
Nodes (43): mongodb-memory-server, mongoose, server_src_constants_index_collection_names, server_src_constants_index_mongo_duplicate_key_error, server_src_constants_index_pagination, server_src_constants_index_role_values, PAGINATION, describeRefreshTokensRepositoryContract() (+35 more)

### Community 4 - "users.docs.ts"
Cohesion: 0.07
Nodes (49): @asteasolutions/zod-to-openapi, swagger-ui-express, adminOnlyResponses, BEARER_AUTH, bearerSecurity, dataResponse(), emptyResponse(), errorResponse() (+41 more)

### Community 5 - "CLAUDE.md"
Cohesion: 0.04
Nodes (41): 10. Language and naming, 11. How to add a new feature, 12. Swapping parts (why the structure exists), 13. CI/CD (do not break), 14. Never do this, 15. Before you say "done", 16. How to work with the owner, 1. Golden rules (+33 more)

### Community 6 - "users.service.ts"
Cohesion: 0.12
Nodes (22): argon2, pino, server_src_constants_index_password_hashing, server_src_constants_index_roles, PASSWORD_HASHING, ROLES, logger, prettyTransport (+14 more)

### Community 7 - "package.json"
Cohesion: 0.20
Nodes (9): devDependencies, husky, lint-staged, name, private, scripts, prepare, husky (+1 more)

### Community 8 - "auth.tokens.ts"
Cohesion: 0.07
Nodes (33): jose, zod, commaSeparatedUrls, env, envSchema, loadEnv(), requiredOnly, SECRET (+25 more)

### Community 9 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, esModuleInterop, forceConsistentCasingInFileNames, lib, module, moduleResolution, noImplicitOverride, noUncheckedIndexedAccess (+8 more)

### Community 10 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, eslint, @eslint/js, mongodb-memory-server, pino-pretty, prettier, supertest, tsx (+9 more)

### Community 11 - "tsconfig.build.json"
Cohesion: 0.50
Nodes (3): ./tsconfig.json, exclude, extends

### Community 12 - "users.schema.ts"
Cohesion: 0.09
Nodes (36): server_src_constants_index_password_limits, server_src_constants_index_user_limits, BODY_SIZE_LIMIT, PASSWORD_LIMITS, RATE_LIMIT, TOKEN_LIMITS, USER_LIMITS, Role (+28 more)

### Community 13 - "dependencies"
Cohesion: 0.12
Nodes (16): dependencies, argon2, @asteasolutions/zod-to-openapi, compression, cors, express, express-rate-limit, helmet (+8 more)

### Community 14 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, format, lint, seed:admin, start, test (+1 more)

## Knowledge Gaps
- **182 isolated node(s):** `name`, `private`, `prepare`, `husky`, `husky` (+177 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 207 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `4. API rules` connect `constants/index.ts` to `CLAUDE.md`?**
  _High betweenness centrality (0.081) - this node is a cross-community bridge._
- **Why does `createApp()` connect `constants/index.ts` to `vitest`, `users.docs.ts`, `CLAUDE.md`, `users.service.ts`, `auth.tokens.ts`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Why does `vitest` connect `vitest` to `constants/index.ts`, `server/package.json`, `users.mongo.ts`, `users.service.ts`, `auth.tokens.ts`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `createApp()` (e.g. with `8. Testing rules` and `errorHandler()`) actually correct?**
  _`createApp()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `name`, `private`, `prepare` to the rest of the system?**
  _182 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `constants/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06732456140350877 - nodes in this community are weakly interconnected._
- **Should `server/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._