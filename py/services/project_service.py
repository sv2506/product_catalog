from sqlalchemy.orm import Session
from datetime import datetime, timezone
from models.project import Project, ProjectItem
from models.product import Product


def create_project(db: Session, name: str, requester_name: str, requester_email: str) -> Project:
    project = Project(name=name, requester_name=requester_name, requester_email=requester_email)
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


def list_projects(db: Session) -> list[Project]:
    return db.query(Project).order_by(Project.created_at.desc()).all()


def get_project(db: Session, project_id: int) -> Project | None:
    return db.query(Project).filter(Project.id == project_id).first()


def add_item_to_project(db: Session, project_id: int, product_id: int) -> ProjectItem:
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise ValueError("Project not found")
    if project.status != "draft":
        raise ValueError("Cannot modify a submitted project")

    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise ValueError("Product not found")

    existing = (
        db.query(ProjectItem)
        .filter(ProjectItem.project_id == project_id, ProjectItem.product_id == product_id)
        .first()
    )
    if existing:
        raise ValueError("Product already in project")

    item = ProjectItem(project_id=project_id, product_id=product_id)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def remove_item_from_project(db: Session, project_id: int, product_id: int) -> None:
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise ValueError("Project not found")
    if project.status != "draft":
        raise ValueError("Cannot modify a submitted project")

    item = (
        db.query(ProjectItem)
        .filter(ProjectItem.project_id == project_id, ProjectItem.product_id == product_id)
        .first()
    )
    if not item:
        raise ValueError("Product not in project")

    db.delete(item)
    db.commit()


def submit_project(db: Session, project_id: int) -> Project:
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise ValueError("Project not found")
    if project.status != "draft":
        raise ValueError("Project already submitted")
    if not project.items:
        raise ValueError("Cannot submit an empty project")

    project.status = "submitted"
    project.submitted_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(project)
    return project
