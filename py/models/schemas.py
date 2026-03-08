from pydantic import BaseModel, EmailStr
from datetime import datetime


# --- Product Schemas ---

class ProductDetails(BaseModel):
    form: str
    size: str | None = None
    process: str
    variety: str | None = None


class ProductOut(BaseModel):
    id: int
    item_id: str
    listing: str
    category: str
    details: dict
    certifications: str
    sourcing: str
    pricing: str
    availability: str
    technical: str
    suggested_use: str
    notes: str

    class Config:
        from_attributes = True


# --- Project Schemas ---

class ProjectCreate(BaseModel):
    name: str
    requester_name: str
    requester_email: EmailStr


class ProjectItemAdd(BaseModel):
    product_id: int


class ProjectItemOut(BaseModel):
    id: int
    product_id: int
    added_at: datetime

    class Config:
        from_attributes = True


class ProjectOut(BaseModel):
    id: int
    name: str
    requester_name: str
    requester_email: str
    status: str
    created_at: datetime
    submitted_at: datetime | None
    items: list[ProjectItemOut] = []

    class Config:
        from_attributes = True
