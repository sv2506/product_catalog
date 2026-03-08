from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import get_db
from models.schemas import ProjectCreate, ProjectItemAdd, ProjectOut
from services.project_service import (
    create_project,
    list_projects,
    get_project,
    add_item_to_project,
    remove_item_from_project,
    submit_project,
)

router = APIRouter(prefix="/projects", tags=["Projects"])


@router.get("", response_model=list[ProjectOut])
def list_all(db: Session = Depends(get_db)):
    return list_projects(db)


@router.post("", response_model=ProjectOut, status_code=201)
def create(body: ProjectCreate, db: Session = Depends(get_db)):
    project = create_project(db, body.name, body.requester_name, body.requester_email)
    return project


@router.get("/{project_id}", response_model=ProjectOut)
def get(project_id: int, db: Session = Depends(get_db)):
    project = get_project(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.post("/{project_id}/items", status_code=201)
def add_item(project_id: int, body: ProjectItemAdd, db: Session = Depends(get_db)):
    try:
        item = add_item_to_project(db, project_id, body.product_id)
        return {"message": "Product added", "item_id": item.id}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{project_id}/items/{product_id}", status_code=200)
def remove_item(project_id: int, product_id: int, db: Session = Depends(get_db)):
    try:
        remove_item_from_project(db, project_id, product_id)
        return {"message": "Product removed"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/{project_id}/submit", response_model=ProjectOut)
def submit(project_id: int, db: Session = Depends(get_db)):
    try:
        project = submit_project(db, project_id)
        return project
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
