# CLAUDE.md

Instructions for Claude Code. Read this fully before writing code. If a request conflicts with a rule here, say so and ask before deviating.

**Stack:** React (Vite) + Node.js (Express) + MongoDB, TypeScript everywhere.
**The owner reads every line you write.** So the code must be simple, obvious and boring. Clever code is a bug.

---

## 1. Golden rules

1. **Keep it simple.** Do not add layers, patterns, packages or abstractions that are not needed right now. If a simpler version works, use it.
2. **Small files.** Maximum 200 lines per file, 40 lines per function. When you get close, split by responsibility.
3. **One file, one job.** The file name must say what it does.
4. **No duplicated code.** If you write the same logic twice, move it into `lib/` (server) or `lib/` / `hooks/` (client) and reuse it.
5. **No hardcoded values.** Numbers, routes, statuses, roles, limits and keys come from `constants/`.
6. **No hardcoded text.** User-visible text comes from `locales/*.json`. The API sends error codes, not sentences.
7. **No `any`.** No `@ts-ignore`. No `as` casts to silence errors.
8. **Every change ships with a test.**
9. **Plan first.** For anything bigger than a small fix, list the files you will create or change, then wait for approval.
10. **Do not touch what was not asked.** No unrelated refactors in the same change.

---

## 2. Server structure

```
server/src/
├── server.ts        start the app, graceful shutdown
├── app.ts           build the Express app: middleware, routes, docs
├── config/          env.ts reads and validates .env (the ONLY place that reads process.env)
├── constants/       all fixed values
├── modules/<name>/  one folder per feature
├── database/        mongo/, memory/, index.ts (chooses by DB_DRIVER)
├── middleware/      errorHandler, validate, auth, rateLimit, requestId
├── monitoring/      health, metrics, sentry
├── docs/            swagger setup
├── locales/         server-side text
└── lib/             logger, AppError, response helpers, pagination
```

### Every feature module has the same files

```
modules/users/
├── users.routes.ts        URL + middleware + which controller function
├── users.controller.ts    read the request, call the service, send the response
├── users.service.ts       business logic. NO Express, NO Mongoose here.
├── users.repository.ts    TypeScript interface only (the list of DB functions the service needs)
├── users.schema.ts        zod schemas for input and output, plus inferred types
├── users.docs.ts          Swagger description of the endpoints
└── users.service.test.ts  tests using the in-memory repository
```

### What each file may and may not do

| File | Allowed | Not allowed |
|---|---|---|
| routes | wire URL → middleware → controller | logic of any kind |
| controller | parse request, call service, send response (max ~15 lines per handler) | business rules, DB calls |
| service | business rules, call repository | import `express`, `mongoose`, or read `process.env` |
| repository (interface) | method signatures | implementation |
| `database/mongo/*` | Mongoose queries | business rules |

**Why:** the service only knows the repository interface. That is what lets us swap MongoDB for another database by writing a new folder in `database/` and changing `DB_DRIVER`.

### Service example (the standard shape)

```ts
// users.service.ts
export const createUserService = (repo: UsersRepository) => ({
  async create(input: CreateUserInput) {
    const existing = await repo.findByEmail(input.email);
    if (existing) throw new AppError(ERROR_CODES.EMAIL_TAKEN);
    return repo.create(input);
  },
});
```

### Controller example (always this thin)

```ts
export const createUser = async (req: Request, res: Response) => {
  const user = await usersService.create(req.body);
  sendCreated(res, user);
};
```

---

## 3. Constants (`server/src/constants/`)

```
app.ts       APP_NAME, DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES
http.ts      HTTP_STATUS
routes.ts    API_ROUTES
limits.ts    PAGINATION, RATE_LIMIT, PASSWORD_MIN_LENGTH, BODY_SIZE_LIMIT
time.ts      TOKEN_EXPIRY, CACHE_TTL
errors.ts    ERROR_CODES and the HTTP status for each code
roles.ts     ROLES and permissions
database.ts  COLLECTION_NAMES
index.ts     re-exports everything
```

Rules:
- Use `as const` objects and derive types from them.
- Never write a number other than 0, 1 or -1 inline. Never write a route string, status code, role name or collection name inline.
- Same in every environment → `constants/`. Different per environment (URLs, secrets, ports) → `.env`, validated in `config/env.ts`, documented in `.env.example`.
- When you add a new env variable: add it to `env.ts` (with validation), `.env.example`, and the README.

---

## 4. API rules

**Success response:** `{ "data": ..., "meta": { ... } }` (meta only for lists)
**Error response:** `{ "error": { "code": "EMAIL_TAKEN" }, "requestId": "..." }`

- Always use the response helpers in `lib/response.ts`. Never build the JSON by hand in a controller.
- Throw `new AppError(ERROR_CODES.X)` for expected failures. The global `errorHandler` converts it to the response above.
- Never return a raw database document. Map it to the output schema (no `_id`/`__v` leaks, no password hash).
- Never send stack traces or database error text to the client. Log them with the `requestId` instead.
- Every endpoint is validated with the `validate` middleware using its zod schema.
- Every endpoint is described in `<module>.docs.ts` so it appears in Swagger at `/docs`. **A new endpoint without Swagger docs is unfinished.**
- URLs are versioned under `/api/v1`.

---

## 5. Performance rules

- **Every list endpoint is paginated.** Use the pagination helper. Limit defaults and maximums come from `PAGINATION` in constants. There is no "get everything" repository method.
- Fetch only the fields you need (projection / `select`).
- No database call inside a loop. Fetch many at once.
- Add a database index for every field you filter or sort by, next to the Mongo model.
- Use `lean()` for read-only Mongoose queries.
- Compression is on; do not remove it.
- Do not add caching until a measured problem exists. When you do, ask first.
- Slow work (email, reports) must not block a request. Ask before adding a queue; until then, keep it simple.

