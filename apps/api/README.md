# PromptVerse X Backend API 🐍

The PromptVerse X backend is a high-performance Python FastAPI service managing workspaces, user permissions, database connections, and semantic indexes.

---

## 🛠️ Technology Stack

- **Framework**: FastAPI (Pydantic v2 validation)
- **Database**: PostgreSQL (async pg sessions using SQLAlchemy)
- **Migrations**: Alembic
- **Authentication**: Clerk JWT Token validation (RS256 JWKS validation)
- **Linter & Typecheck**: Ruff, Mypy

---

## ⚙️ Configuration (.env)

Make sure to create `.env` in this directory:
```env
# Clerk Verification Issuers
CLERK_ISSUER=https://your-clerk-instance.clerk.accounts.dev
CLERK_JWKS_URL=https://your-clerk-instance.clerk.accounts.dev/.well-known/jwks.json

# Core Databases
DATABASE_URL=postgresql+asyncpg://promptverse:promptverse_dev_password@localhost:5432/promptverse
```

---

## 🛠️ CLI API Operations

Run these inside `apps/api` (ensure virtualenv is active):

- **Install Dev Dependencies**: `pip install -e ".[dev]"`
- **Start FastAPI Server**: `uvicorn app.main:app --reload --port 8000`
- **Lint Check**: `ruff check .`
- **Typing Check**: `mypy app`
- **Run Tests**: `pytest`
