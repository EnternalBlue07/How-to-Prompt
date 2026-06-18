import structlog
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.workspaces import router as workspaces_router
from app.core.config import get_settings

logger = structlog.get_logger()


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(title=settings.app_name, version="0.1.0")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.include_router(workspaces_router, prefix="/v1")

    @app.get("/healthz")
    async def healthz() -> dict[str, str]:
        logger.info("health_check")
        return {"status": "ok"}

    return app


app = create_app()
