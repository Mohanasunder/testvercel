from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.team_member import TeamMemberCreate, TeamMemberResponse, TeamMemberUpdate
from app.services.team_member_service import (
    create_team_member,
    delete_team_member,
    get_team_members,
    update_team_member,
)
from app.services.project_service import get_project

router = APIRouter(tags=["team-members"])


@router.get("/projects/{project_id}/team-members", response_model=list[TeamMemberResponse])
async def list_members(
    project_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = await get_project(db, project_id, current_user.id)
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    return await get_team_members(db, project_id)


@router.post("/projects/{project_id}/team-members", response_model=TeamMemberResponse, status_code=status.HTTP_201_CREATED)
async def create(
    project_id: UUID,
    data: TeamMemberCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = await get_project(db, project_id, current_user.id)
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    return await create_team_member(db, project_id, data)


@router.put("/projects/{project_id}/team-members/{member_id}", response_model=TeamMemberResponse)
async def update(
    project_id: UUID,
    member_id: UUID,
    data: TeamMemberUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = await get_project(db, project_id, current_user.id)
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    member = await update_team_member(db, member_id, data)
    if not member:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team member not found")
    return member


@router.delete("/projects/{project_id}/team-members/{member_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete(
    project_id: UUID,
    member_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = await get_project(db, project_id, current_user.id)
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    ok = await delete_team_member(db, member_id)
    if not ok:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team member not found")
