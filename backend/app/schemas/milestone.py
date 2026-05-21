from datetime import date, datetime

from pydantic import BaseModel, field_validator


class MilestoneCreate(BaseModel):
    title: str
    description: str | None = None
    due_date: date | None = None
    status: str = "pending"

    @field_validator("title")
    @classmethod
    def title_required(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Title is required")
        return v.strip()


class MilestoneUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    due_date: date | None = None
    status: str | None = None


class MilestoneResponse(BaseModel):
    id: str
    title: str
    description: str | None
    due_date: date | None
    status: str
    project_id: str
    created_at: datetime

    class Config:
        from_attributes = True
