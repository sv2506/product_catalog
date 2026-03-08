from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db.database import engine, Base
from routers import health, ingest, products, projects, test, reset

# Create all tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Product Catalog API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(ingest.router)
app.include_router(products.router)
app.include_router(projects.router)
app.include_router(test.router)
app.include_router(reset.router)
