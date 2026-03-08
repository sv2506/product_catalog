from sqlalchemy import Column, Integer, String, JSON
from db.database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    item_id = Column(String, unique=True, nullable=False)
    listing = Column(String, nullable=False, index=True)
    category = Column(String, nullable=False, index=True)
    details = Column(JSON, nullable=False)
    certifications = Column(String, nullable=True, default="", index=True)
    sourcing = Column(String, nullable=True, default="")
    pricing = Column(String, nullable=True, default="")
    availability = Column(String, nullable=True, default="")
    technical = Column(String, nullable=True, default="")
    suggested_use = Column(String, nullable=True, default="")
    notes = Column(String, nullable=True, default="")
