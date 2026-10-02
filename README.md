# Boilerplate

React (Vite) + Node.js (Express) + MongoDB, TypeScript everywhere.
Read [CLAUDE.md](CLAUDE.md) for the rules and [docs/BOILERPLATE_PLAN.md](docs/BOILERPLATE_PLAN.md) for the plan.

## Server

Requires Node.js 20.19 or newer.

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
| `SEED_ADMIN_NAME` | for `seed:admin` | | Name of the first admin |
| `SEED_ADMIN_EMAIL` | for `seed:admin` | | Email of the first admin |
| `SEED_ADMIN_PASSWORD` | for `seed:admin` | | Password of the first admin |

The server refuses to start and lists the problem if a variable is missing or invalid.

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
