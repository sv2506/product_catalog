from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from db.database import get_db
from models.schemas import ProductOut
from services.product_service import get_all_products, get_product_by_id

router = APIRouter(prefix="/products", tags=["Products"])


@router.get("", response_model=list[ProductOut])
def list_products(
    category: str | None = Query(None),
    form: str | None = Query(None),
    process: str | None = Query(None),
    certification: str | None = Query(None),
    q: str | None = Query(None, description="Search across listing, category, notes, etc."),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
):
    return get_all_products(
        db, category=category, form=form, process=process,
        certification=certification, q=q, skip=skip, limit=limit,
    )


@router.get("/{product_id}", response_model=ProductOut)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = get_product_by_id(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product
