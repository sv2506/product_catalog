from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from models.product import Product


def get_all_products(
    db: Session,
    category: str | None = None,
    form: str | None = None,
    process: str | None = None,
    certification: str | None = None,
    q: str | None = None,
    skip: int = 0,
    limit: int = 50,
) -> list[Product]:
    query = db.query(Product)

    if category:
        query = query.filter(Product.category.ilike(f"%{category}%"))

    if form:
        query = query.filter(func.json_extract(Product.details, "$.form").ilike(f"%{form}%"))

    if process:
        query = query.filter(func.json_extract(Product.details, "$.process").ilike(f"%{process}%"))

    if certification:
        query = query.filter(Product.certifications.ilike(f"%{certification}%"))

    if q:
        search = f"%{q}%"
        query = query.filter(
            or_(
                Product.listing.ilike(search),
                Product.category.ilike(search),
                Product.notes.ilike(search),
                Product.suggested_use.ilike(search),
                Product.sourcing.ilike(search),
            )
        )

    return query.offset(skip).limit(limit).all()


def get_product_by_id(db: Session, product_id: int) -> Product | None:
    return db.query(Product).filter(Product.id == product_id).first()
