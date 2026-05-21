from datetime import date, datetime

from pydantic import BaseModel, field_validator

from .team_member import TeamMemberCreate, TeamMemberResponse
from .milestone import MilestoneCreate, MilestoneResponse


class ProjectCreate(BaseModel):
    title: str
    description: str | None = None
    client: str | None = None
    start_date: date
    end_date: date | None = None
    team_members: list[TeamMemberCreate]
    milestones: list[MilestoneCreate]

    @field_validator("title")
    @classmethod
    def title_required(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Title is required")
        return v.strip()

    @field_validator("team_members")
    @classmethod
    def at_least_one_member(cls, v: list) -> list:
        if not v:
            raise ValueError("At least one team member is required")
        return v

    @field_validator("milestones")
    @classmethod
    def at_least_one_milestone(cls, v: list) -> list:
        if not v:
            raise ValueError("At least one milestone is required")
        return v


class ProjectUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    client: str | None = None
    start_date: date | None = None
    end_date: date | None = None


class ProjectResponse(BaseModel):
    id: str
    title: str
    description: str | None
    client: str | None
    start_date: date
    end_date: date | None
    owner_id: str
    created_at: datetime
    updated_at: datetime
    team_members: list[TeamMemberResponse] = []
    milestones: list[MilestoneResponse] = []

    class Config:
        from_attributes = True
