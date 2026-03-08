from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.database import get_db
from services.ingest import ingest_products

router = APIRouter()


@router.post("/ingest")
def ingest(db: Session = Depends(get_db)):
    created_ids = ingest_products(db)
    return {"message": f"Ingested {len(created_ids)} products", "item_ids": created_ids}
