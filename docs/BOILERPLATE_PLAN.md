# Boilerplate Plan (Simple Version)

**Stack:** React (Vite) + Node.js (Express) + MongoDB, all in TypeScript.
**Goal:** a starter you can understand in 10 minutes, where you change behaviour by editing constants, and where the database or the HTTP layer can be swapped by touching only a few files.

---

## 1. The whole idea in 4 lines

Every feature on the server is split into the same 4 small files:

```
route  →  controller  →  service  →  repository
(URL)     (req/res)      (business    (database
                          logic)       access)
```

- The **service** holds the logic and never imports Express or Mongoose.
- The **repository** is the only thing that talks to MongoDB.
- Swap MongoDB for Postgres = write a new repository folder. Services, controllers and tests do not change.
- Move to Next.js = rewrite only the thin route/controller files. Services are reused as they are.

That is the entire architecture. No extra layers, no extra packages.

---

## 2. Folder structure

One git repo, two folders. No monorepo tooling.

```
my-app/
├── CLAUDE.md                  ← rules for Claude Code (read automatically)
├── README.md                  ← how to run it
├── docker-compose.yml         ← app + mongo for local use
├── .github/workflows/
│   ├── ci.yml                 ← lint + typecheck + test + build on every PR
│   └── deploy.yml             ← build Docker image + deploy on merge to main
│
├── server/
│   ├── Dockerfile
│   ├── .env.example
│   └── src/
│       ├── server.ts          ← starts the app (listen, graceful shutdown)
│       ├── app.ts             ← builds Express app (middleware + routes)
│       ├── config/            ← env.ts: reads + validates environment variables
│       ├── constants/         ← ALL fixed values (see section 4)
│       ├── modules/           ← one folder per feature
│       │   ├── auth/
│       │   └── users/
│       │       ├── users.routes.ts
│       │       ├── users.controller.ts
│       │       ├── users.service.ts
│       │       ├── users.repository.ts   ← interface only
│       │       ├── users.schema.ts       ← zod validation + types
│       │       ├── users.docs.ts         ← Swagger description
│       │       └── users.service.test.ts
│       ├── database/
│       │   ├── index.ts       ← picks the DB using DB_DRIVER
│       │   ├── mongo/         ← MongoDB implementation
│       │   └── memory/        ← in-memory implementation (used by tests)
│       ├── middleware/        ← errorHandler, validate, auth, rateLimit, requestId
│       ├── monitoring/        ← health.ts, metrics.ts, sentry.ts
│       ├── docs/              ← swagger.ts (builds /docs)
│       ├── locales/           ← en.json, hi.json (server-side text, e.g. emails)
│       └── lib/               ← logger, AppError, response helpers, pagination
│
└── client/
    ├── Dockerfile
    ├── .env.example
    └── src/
        ├── main.tsx
        ├── app/               ← router, providers (query, i18n, theme)
        ├── constants/         ← routes, storage keys, limits, query keys
        ├── locales/           ← en.json, hi.json (all UI text)
        ├── components/        ← small reusable UI pieces (Button, Input, Modal)
        ├── features/          ← one folder per feature
        │   ├── auth/          ← LoginForm, useLogin, auth.api.ts
        │   └── users/
        ├── pages/             ← one file per screen, thin (compose feature pieces)
        ├── hooks/             ← shared hooks
        └── lib/               ← apiClient (axios), queryClient, formatters
```

**Naming rule that keeps it readable:** the file name tells you its job (`users.service.ts`, `users.routes.ts`). You never have to open a file to guess what it is.

---

## 3. What is included on day one

| Area | What you get | Tool |
|---|---|---|
| **API docs (Swagger)** | Interactive docs at `/docs`, generated from the same zod schemas that validate requests, so docs can never go out of date | `swagger-ui-express` + `@asteasolutions/zod-to-openapi` |
| **Health checks** | `/health` (is the app alive) and `/ready` (is MongoDB connected) | built in |
| **Metrics** | `/metrics` in Prometheus format: request counts, latency, memory | `prom-client` |
| **Logging** | JSON logs with a request ID on every line, passwords and tokens automatically hidden | `pino` + `pino-http` |
| **Error tracking** | Crashes and errors sent to a dashboard with stack traces; switched on by setting one env var | Sentry (free tier) |
| **Uptime alerts** | Free external ping of `/health` that messages you on failure | UptimeRobot (setup, no code) |
| **Validation** | Every request body, query and param checked before it reaches your logic | `zod` |
| **Security basics** | Secure headers, CORS allow-list, rate limiting, hashed passwords, body size limit | `helmet`, `cors`, `express-rate-limit`, `argon2` |
| **Auth** | Register, login, refresh, `/me`, role check (user/admin) | JWT |
| **Unit + API tests** | Service tests and endpoint tests that run in seconds with no database needed | `vitest` + `supertest` |
| **Frontend tests** | Component tests | `vitest` + Testing Library |
| **CI** | On every pull request: lint, typecheck, test, build | GitHub Actions |
| **CD** | On merge to `main`: build Docker image, push, deploy to your server | GitHub Actions + Docker |
| **Multi-language** | UI text from locale files, language switcher, English + Hindi to start | `react-i18next` |
| **Code quality** | Lint + format on save and on commit; file/function size limits | ESLint, Prettier, Husky |
| **Docker** | `docker compose up` runs the whole thing locally | Docker |

---

## 4. Constants: where to change things

**Rule:** to change a limit, route, message code, role or setting, you edit one file in `constants/`. You never edit a service or controller for a static change.

