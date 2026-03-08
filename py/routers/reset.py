from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.database import get_db
from models.product import Product
from models.project import Project, ProjectItem

router = APIRouter()


@router.post("/reset")
def reset_db(db: Session = Depends(get_db)):
    db.query(ProjectItem).delete()
    db.query(Project).delete()
    db.query(Product).delete()
    db.commit()
    return {"message": "All tables cleared"}
