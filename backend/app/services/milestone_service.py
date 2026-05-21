from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.milestone import Milestone
from app.schemas.milestone import MilestoneCreate, MilestoneUpdate


async def create_milestone(db: AsyncSession, project_id: UUID, data: MilestoneCreate) -> Milestone:
    milestone = Milestone(
        title=data.title, description=data.description,
        due_date=data.due_date, status=data.status, project_id=project_id,
    )
    db.add(milestone)
    await db.commit()
    await db.refresh(milestone)
    return milestone


async def get_milestones(db: AsyncSession, project_id: UUID) -> list[Milestone]:
    result = await db.execute(
        select(Milestone).where(Milestone.project_id == project_id).order_by(Milestone.created_at)
    )
    return list(result.scalars().all())


async def get_milestone(db: AsyncSession, milestone_id: UUID) -> Milestone | None:
    result = await db.execute(select(Milestone).where(Milestone.id == milestone_id))
    return result.scalar_one_or_none()


async def update_milestone(db: AsyncSession, milestone_id: UUID, data: MilestoneUpdate) -> Milestone | None:
    milestone = await get_milestone(db, milestone_id)
    if not milestone:
        return None
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(milestone, key, value)
    await db.commit()
    await db.refresh(milestone)
    return milestone


async def delete_milestone(db: AsyncSession, milestone_id: UUID) -> bool:
    milestone = await get_milestone(db, milestone_id)
    if not milestone:
        return False
    await db.delete(milestone)
    await db.commit()
    return True
