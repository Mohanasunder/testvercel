from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.project import Project
from app.models.team_member import TeamMember
from app.models.milestone import Milestone
from app.schemas.project import ProjectCreate, ProjectUpdate


async def create_project(db: AsyncSession, data: ProjectCreate, owner_id: UUID) -> Project:
    project = Project(
        title=data.title,
        description=data.description,
        client=data.client,
        start_date=data.start_date,
        end_date=data.end_date,
        owner_id=owner_id,
    )
    db.add(project)
    await db.flush()

    for m in data.team_members:
        db.add(TeamMember(name=m.name, email=m.email, role=m.role, project_id=project.id))
    for m in data.milestones:
        db.add(Milestone(title=m.title, description=m.description, due_date=m.due_date, status=m.status, project_id=project.id))

    await db.commit()
    await db.refresh(project)
    return project


async def get_projects(db: AsyncSession, owner_id: UUID) -> list[Project]:
    result = await db.execute(
        select(Project)
        .where(Project.owner_id == owner_id)
        .options(selectinload(Project.team_members), selectinload(Project.milestones))
        .order_by(Project.created_at.desc())
    )
    return list(result.scalars().all())


async def get_project(db: AsyncSession, project_id: UUID, owner_id: UUID) -> Project | None:
    result = await db.execute(
        select(Project)
        .where(Project.id == project_id, Project.owner_id == owner_id)
        .options(selectinload(Project.team_members), selectinload(Project.milestones))
    )
    return result.scalar_one_or_none()


async def update_project(db: AsyncSession, project_id: UUID, data: ProjectUpdate, owner_id: UUID) -> Project | None:
    project = await get_project(db, project_id, owner_id)
    if not project:
        return None
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(project, key, value)
    await db.commit()
    await db.refresh(project)
    return project


async def delete_project(db: AsyncSession, project_id: UUID, owner_id: UUID) -> bool:
    project = await get_project(db, project_id, owner_id)
    if not project:
        return False
    await db.delete(project)
    await db.commit()
    return True
