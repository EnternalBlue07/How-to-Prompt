from uuid import UUID

from pydantic import BaseModel, Field

from app.models.workspace import WorkspaceRole


class WorkspaceCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)


class WorkspaceRead(BaseModel):
    id: UUID
    name: str
    slug: str
    role: WorkspaceRole
