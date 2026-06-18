import pytest
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

from app.auth.clerk import Principal
from app.db.base import Base
from app.services.workspaces import create_workspace, list_workspaces


@pytest.fixture
async def session_factory() -> async_sessionmaker:
    engine = create_async_engine("sqlite+aiosqlite:///:memory:")
    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)
    return async_sessionmaker(engine, expire_on_commit=False)


async def test_create_workspace_assigns_owner_role(session_factory: async_sessionmaker) -> None:
    async with session_factory() as session:
        membership = await create_workspace(
            session,
            Principal(subject="user_123", email="engineer@promptverse.ai"),
            "Research Systems",
        )

    assert membership.role.value == "owner"
    assert membership.workspace.slug == "research-systems"


async def test_workspace_slugs_are_unique(session_factory: async_sessionmaker) -> None:
    principal = Principal(subject="user_123", email="engineer@promptverse.ai")
    async with session_factory() as session:
        first = await create_workspace(session, principal, "Agent Lab")
        second = await create_workspace(session, principal, "Agent Lab")

    assert first.workspace.slug == "agent-lab"
    assert second.workspace.slug == "agent-lab-2"


async def test_list_workspaces_is_scoped_to_principal(session_factory: async_sessionmaker) -> None:
    async with session_factory() as session:
        await create_workspace(session, Principal(subject="user_a", email=None), "Alpha")
        await create_workspace(session, Principal(subject="user_b", email=None), "Beta")
        memberships = await list_workspaces(session, Principal(subject="user_a", email=None))

    assert [membership.workspace.name for membership in memberships] == ["Alpha"]
