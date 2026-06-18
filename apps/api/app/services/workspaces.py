from slugify import slugify
from sqlalchemy import Select, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.auth.clerk import Principal
from app.models.workspace import User, Workspace, WorkspaceMembership, WorkspaceRole


async def upsert_user(session: AsyncSession, principal: Principal) -> User:
    user = await session.scalar(select(User).where(User.clerk_user_id == principal.subject))
    if user is not None:
        if user.email != principal.email:
            user.email = principal.email
        return user

    user = User(clerk_user_id=principal.subject, email=principal.email)
    session.add(user)
    await session.flush()
    return user


async def create_workspace(session: AsyncSession, principal: Principal, name: str) -> WorkspaceMembership:
    user = await upsert_user(session, principal)
    base_slug = slugify(name)
    slug = base_slug
    suffix = 2
    while await session.scalar(select(Workspace.id).where(Workspace.slug == slug)):
        slug = f"{base_slug}-{suffix}"
        suffix += 1

    workspace = Workspace(name=name, slug=slug)
    membership = WorkspaceMembership(workspace=workspace, user=user, role=WorkspaceRole.owner)
    session.add_all([workspace, membership])
    await session.commit()
    return membership


async def list_workspaces(session: AsyncSession, principal: Principal) -> list[WorkspaceMembership]:
    user = await upsert_user(session, principal)
    await session.commit()
    statement: Select[tuple[WorkspaceMembership]] = (
        select(WorkspaceMembership)
        .options(selectinload(WorkspaceMembership.workspace))
        .where(WorkspaceMembership.user_id == user.id)
        .order_by(WorkspaceMembership.created_at.desc())
    )
    return list((await session.scalars(statement)).all())
