from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.clerk import Principal, get_principal
from app.db.session import get_session
from app.schemas.workspace import WorkspaceCreate, WorkspaceRead
from app.services.workspaces import create_workspace, list_workspaces

router = APIRouter(prefix="/workspaces", tags=["workspaces"])


@router.get("", response_model=list[WorkspaceRead])
async def index(
    principal: Principal = Depends(get_principal),
    session: AsyncSession = Depends(get_session),
) -> list[WorkspaceRead]:
    memberships = await list_workspaces(session, principal)
    return [
        WorkspaceRead(
            id=membership.workspace.id,
            name=membership.workspace.name,
            slug=membership.workspace.slug,
            role=membership.role,
        )
        for membership in memberships
    ]


@router.post("", response_model=WorkspaceRead, status_code=status.HTTP_201_CREATED)
async def create(
    payload: WorkspaceCreate,
    principal: Principal = Depends(get_principal),
    session: AsyncSession = Depends(get_session),
) -> WorkspaceRead:
    membership = await create_workspace(session, principal, payload.name)
    return WorkspaceRead(
        id=membership.workspace.id,
        name=membership.workspace.name,
        slug=membership.workspace.slug,
        role=membership.role,
    )