---

## 6. Security rules

- Read env only through `config/env.ts`.
- Hash passwords with argon2. Never log passwords, tokens or cookies (the logger already redacts them; do not bypass it).
- Protected routes use the `auth` middleware; role checks use `ROLES` from constants.
- Rate limiting, helmet and CORS allow-list stay enabled. Do not loosen them to "make something work" — ask.
- Never commit `.env`. Only `.env.example`.

---

## 7. Monitoring rules

- Logs use the shared `logger` (never `console.log`). Include context as fields, not string concatenation.
- `/health` = process is alive. `/ready` = database connected. `/metrics` = Prometheus metrics. Keep all three working.
- Errors are reported to Sentry when `SENTRY_DSN` is set; the app must run fine without it.

---

## 8. Testing rules

- Tools: `vitest`, `supertest` (server), Testing Library (client).
- **Service tests** use the in-memory repository from `database/memory/`. They need no database and must run in milliseconds.
- **Endpoint tests** use `supertest` against `createApp()` with the memory repository: check success, validation error, and permission error for each endpoint.
- Test names say what happens: `rejects a second user with the same email`.
- Assert on error **codes**, never on message text.
- Fixing a bug starts with a failing test that shows the bug.
- Run before saying you are done: `npm run lint && npm run typecheck && npm test && npm run build`.

---

## 9. Client structure

```
client/src/
├── main.tsx
├── app/          router and providers
├── constants/    ROUTES, STORAGE_KEYS, QUERY_KEYS, LIMITS
├── locales/      en.json, hi.json
├── components/   small reusable UI pieces, no business logic
├── features/<name>/   components, hooks and api calls for one feature
├── pages/        one thin file per screen
├── hooks/        shared hooks
└── lib/          apiClient (axios), queryClient, formatters
```

Rules:
- **No readable text in components.** Use `t('users.title')`. Add the key to **every** locale file in the same change.
- **No raw `fetch`/`axios` in components.** API calls live in `features/<name>/<name>.api.ts`; components use hooks built on TanStack Query.
- **One component per file**, max 150 lines. If it grows, split into smaller components or move logic into a hook.
- Page files only compose feature components; they contain no logic.
- Route paths come from `constants/routes.ts`; never type a path string in a `<Link>` or `navigate()`.
- Show loading, error and empty states for every data screen.
- Dates, numbers and currency go through `lib/formatters.ts`.
- Use logical CSS (`ms-`, `me-`, `ps-`, `pe-` in Tailwind) so right-to-left languages work later.

---

## 10. Language and naming

- Files: `kebab-case` or `name.type.ts` (`users.service.ts`). React components: `PascalCase.tsx`. Variables/functions: `camelCase`. Constants: `SCREAMING_SNAKE_CASE`.
- Named exports only (no default exports), except where a tool requires one.
- Use `async/await`, never `.then()` chains.
- Comments explain **why**, never **what**. Delete commented-out code.
- Locale keys: `feature.screen.element`, for example `users.list.emptyTitle`.

---

## 11. How to add a new feature

1. Add what it needs to `constants/` (routes, error codes, limits) and `locales/`.
2. Copy the `users` module folder, rename everything.
3. Write the zod schema and the repository interface.
4. Write the service and its tests first.
5. Add the in-memory repository, then the Mongo repository.
6. Write the controller, routes and `.docs.ts`; register the routes in `app.ts`.
7. Client: add `features/<name>/` with api file, hooks, components, then the page and route.
8. Run the full check (section 8).

If you find yourself doing this a lot, tell the owner. Then we can decide whether a generator is worth it.

---

## 12. Swapping parts (why the structure exists)

- **New database:** add `database/<name>/` that implements every repository interface, register it in `database/index.ts`, set `DB_DRIVER`. Do **not** edit services. If you feel you must, the repository interface is leaking Mongo details — fix the interface.
- **Moving the API to Next.js:** reuse services, repositories and zod schemas; rewrite only routes and controllers.

---

## 13. CI/CD (do not break)

- `.github/workflows/ci.yml` runs on every pull request: install → lint → typecheck → test → build (server and client).
- `.github/workflows/deploy.yml` runs on merge to `main`: build Docker images → push → deploy.
- If a pipeline step fails, fix the cause. Never remove or weaken a step to get green.
- Commits use conventional format: `feat(users): add delete endpoint`, `fix(auth): ...`, `chore: ...`.

---

## 14. Never do this

- Import `express` or `mongoose` inside a service
- Read `process.env` outside `config/env.ts`
- Put a number, route, role, status or English sentence directly in code
- Create a file over 200 lines
- Copy and paste a block instead of reusing it
- Return raw database documents
- Write a list endpoint without pagination
- Use `console.log`, `any`, `@ts-ignore`
- Leave an empty `catch` block
- Add a new dependency without telling the owner why
- Add a feature without a test and a Swagger entry
- Edit lint rules to get a build passing

---

## 15. Before you say "done"

- [ ] `npm run lint && npm run typecheck && npm test && npm run build` pass
- [ ] No file over 200 lines
- [ ] New constants are in `constants/`; new text is in **all** locale files
- [ ] Endpoint validated, documented in Swagger, and tested
- [ ] List endpoints paginated
- [ ] `.env.example` and README updated if configuration changed

---

## 16. How to work with the owner

- For anything non-trivial: short plan first (which files, in what order), then wait for a go-ahead.
- Work in small steps; after each step say what changed and how to check it.
- If something in this file makes the code worse in a specific case, say so and propose the change instead of quietly breaking the rule.
- If you notice an existing violation of these rules, point it out; do not silently fix it inside an unrelated change.
- Keep explanations short and plain. Show the result, not a speech.
