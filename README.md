# Boilerplate

React (Vite) + Node.js (Express) + MongoDB, TypeScript everywhere.
Read [CLAUDE.md](CLAUDE.md) for the rules and [docs/BOILERPLATE_PLAN.md](docs/BOILERPLATE_PLAN.md) for the plan.

## Setup

Use Node.js 24 (see `.nvmrc`; run `nvm use`). The client needs at least 22.12, the server at least 20.19.

```bash
npm install
```

This installs the git hook: every commit runs Prettier and ESLint on the staged server and client files.

## Server

```bash
cd server
npm install
cp .env.example .env
```

Set `JWT_ACCESS_SECRET` in `.env` (for example the output of `openssl rand -base64 48`), then:

```bash
npm run dev
```

| URL | What it is |
|---|---|
| http://localhost:4000/health | Process is alive |
| http://localhost:4000/ready | Database is reachable (503 if not) |
| http://localhost:4000/metrics | Prometheus metrics |
| http://localhost:4000/docs | Swagger UI |
| http://localhost:4000/docs/openapi.json | OpenAPI document |
| http://localhost:4000/api/v1/auth | Register, login, refresh, logout, me |
| http://localhost:4000/api/v1/users | Users API (admin only) |

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start with auto-reload (reads `.env`) |
| `npm run build` | Compile to `dist/` |
| `npm start` | Run the compiled server |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript, no output |
| `npm test` | Unit, endpoint and repository tests (no database to install) |
| `npm run seed:admin` | Create or promote the admin from the `SEED_ADMIN_*` variables |
| `npm run format` | Prettier |

### Environment variables

| Name | Required | Default | Meaning |
|---|---|---|---|
| `PORT` | yes | | Port the server listens on |
| `CORS_ORIGINS` | yes | | Comma-separated list of allowed browser origins |
| `NODE_ENV` | no | `development` | `development`, `test` or `production` |
| `LOG_LEVEL` | no | `info` | `fatal`, `error`, `warn`, `info`, `debug`, `trace` or `silent` |
| `JWT_ACCESS_SECRET` | yes | | Signs access tokens. At least 32 random characters |
| `DB_DRIVER` | no | `memory` | `memory` or `mongo` |
| `MONGO_URI` | when `DB_DRIVER=mongo` | | MongoDB connection string |
| `TRUST_PROXY` | no | `0` | Number of proxies in front of the app (set to `1` behind one load balancer so rate limits see the real client IP) |
| `METRICS_TOKEN` | no | | When set, `/metrics` needs `Authorization: Bearer <token>`. At least 24 characters |
| `SENTRY_DSN` | no | | Send unexpected errors to Sentry. Off when empty |
| `SEED_ADMIN_NAME` | for `seed:admin` | | Name of the first admin |
| `SEED_ADMIN_EMAIL` | for `seed:admin` | | Email of the first admin |
| `SEED_ADMIN_PASSWORD` | for `seed:admin` | | Password of the first admin |

The server refuses to start and lists the problem if a variable is missing or invalid.
An optional variable left blank (`NAME=`) counts as not set.

### Data storage

`DB_DRIVER=memory` keeps data in memory, so it is lost on restart. Use it for quick local runs.
`DB_DRIVER=mongo` uses MongoDB at `MONGO_URI`.

The repository tests run against both drivers. The Mongo run uses `mongodb-memory-server`,
which downloads a `mongod` binary (about 100 MB) the first time `npm test` runs.

### Auth

- `POST /api/v1/auth/register` always creates a `user`. Admins are created with `npm run seed:admin`
  or by another admin through `POST /api/v1/users`.
- Access tokens last 15 minutes and go in the `Authorization: Bearer <token>` header.
- Refresh tokens last 7 days, work once, and are replaced on every `/auth/refresh`.
  `/auth/logout` revokes one.
- Login, register and refresh allow 10 requests per 15 minutes per IP. Other API routes allow 300.
  The numbers live in `server/src/constants/`.

## Client

```bash
cd client
npm install
npm run dev
```

Open http://localhost:5173. The dev server forwards `/api` to the API on http://localhost:4000
(set `API_PROXY_TARGET` to change it), so start the server first.

- Log in with the admin from `npm run seed:admin` to see the users list. Other users see their profile.
- All text lives in `client/src/locales/en.json`. Components call `t('feature.screen.element')`.
- API calls live in `features/<name>/<name>.api.ts`; components use the TanStack Query hooks next to them.
- The access token stays in memory. The refresh token is kept in `localStorage` so a reload keeps you logged in.

| Command | What it does |
|---|---|
| `npm run dev` | Start Vite with hot reload |
| `npm run build` | Build to `dist/` |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript, no output |
| `npm test` | Component and hook tests (API faked with MSW) |

## Monitoring

- **Metrics:** `/metrics` serves Prometheus metrics: Node process stats and
  `http_request_duration_seconds` labelled by method, route pattern (for example `/api/v1/users/:id`) and status.
  Set `METRICS_TOKEN` in production so the numbers are not public.
- **Errors:** set `SENTRY_DSN` to send unexpected (500) errors to Sentry, tagged with the request id.
  Headers, cookies, bodies, query strings and local variables are never sent.
- **Uptime:** create a free [UptimeRobot](https://uptimerobot.com) HTTP monitor for
  `https://<your-domain>/health` with an alert contact. No code is needed.

## Docker

Install Docker Desktop, then from the repo root:

```bash
cp server/.env.example server/.env   # set JWT_ACCESS_SECRET
docker compose up --build
```

This runs the app on http://localhost:8080 (nginx serving the client and forwarding `/api`),
the API on http://localhost:4000 and MongoDB. Mongo data lives in the `mongo-data` volume.
Compose sets `DB_DRIVER=mongo`, `MONGO_URI` and `TRUST_PROXY` for you.
To create the admin: `docker compose exec server node dist/scripts/seed-admin.js` with the `SEED_ADMIN_*` values in `server/.env`.

## CI/CD

- `.github/workflows/ci.yml` runs on every pull request: lint, typecheck, test and build for the server
  and the client, and a Docker image build for each.
- `.github/workflows/deploy.yml` runs on every push to `main`. It runs the same checks, pushes
  `ghcr.io/aimatorsofficial/boilerplate-server` and `-client` tagged `sha-<commit>` and `latest`, then deploys over SSH.

### One-time server setup

1. On the server, install Docker and create the folder `~/boilerplate` (or set the repo variable `DEPLOY_PATH`).
2. Put a `.env` in that folder with the server variables plus `MONGO_ROOT_USERNAME`, `MONGO_ROOT_PASSWORD`
   and `MONGO_URI=mongodb://<user>:<password>@mongo:27017/boilerplate?authSource=admin`.
3. Put a reverse proxy with TLS (Caddy or nginx) in front of `127.0.0.1:8080`. The client container forwards
   `/api` to the server, which is not published. The production compose file sets `TRUST_PROXY=2` for these two proxies.
4. Add these repository secrets in GitHub:

| Secret | Value |
|---|---|
| `DEPLOY_HOST` | Server hostname or IP |
| `DEPLOY_USER` | SSH user that can run Docker |
| `DEPLOY_SSH_KEY` | Private key for that user |
| `DEPLOY_KNOWN_HOSTS` | Output of `ssh-keyscan <host>`, so the server's identity is checked |

Until `DEPLOY_HOST` is set, the deploy job only builds and pushes the image.
To roll back, run `IMAGE_TAG=sha-<older-commit> docker compose up -d` in the server folder.
