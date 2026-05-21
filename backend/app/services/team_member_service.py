from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.team_member import TeamMember
from app.schemas.team_member import TeamMemberCreate, TeamMemberUpdate


async def create_team_member(db: AsyncSession, project_id: UUID, data: TeamMemberCreate) -> TeamMember:
    member = TeamMember(name=data.name, email=data.email, role=data.role, project_id=project_id)
    db.add(member)
    await db.commit()
    await db.refresh(member)
    return member


async def get_team_members(db: AsyncSession, project_id: UUID) -> list[TeamMember]:
    result = await db.execute(
        select(TeamMember).where(TeamMember.project_id == project_id).order_by(TeamMember.created_at)
    )
    return list(result.scalars().all())


async def get_team_member(db: AsyncSession, member_id: UUID) -> TeamMember | None:
    result = await db.execute(select(TeamMember).where(TeamMember.id == member_id))
    return result.scalar_one_or_none()


async def update_team_member(db: AsyncSession, member_id: UUID, data: TeamMemberUpdate) -> TeamMember | None:
    member = await get_team_member(db, member_id)
    if not member:
        return None
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(member, key, value)
    await db.commit()
    await db.refresh(member)
    return member


async def delete_team_member(db: AsyncSession, member_id: UUID) -> bool:
    member = await get_team_member(db, member_id)
    if not member:
        return False
    await db.delete(member)
    await db.commit()
    return True
