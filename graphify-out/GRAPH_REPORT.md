# Graph Report - Boilerplate  (2026-10-02)

## Corpus Check
- 43 files · ~8,342 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 2, .example 1)

## Summary
- 295 nodes · 594 edges · 12 communities
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 12 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2166bb72`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- constants/index.ts
- package.json
- src/app.ts
- users.schema.ts
- users.docs.ts
- CLAUDE.md
- Boilerplate Plan (Simple Version)
- database/index.ts
- server.ts
- compilerOptions
- devDependencies
- tsconfig.build.json

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 15 edges
2. `AppError` - 14 edges
3. `express` - 12 edges
4. `createApp()` - 12 edges
5. `UsersRepository` - 11 edges
6. `Boilerplate Plan (Simple Version)` - 11 edges
7. `vitest` - 9 edges
8. `ERROR_CODES` - 9 edges
9. `errorHandler()` - 9 edges
10. `scripts` - 8 edges

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

## Communities (12 total, 0 thin omitted)

### Community 0 - "constants/index.ts"
Cohesion: 0.09
Nodes (39): 4. API rules, ref_node_crypto, createApp(), ERROR_CODES, ERROR_STATUS, ErrorCode, HTTP_HEADERS, HTTP_STATUS (+31 more)

### Community 1 - "package.json"
Cohesion: 0.05
Nodes (37): eslint, @eslint/js, pino-pretty, prettier, tsx, @types/compression, @types/cors, @types/express (+29 more)

### Community 2 - "src/app.ts"
Cohesion: 0.10
Nodes (28): compression, cors, helmet, pino-http, supertest, swagger-ui-express, vitest, app (+20 more)

### Community 3 - "users.schema.ts"
Cohesion: 0.14
Nodes (23): express, server_src_constants_index_pagination, server_src_constants_index_user_limits, BODY_SIZE_LIMIT, PAGINATION, USER_LIMITS, buildPageMeta(), PageMeta (+15 more)

### Community 4 - "users.docs.ts"
Cohesion: 0.12
Nodes (22): @asteasolutions/zod-to-openapi, dataResponse(), emptyResponse(), errorResponse(), errorResponseSchema, jsonBody(), jsonContent(), listResponse() (+14 more)

### Community 5 - "CLAUDE.md"
Cohesion: 0.10
Nodes (19): 10. Language and naming, 11. How to add a new feature, 12. Swapping parts (why the structure exists), 13. CI/CD (do not break), 14. Never do this, 15. Before you say "done", 16. How to work with the owner, 1. Golden rules (+11 more)

### Community 6 - "Boilerplate Plan (Simple Version)"
Cohesion: 0.11
Nodes (16): 10. Definition of done, 1. The whole idea in 4 lines, 2. Folder structure, 3. What is included on day one, 4. Constants: where to change things, 5. Text and languages, 6. API response shape (same everywhere), 7. How the three swaps work (+8 more)

### Community 7 - "database/index.ts"
Cohesion: 0.20
Nodes (10): createRepositories(), Repositories, createMemoryUsersRepository(), Page, PaginationQuery, toSkip(), UsersRepository, CreateUserInput (+2 more)

### Community 8 - "server.ts"
Cohesion: 0.14
Nodes (13): pino, zod, commaSeparatedUrls, env, envSchema, loadEnv(), validSource, server_src_constants_index_shutdown_timeout_ms (+5 more)

### Community 9 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, esModuleInterop, forceConsistentCasingInFileNames, lib, module, moduleResolution, noImplicitOverride, noUncheckedIndexedAccess (+8 more)

### Community 10 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, eslint, @eslint/js, pino-pretty, prettier, supertest, tsx, @types/compression (+8 more)

### Community 11 - "tsconfig.build.json"
Cohesion: 0.50
Nodes (3): ./tsconfig.json, exclude, extends

## Knowledge Gaps
- **128 isolated node(s):** `name`, `version`, `private`, `type`, `node` (+123 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 140 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `4. API rules` connect `constants/index.ts` to `CLAUDE.md`?**
  _High betweenness centrality (0.126) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.092) - this node is a cross-community bridge._
- **Why does `createApp()` connect `constants/index.ts` to `server.ts`, `src/app.ts`, `CLAUDE.md`?**
  _High betweenness centrality (0.089) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `createApp()` (e.g. with `8. Testing rules` and `errorHandler()`) actually correct?**
  _`createApp()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _128 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `constants/index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08627450980392157 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05263157894736842 - nodes in this community are weakly interconnected._