```
server/src/constants/
├── app.ts        APP_NAME, DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES
├── http.ts       HTTP_STATUS (OK, CREATED, NOT_FOUND ...)
├── routes.ts     API_ROUTES (/users, /auth/login ...) used by server AND docs
├── limits.ts     PAGINATION, RATE_LIMIT, PASSWORD_MIN_LENGTH, BODY_SIZE_LIMIT
├── time.ts       TOKEN_EXPIRY, CACHE_TTL
├── errors.ts     ERROR_CODES (USER_NOT_FOUND, EMAIL_TAKEN ...) + status for each
├── roles.ts      ROLES (USER, ADMIN) and what each can do
├── database.ts   COLLECTION_NAMES
└── index.ts      re-exports everything: import { HTTP_STATUS } from '../constants'
```

| I want to change… | Edit this file |
|---|---|
| Page size / max page size | `constants/limits.ts` |
| Login token lifetime | `constants/time.ts` |
| An API URL | `constants/routes.ts` |
| Which roles exist | `constants/roles.ts` |
| Supported languages | `constants/app.ts` |
| Any visible text | `locales/en.json` (and the other languages) |
| Database / port / secrets | `.env` (never in code) |

**Constants vs `.env`:** same everywhere (limits, routes) → `constants/`. Different per environment (DB URL, secrets, ports) → `.env`, validated at startup by `config/env.ts`. If something is missing, the app refuses to start and tells you exactly what.

---

## 5. Text and languages

- The **frontend** never contains readable text in components. It uses `t('users.title')` and the text comes from `client/src/locales/*.json`.
- The **API never sends sentences**. It sends a code, for example `{ "error": { "code": "EMAIL_TAKEN" } }`. The frontend translates that code. Adding a language therefore needs no backend change.
- Server-side text (emails, PDFs) comes from `server/src/locales/` with the user's language passed in.
- Dates, numbers and currency use shared formatter helpers in `client/src/lib/formatters.ts`.
- Adding a language = add one JSON file and one entry in `SUPPORTED_LANGUAGES`.

---

## 6. API response shape (same everywhere)

```jsonc
// success
{ "data": { ... }, "meta": { "page": 1, "limit": 20, "total": 134 } }

// error
{ "error": { "code": "EMAIL_TAKEN" }, "requestId": "a1b2c3" }
```

One helper builds success responses and one error handler builds error responses, so no controller formats anything by hand.

---

## 7. How the three swaps work

**MongoDB → Postgres**
1. Create `server/src/database/postgres/` with the same repository functions as `database/mongo/`.
2. Add `'postgres'` to the options in `database/index.ts`.
3. Set `DB_DRIVER=postgres` in `.env`.
4. Run the same repository tests against it.
Services, controllers and routes: untouched.

**Express → Next.js route handlers**
Each Next.js route is about 10 lines: validate input with the existing zod schema, call the existing service, return the result. Services and repositories are reused as they are.

**React → Next.js frontend**
Features, hooks and components move as they are. Only `app/` (router) and `pages/` change.

---

## 8. Deliberately left out (add later, only when needed)

The first version of this plan had many more pieces. Each is useful in the right situation, but together they make a codebase hard to read. Add them when the trigger happens, not before.

| Left out | Add it when… |
|---|---|
| Monorepo with many packages | you have 3+ apps sharing real code |
| Result type instead of exceptions | error handling gets hard to follow |
| Multi-tenancy | your first client needs separate workspaces |
| Redis cache + queue | an endpoint is slow, or you need background jobs (emails, reports) |
| Idempotency keys, webhooks framework | you take payments |
| Audit log | a client asks "who changed this?" |
| OpenTelemetry tracing | you have several services |
| Code generators | you have built the same module 4+ times by hand |
| Playwright end-to-end tests | you have a flow that must never break (signup, checkout) |
| Testcontainers | you have a lot of Mongo-specific queries |

The structure above has a clear place for each of these, so adding them later does not require a rewrite.

---

## 9. Build order

Each phase ends with something that runs, is tested, and is committed. Do not start the next phase until the current one is working.

| Phase | What gets built | Done when | Time |
|---|---|---|---|
| **1. Server base** | Express + TypeScript, `config`, `constants`, logger, error handler, `/health`, one `users` module on the in-memory repository, Swagger at `/docs`, tests | `npm test` is green and `/docs` shows the users endpoints | 6–8 h |
| **2. MongoDB + auth** | Mongo repository, `DB_DRIVER` switch, register/login/refresh/me, roles, rate limit, `/ready` | Same tests pass against memory and Mongo | 5–6 h |
| **3. Monitoring + Docker + CI/CD** | `/metrics`, Sentry hook, Dockerfile, docker-compose, `ci.yml`, `deploy.yml`, Husky | A pull request runs CI; `docker compose up` works | 4–5 h |
| **4. Client base** | Vite + React, router, Tailwind, axios client, TanStack Query, login page, users list, protected routes, tests | You can register, log in and see a list | 6–8 h |
| **5. Languages + polish** | `react-i18next` with English + Hindi, language switcher, README, final cleanup against the checklist | Switching language changes the whole UI | 3–4 h |

**Total: about 25–30 hours.**

---

## 10. Definition of done

- [ ] `docker compose up` starts everything; `/docs`, `/health`, `/metrics` all respond
- [ ] `npm test` passes without a database running
- [ ] Setting `DB_DRIVER=memory` and `DB_DRIVER=mongo` both work
- [ ] A pull request runs lint, typecheck, tests and build automatically
- [ ] No source file over 200 lines
- [ ] Searching components for English text finds nothing outside `locales/`
- [ ] Searching services for a bare number or route string finds nothing outside `constants/`
- [ ] A new feature can be added by copying the `users` module folder and renaming it
