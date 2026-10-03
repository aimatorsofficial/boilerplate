# Graph Report - Boilerplate  (2026-10-03)

## Corpus Check
- 176 files · ~23,988 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 13 file(s) not represented in the graph (top: (none) 9, .conf 2, .css 1)

## Summary
- 885 nodes · 2392 edges · 44 communities (39 shown, 5 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 30 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `284c5d42`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- AppError
- server/package.json
- metrics.test.ts
- env.ts
- users.docs.ts
- CLAUDE.md
- users.service.ts
- package.json
- auth.tokens.ts
- compilerOptions
- devDependencies
- tsconfig.build.json
- auth.schema.ts
- dependencies
- scripts
- client/eslint.config.js
- engines
- client/src/constants/index.ts
- AuthenticatedLayout.test.tsx
- ref_vitest
- routes.tsx
- RegisterForm.tsx
- src/server.ts
- devDependencies
- features/users/users.schema.ts
- src/app.ts
- client/package.json
- users.controller.ts
- compilerOptions
- users.mongo.ts
- password.ts
- server/src/constants/index.ts
- api-error.ts
- modules/users/users.schema.ts
- api-response.ts
- MongoUsersRepository
- MemoryUsersRepository
- dependencies
- scripts
- main.tsx
- i18next.d.ts
- vite.config.ts
- allowScripts
- engines

## God Nodes (most connected - your core abstractions)
1. `AppError` - 33 edges
2. `ERROR_CODES` - 28 edges
3. `createApp()` - 24 edges
4. `express` - 20 edges
5. `UsersRepository` - 19 edges
6. `HTTP_STATUS` - 18 edges
7. `react-i18next` - 17 edges
8. `@testing-library/react` - 16 edges
9. `compilerOptions` - 16 edges
10. `MemoryUsersRepository` - 16 edges

## Surprising Connections (you probably didn't know these)
- `8. Testing rules` --references--> `createApp()`  [INFERRED]
  CLAUDE.md → server/src/app.ts
- `4. API rules` --references--> `errorHandler()`  [INFERRED]
  CLAUDE.md → server/src/middleware/error-handler.ts
- `4. API rules` --references--> `requestId()`  [INFERRED]
  CLAUDE.md → server/src/middleware/request-id.ts
- `4. API rules` --references--> `validate()`  [INFERRED]
  CLAUDE.md → server/src/middleware/validate.ts
- `refreshReturning()` --calls--> `apiUrl()`  [EXTRACTED]
  client/src/lib/api-client.test.ts → client/src/test/server.ts

## Import Cycles
- None detected.

## Communities (44 total, 5 thin omitted)

### Community 0 - "AppError"
Cohesion: 0.10
Nodes (36): 4. API rules, express, ERROR_STATUS, ErrorCode, BEARER_PREFIX, HTTP_HEADERS, HttpStatus, REQUEST_ID_PATTERN (+28 more)

### Community 1 - "server/package.json"
Cohesion: 0.08
Nodes (25): compression, cors, helmet, mongodb-memory-server, pino-http, pino-pretty, prom-client, tsx (+17 more)

### Community 2 - "metrics.test.ts"
Cohesion: 0.17
Nodes (22): ref_node_crypto, supertest, app, HEALTH_STATUS, HTTP_STATUS, server_src_constants_index_api_prefix, server_src_constants_index_api_routes, server_src_constants_index_health_status (+14 more)

### Community 3 - "env.ts"
Cohesion: 0.05
Nodes (42): mongoose, commaSeparatedUrls, envSchema, loadEnv(), requiredOnly, SECRET, validSource, COLLECTION_NAMES (+34 more)

### Community 4 - "users.docs.ts"
Cohesion: 0.07
Nodes (46): @asteasolutions/zod-to-openapi, swagger-ui-express, adminOnlyResponses, BEARER_AUTH, bearerSecurity, dataResponse(), emptyResponse(), errorResponse() (+38 more)

### Community 5 - "CLAUDE.md"
Cohesion: 0.04
Nodes (42): 10. Language and naming, 11. How to add a new feature, 12. Swapping parts (why the structure exists), 13. CI/CD (do not break), 14. Never do this, 15. Before you say "done", 16. How to work with the owner, 1. Golden rules (+34 more)

### Community 6 - "users.service.ts"
Cohesion: 0.26
Nodes (10): ref_zod, CreateUserInput, userFieldSchemas, seedAdmin(), SeedAdminInput, seedAdminInputSchema, admin, createUsersService() (+2 more)

### Community 7 - "package.json"
Cohesion: 0.20
Nodes (9): devDependencies, husky, lint-staged, name, private, scripts, prepare, husky (+1 more)

### Community 8 - "auth.tokens.ts"
Cohesion: 0.15
Nodes (20): jose, env, APP_NAME, ERROR_CODES, server_src_constants_index_app_name, server_src_constants_index_error_codes, server_src_constants_index_roles, server_src_constants_index_token_expiry (+12 more)

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
Cohesion: 0.16
Nodes (14): server_src_constants_index_password_limits, Role, UserDocument, AuthContext, loginBodySchema, LoginInput, refreshTokenBodySchema, RefreshTokenInput (+6 more)

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
Cohesion: 0.08
Nodes (36): router, appRoutes, client_src_constants_index_api_base_url, client_src_constants_index_auth_paths_without_retry, client_src_constants_index_http_status, client_src_constants_index_query_keys, client_src_constants_index_query_settings, client_src_constants_index_storage_keys (+28 more)

### Community 18 - "AuthenticatedLayout.test.tsx"
Cohesion: 0.19
Nodes (21): API_PATHS, client_src_constants_index_api_paths, client_src_constants_index_pagination, routes, renderLogin(), renderRegister(), client_src_lib_i18n_i18n, adminUser (+13 more)

### Community 19 - "ref_vitest"
Cohesion: 0.11
Nodes (18): Button(), ButtonProps, VARIANT_CLASSES, EmptyState(), EmptyStateProps, ErrorState(), ErrorStateProps, PageTitle() (+10 more)

### Community 20 - "routes.tsx"
Cohesion: 0.18
Nodes (20): adminOnlyRoutes, AppHeader(), AppHeaderProps, Spinner(), Role, ROLES, client_src_constants_index_role, client_src_constants_index_roles (+12 more)

### Community 21 - "RegisterForm.tsx"
Cohesion: 0.15
Nodes (18): CenteredCard(), CenteredCardProps, FormError(), FormErrorProps, TextField(), TextFieldProps, client_src_constants_index_password_min_length, AuthSwitchLink() (+10 more)

### Community 22 - "src/server.ts"
Cohesion: 0.12
Nodes (19): pino, @sentry/node, APP_VERSION, SHUTDOWN_TIMEOUT_MS, server_src_constants_index_app_version, server_src_constants_index_sentry, server_src_constants_index_shutdown_timeout_ms, SENTRY (+11 more)

### Community 23 - "devDependencies"
Cohesion: 0.09
Nodes (22): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, jsdom, msw, prettier (+14 more)

### Community 24 - "features/users/users.schema.ts"
Cohesion: 0.16
Nodes (14): API_BASE_URL, AUTH_PATHS_WITHOUT_RETRY, ROLE_VALUES, client_src_constants_index_role_values, CurrentUserProfile(), ProfileCard(), ProfileCardProps, ROLE_LABEL_KEYS (+6 more)

### Community 25 - "src/app.ts"
Cohesion: 0.17
Nodes (18): createApp(), server_src_constants_index_bearer_prefix, server_src_constants_index_body_size_limit, createApiRouter(), notFound(), createGeneralRateLimit(), createAuthRouter(), createUsersRouter() (+10 more)

### Community 26 - "client/package.json"
Cohesion: 0.10
Nodes (20): eslint, @eslint/js, prettier, @types/node, typescript, typescript-eslint, vitest, zod (+12 more)

### Community 27 - "users.controller.ts"
Cohesion: 0.26
Nodes (13): server_src_constants_index_pagination, PAGINATION, NoParams, buildPageMeta(), PageMeta, paginationQuerySchema, toSkip(), sendCreated() (+5 more)

### Community 28 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, forceConsistentCasingInFileNames, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 29 - "users.mongo.ts"
Cohesion: 0.25
Nodes (9): NEWEST_FIRST, UPDATE_OPTIONS, Page, PaginationQuery, UsersRepository, NewUserRecord, UpdateUserInput, User (+1 more)

### Community 30 - "password.ts"
Cohesion: 0.16
Nodes (11): argon2, server_src_constants_index_password_hashing, BODY_SIZE_LIMIT, PASSWORD_HASHING, PASSWORD_LIMITS, RATE_LIMIT, TOKEN_LIMITS, USER_LIMITS (+3 more)

### Community 31 - "server/src/constants/index.ts"
Cohesion: 0.18
Nodes (9): express-rate-limit, server_src_constants_index_metrics, server_src_constants_index_rate_limit, server_src_constants_index_rate_limit_window_ms, METRICS, RATE_LIMIT_WINDOW_MS, TOKEN_EXPIRY, createAuthRateLimit() (+1 more)

### Community 32 - "api-error.ts"
Cohesion: 0.21
Nodes (9): apiErrorBodySchema, ERROR_MESSAGE_KEYS, isKnownErrorCode(), KnownErrorCode, readApiErrorCode(), toErrorMessageKey(), axios, InternalAxiosRequestConfig (+1 more)

### Community 33 - "modules/users/users.schema.ts"
Cohesion: 0.21
Nodes (11): server_src_constants_index_user_limits, createUserBodySchema, emailSchema, ListUsersQuery, listUsersQuerySchema, nameSchema, passwordSchema, roleSchema (+3 more)

### Community 34 - "api-response.ts"
Cohesion: 0.20
Nodes (10): refreshAccessTokenOnce(), requestNewAccessToken(), dataEnvelopeSchema, pageEnvelopeSchema, PageMeta, pageMetaSchema, readData(), readPage() (+2 more)

### Community 35 - "MongoUsersRepository"
Cohesion: 0.26
Nodes (5): isDuplicateKeyError(), MongoUsersRepository, rethrowDuplicateEmail(), toUser(), toUserOrNull()

### Community 37 - "dependencies"
Cohesion: 0.22
Nodes (9): dependencies, axios, i18next, react, react-dom, react-i18next, react-router, @tanstack/react-query (+1 more)

### Community 38 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, dev, format, lint, preview, test, typecheck

### Community 39 - "main.tsx"
Cohesion: 0.40
Nodes (4): App(), client_src_index, rootElement, react-dom

### Community 40 - "i18next.d.ts"
Cohesion: 0.50
Nodes (3): client_src_locales_en, CustomTypeOptions, i18next

## Knowledge Gaps
- **291 isolated node(s):** `name`, `private`, `version`, `type`, `node` (+286 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 335 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `4. API rules` connect `AppError` to `CLAUDE.md`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Why does `createApp()` connect `src/app.ts` to `AppError`, `metrics.test.ts`, `users.docs.ts`, `CLAUDE.md`, `users.service.ts`, `auth.tokens.ts`, `src/server.ts`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `client/package.json`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `createApp()` (e.g. with `8. Testing rules` and `errorHandler()`) actually correct?**
  _`createApp()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _291 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `AppError` be split into smaller, more focused modules?**
  _Cohesion score 0.09840425531914894 - nodes in this community are weakly interconnected._
- **Should `server/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._