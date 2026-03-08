from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.database import get_db
from services.ingest import ingest_products
from services.product_service import get_all_products
from services.project_service import create_project, add_item_to_project, submit_project

router = APIRouter(prefix="/test", tags=["Test"])


@router.post("/demo")
def demo(db: Session = Depends(get_db)):
    results = {}

    # Step 1: Seed data
    ingested = ingest_products(db)
    results["step_1_ingest"] = {"message": f"Ingested {len(ingested)} products", "item_ids": ingested}

    # Step 2: Search for "strawberry"
    search_results = get_all_products(db, q="strawberry")
    results["step_2_search_strawberry"] = [
        {"id": p.id, "item_id": p.item_id, "listing": p.listing} for p in search_results
    ]

    # Step 3: Filter by category "Tropical Fruits"
    filter_results = get_all_products(db, category="Tropical Fruits")
    results["step_3_filter_tropical"] = [
        {"id": p.id, "item_id": p.item_id, "listing": p.listing, "category": p.category}
        for p in filter_results
    ]

    # Step 4: Create a project
    project = create_project(
        db,
        name="Q1 Smoothie Launch",
        requester_name="Jane Doe",
        requester_email="jane@example.com",
    )
    results["step_4_create_project"] = {
        "id": project.id,
        "name": project.name,
        "status": project.status,
    }

    # Step 5: Add 3 products to the project
    all_products = get_all_products(db)
    added = []
    for p in all_products[:3]:
        item = add_item_to_project(db, project.id, p.id)
        added.append({"item_id": item.id, "product_id": p.id, "listing": p.listing})
    results["step_5_add_items"] = added

    # Step 6: Submit the project
    submitted = submit_project(db, project.id)
    results["step_6_submit_project"] = {
        "id": submitted.id,
        "name": submitted.name,
        "status": submitted.status,
        "submitted_at": str(submitted.submitted_at),
        "item_count": len(submitted.items),
    }

    return results
