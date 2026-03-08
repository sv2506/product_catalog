import json
from pathlib import Path
from sqlalchemy.orm import Session
from models.product import Product

DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "products.json"


def ingest_products(db: Session) -> list[dict]:
    with open(DATA_PATH, "r") as f:
        raw_products = json.load(f)

    # Clear existing products for idempotent re-seeding
    db.query(Product).delete()
    db.commit()

    created = []
    for item in raw_products:
        product = Product(
            item_id=item["item_id"],
            listing=item["listing"],
            category=item["category"],
            details=item.get("details", {}),
            certifications=item.get("certifications", ""),
            sourcing=item.get("sourcing", ""),
            pricing=item.get("pricing", ""),
            availability=item.get("availability", ""),
            technical=item.get("technical", ""),
            suggested_use=item.get("suggested_use", ""),
            notes=item.get("notes", ""),
        )
        db.add(product)
        created.append(item["item_id"])

    db.commit()
    return created
