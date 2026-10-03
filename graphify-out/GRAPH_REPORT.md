# Graph Report - Boilerplate  (2026-10-03)

## Corpus Check
- 184 files · ~25,162 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 13 file(s) not represented in the graph (top: (none) 9, .conf 2, .css 1)

## Summary
- 917 nodes · 2504 edges · 42 communities (37 shown, 5 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 33 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `266dc2d6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- AppError
- server/package.json
- metrics.test.ts
- mongo.repositories.test.ts
- users.docs.ts
- CLAUDE.md
- server/src/constants/index.ts
- package.json
- src/app.ts
- compilerOptions
- devDependencies
- tsconfig.build.json
- users.mongo.ts
- dependencies
- scripts
- client/eslint.config.js
- engines
- client/src/constants/index.ts
- ref_vitest
- UsersList.tsx
- routes.tsx
- RegisterForm.tsx
- sentry.ts
- devDependencies
- api-client.ts
- metrics.ts
- client/package.json
- modules/users/users.schema.ts
- compilerOptions
- UsersRepository
- query-client.ts
- rate-limit.ts
- ref_zod
- mongo/index.ts
- MemoryUsersRepository
- dependencies
- scripts
- main.tsx
- i18n.ts
- vite.config.ts
- allowScripts
- engines

## God Nodes (most connected - your core abstractions)
1. `AppError` - 33 edges
2. `ERROR_CODES` - 28 edges
3. `createApp()` - 24 edges
4. `express` - 20 edges
5. `UsersRepository` - 19 edges
6. `react-i18next` - 18 edges
7. `@testing-library/react` - 18 edges
8. `HTTP_STATUS` - 18 edges
9. `ROUTES` - 16 edges
10. `compilerOptions` - 16 edges

## Surprising Connections (you probably didn't know these)
- `8. Testing rules` --references--> `createApp()`  [INFERRED]
  CLAUDE.md → server/src/app.ts
- `4. API rules` --references--> `validate()`  [INFERRED]
  CLAUDE.md → server/src/middleware/validate.ts
- `4. API rules` --references--> `errorHandler()`  [INFERRED]
  CLAUDE.md → server/src/middleware/error-handler.ts
- `4. API rules` --references--> `requestId()`  [INFERRED]
  CLAUDE.md → server/src/middleware/request-id.ts
- `ProfileCardProps` --references--> `User`  [EXTRACTED]
  client/src/features/auth/ProfileCard.tsx → client/src/features/users/users.schema.ts

## Import Cycles
- None detected.

## Communities (42 total, 5 thin omitted)

### Community 0 - "AppError"
Cohesion: 0.15
Nodes (22): ERROR_STATUS, ErrorCode, HttpStatus, server_src_constants_index_error_status, server_src_constants_index_httpstatus, createApiRouter(), AppError, ErrorDetail (+14 more)

### Community 1 - "server/package.json"
Cohesion: 0.08
Nodes (25): compression, cors, helmet, pino, pino-http, pino-pretty, prom-client, tsx (+17 more)

### Community 2 - "metrics.test.ts"
Cohesion: 0.18
Nodes (24): ref_node_crypto, supertest, app, HEALTH_STATUS, ERROR_CODES, HTTP_STATUS, server_src_constants_index_api_prefix, server_src_constants_index_api_routes (+16 more)

### Community 3 - "mongo.repositories.test.ts"
Cohesion: 0.13
Nodes (14): mongodb-memory-server, describeRefreshTokensRepositoryContract(), record, asha, describeUsersRepositoryContract(), PUBLIC_FIELDS, ravi, MemoryRefreshTokensRepository (+6 more)

### Community 4 - "users.docs.ts"
Cohesion: 0.06
Nodes (53): @asteasolutions/zod-to-openapi, swagger-ui-express, APP_NAME, APP_VERSION, SHUTDOWN_TIMEOUT_MS, server_src_constants_index_app_name, adminOnlyResponses, BEARER_AUTH (+45 more)

### Community 5 - "CLAUDE.md"
Cohesion: 0.04
Nodes (43): 10. Language and naming, 11. How to add a new feature, 12. Swapping parts (why the structure exists), 13. CI/CD (do not break), 14. Never do this, 15. Before you say "done", 16. How to work with the owner, 1. Golden rules (+35 more)

### Community 6 - "server/src/constants/index.ts"
Cohesion: 0.10
Nodes (31): commaSeparatedUrls, env, envSchema, loadEnv(), requiredOnly, SECRET, validSource, DB_DRIVERS (+23 more)

### Community 7 - "package.json"
Cohesion: 0.20
Nodes (9): devDependencies, husky, lint-staged, name, private, scripts, prepare, husky (+1 more)

### Community 8 - "src/app.ts"
Cohesion: 0.13
Nodes (20): 4. API rules, express, createApp(), server_src_constants_index_body_size_limit, server_src_constants_index_errorcode, server_src_constants_index_request_id_pattern, Database, sendError() (+12 more)

### Community 9 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, esModuleInterop, forceConsistentCasingInFileNames, lib, module, moduleResolution, noImplicitOverride, noUncheckedIndexedAccess (+8 more)

### Community 10 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, eslint, @eslint/js, mongodb-memory-server, pino-pretty, prettier, supertest, tsx (+9 more)

### Community 11 - "tsconfig.build.json"
Cohesion: 0.50
Nodes (3): ./tsconfig.json, exclude, extends

### Community 12 - "users.mongo.ts"
Cohesion: 0.12
Nodes (16): mongoose, COLLECTION_NAMES, DB_DRIVER_VALUES, DbDriver, MONGO_DUPLICATE_KEY_ERROR, MONGO_SERVER_SELECTION_TIMEOUT_MS, server_src_constants_index_collection_names, server_src_constants_index_mongo_duplicate_key_error (+8 more)

### Community 13 - "dependencies"
Cohesion: 0.12
Nodes (16): dependencies, argon2, @asteasolutions/zod-to-openapi, compression, cors, express, express-rate-limit, helmet (+8 more)

### Community 14 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, format, lint, seed:admin, start, test (+1 more)

### Community 15 - "client/eslint.config.js"
Cohesion: 0.40
Nodes (4): ref_eslint_js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, ref_typescript_eslint

### Community 17 - "client/src/constants/index.ts"
Cohesion: 0.17
Nodes (9): client_src_constants_index_query_keys, client_src_constants_index_storage_keys, QUERY_KEYS, STORAGE_KEYS, usersApi, meRequiringToken(), refreshReturning(), unauthorized() (+1 more)

### Community 18 - "ref_vitest"
Cohesion: 0.17
Nodes (21): API_PATHS, client_src_constants_index_api_paths, routes, renderLogin(), renderRegister(), client_src_lib_i18n_i18n, adminUser, apiError() (+13 more)

### Community 19 - "UsersList.tsx"
Cohesion: 0.08
Nodes (34): AppHeader(), AppHeaderProps, Button(), ButtonProps, VARIANT_CLASSES, CenteredCard(), CenteredCardProps, EmptyState() (+26 more)

### Community 20 - "routes.tsx"
Cohesion: 0.21
Nodes (18): guestRoutes, pages, signedInRoutes, Role, ROLES, client_src_constants_index_role, client_src_constants_index_roles, client_src_constants_index_routes (+10 more)

### Community 21 - "RegisterForm.tsx"
Cohesion: 0.15
Nodes (18): FormError(), FormErrorProps, TextField(), TextFieldProps, client_src_constants_index_password_min_length, AuthSwitchLink(), AuthSwitchLinkProps, LoginForm() (+10 more)

### Community 22 - "sentry.ts"
Cohesion: 0.25
Nodes (9): @sentry/node, server_src_constants_index_app_version, server_src_constants_index_sentry, SENTRY, flushSentry(), initSentry(), NO_PERSONAL_DATA, reportError() (+1 more)

### Community 23 - "devDependencies"
Cohesion: 0.09
Nodes (22): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, jsdom, msw, prettier (+14 more)

### Community 24 - "api-client.ts"
Cohesion: 0.13
Nodes (18): API_BASE_URL, AUTH_PATHS_WITHOUT_RETRY, ROLE_VALUES, client_src_constants_index_api_base_url, client_src_constants_index_auth_paths_without_retry, client_src_constants_index_http_status, client_src_constants_index_pagination, client_src_constants_index_role_values (+10 more)

### Community 25 - "metrics.ts"
Cohesion: 0.15
Nodes (14): BEARER_PREFIX, HTTP_HEADERS, REQUEST_ID_PATTERN, server_src_constants_index_bearer_prefix, server_src_constants_index_http_headers, server_src_constants_index_metrics, METRICS, createMetricsRouter() (+6 more)

### Community 26 - "client/package.json"
Cohesion: 0.10
Nodes (20): eslint, @eslint/js, prettier, @types/node, typescript, typescript-eslint, vitest, zod (+12 more)

### Community 27 - "modules/users/users.schema.ts"
Cohesion: 0.06
Nodes (57): argon2, jose, server_src_constants_index_pagination, server_src_constants_index_password_hashing, server_src_constants_index_password_limits, server_src_constants_index_token_expiry, server_src_constants_index_token_limits, server_src_constants_index_user_limits (+49 more)

### Community 28 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, forceConsistentCasingInFileNames, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 29 - "UsersRepository"
Cohesion: 0.23
Nodes (7): Repositories, Page, UsersRepository, NewUserRecord, UpdateUserInput, User, UserCredentials

### Community 30 - "query-client.ts"
Cohesion: 0.16
Nodes (13): router, appRoutes, client_src_constants_index_query_settings, HTTP_STATUS, PAGINATION, PASSWORD_MIN_LENGTH, QUERY_SETTINGS, endSession() (+5 more)

### Community 31 - "rate-limit.ts"
Cohesion: 0.24
Nodes (8): express-rate-limit, server_src_constants_index_rate_limit, server_src_constants_index_rate_limit_window_ms, RATE_LIMIT_WINDOW_MS, TOKEN_EXPIRY, createAuthRateLimit(), createGeneralRateLimit(), createRateLimit()

### Community 32 - "ref_zod"
Cohesion: 0.11
Nodes (17): apiErrorBodySchema, ERROR_MESSAGE_KEYS, isKnownErrorCode(), KnownErrorCode, readApiErrorCode(), toErrorMessageKey(), dataEnvelopeSchema, pageEnvelopeSchema (+9 more)

### Community 35 - "mongo/index.ts"
Cohesion: 0.20
Nodes (9): server_src_constants_index_mongo_server_selection_timeout_ms, connectMongo(), disconnectMongo(), isMongoReady(), createMongoDatabase(), MongoUsersRepository, toUser(), toUserOrNull() (+1 more)

### Community 37 - "dependencies"
Cohesion: 0.22
Nodes (9): dependencies, axios, i18next, react, react-dom, react-i18next, react-router, @tanstack/react-query (+1 more)

### Community 38 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, dev, format, lint, preview, test, typecheck

### Community 39 - "main.tsx"
Cohesion: 0.40
Nodes (4): App(), client_src_index, rootElement, react-dom

### Community 40 - "i18n.ts"
Cohesion: 0.12
Nodes (23): DEFAULT_LANGUAGE, Language, SUPPORTED_LANGUAGES, client_src_constants_index_default_language, client_src_constants_index_language, client_src_constants_index_supported_languages, resources, switchLanguage() (+15 more)

## Knowledge Gaps
- **297 isolated node(s):** `name`, `private`, `version`, `type`, `node` (+292 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 344 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `4. API rules` connect `src/app.ts` to `AppError`, `CLAUDE.md`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Why does `createApp()` connect `src/app.ts` to `AppError`, `metrics.test.ts`, `users.docs.ts`, `CLAUDE.md`, `server/src/constants/index.ts`, `metrics.ts`, `modules/users/users.schema.ts`, `rate-limit.ts`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `client/package.json`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `createApp()` (e.g. with `8. Testing rules` and `errorHandler()`) actually correct?**
  _`createApp()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _297 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `AppError` be split into smaller, more focused modules?**
  _Cohesion score 0.14623655913978495 - nodes in this community are weakly interconnected._
- **Should `server/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._