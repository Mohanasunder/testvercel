from datetime import datetime

from pydantic import BaseModel, EmailStr, field_validator


class TeamMemberCreate(BaseModel):
    name: str
    email: EmailStr
    role: str

    @field_validator("name")
    @classmethod
    def name_required(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Name is required")
        return v.strip()

    @field_validator("role")
    @classmethod
    def role_required(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Role is required")
        return v.strip()


class TeamMemberUpdate(BaseModel):
    name: str | None = None
    email: EmailStr | None = None
    role: str | None = None


class TeamMemberResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    project_id: str
    created_at: datetime

    class Config:
        from_attributes = True
