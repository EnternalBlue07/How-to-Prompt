# PromptVerse X Architecture

PromptVerse X is organized as a pnpm/turbo monorepo with independently deployable web and API surfaces.

## Applications

- `apps/web`: Next.js 15, React 19, Clerk-authenticated product shell.
- `apps/api`: FastAPI service with PostgreSQL persistence, Clerk JWT validation, RBAC checks, and Alembic migrations.

## Phase 1 Foundation

The repository foundation includes workspace package orchestration, linting, formatting, pre-commit checks, Docker services, GitHub Actions, and backend tests. The first domain slice implements authenticated workspace creation/listing with role-aware membership persistence.

## Runtime Services

- PostgreSQL stores users, workspaces, and memberships.
- Redis is reserved for Celery queues and application cache.
- Qdrant is reserved for vector retrieval.
- Meilisearch is reserved for prompt and marketplace search.
- Clerk issues user identity tokens consumed by both Next.js middleware and the FastAPI API.

## Development

Run infrastructure with:

```bash
docker compose up -d
```

Run the repository with:

```bash
pnpm install
pnpm dev
```
