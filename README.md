# Boilerplate

React (Vite) + Node.js (Express) + MongoDB, TypeScript everywhere.
Read [CLAUDE.md](CLAUDE.md) for the rules and [docs/BOILERPLATE_PLAN.md](docs/BOILERPLATE_PLAN.md) for the plan.

## Server

Requires Node.js 20.19 or newer.

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

| URL | What it is |
|---|---|
| http://localhost:4000/health | Process is alive |
| http://localhost:4000/docs | Swagger UI |
| http://localhost:4000/docs/openapi.json | OpenAPI document |
| http://localhost:4000/api/v1/users | Users API |

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start with auto-reload (reads `.env`) |
| `npm run build` | Compile to `dist/` |
| `npm start` | Run the compiled server |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript, no output |
| `npm test` | Unit and endpoint tests (no database needed) |
| `npm run format` | Prettier |

### Environment variables

| Name | Required | Default | Meaning |
|---|---|---|---|
| `PORT` | yes | | Port the server listens on |
| `CORS_ORIGINS` | yes | | Comma-separated list of allowed browser origins |
| `NODE_ENV` | no | `development` | `development`, `test` or `production` |
| `LOG_LEVEL` | no | `info` | `fatal`, `error`, `warn`, `info`, `debug`, `trace` or `silent` |

The server refuses to start and lists the problem if a variable is missing or invalid.

### Data storage

Phase 1 keeps data in memory, so it is lost on restart. MongoDB arrives in Phase 2.
