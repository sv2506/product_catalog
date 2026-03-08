# Product Catalog — Ingredient Catalog & Sample Request Platform

## Overview

A full-stack application with a **FastAPI** backend and **React (Vite)** frontend for browsing an ingredient product catalog and managing sample request projects.

## Quick Start

### Backend

```bash
cd py
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Server runs at `http://localhost:8000`. API docs at `http://localhost:8000/docs`.

### Frontend

```bash
cd client
npm install
npm run dev
```

App runs at `http://localhost:5173`.

**Frontend Pages:**

- **Home** — Seed product data or reset the database
- **Products** — Browse, search by name, and filter by category/form/process/certification
- **Projects** — Create sample request projects, add/remove products, and submit
- **Demo** — Run the full end-to-end workflow with one click

### One-Click Demo

```bash
curl -X POST http://localhost:8000/test/demo | python3 -m json.tool
```

This seeds data, searches, filters, creates a project, adds items, and submits it — all in one request.

## API Endpoints

| Method | Path                                | Description                        |
| ------ | ----------------------------------- | ---------------------------------- |
| GET    | `/health_check`                     | Health check                       |
| POST   | `/ingest`                           | Seed product data from JSON        |
| POST   | `/reset`                            | Clear all tables and reset DB      |
| GET    | `/products`                         | List/search/filter products        |
| GET    | `/products/{id}`                    | Get single product                 |
| GET    | `/projects`                         | List all projects                  |
| POST   | `/projects`                         | Create a sample request project    |
| GET    | `/projects/{id}`                    | Get project with items             |
| POST   | `/projects/{id}/items`              | Add product to project             |
| DELETE | `/projects/{id}/items/{product_id}` | Remove product from project        |
| POST   | `/projects/{id}/submit`             | Submit project (draft → submitted) |
| POST   | `/test/demo`                        | Run full end-to-end demo           |

### Query Parameters for `GET /products`

- `q` — full-text search across listing, category, notes, sourcing, suggested_use
- `category` — filter by category
- `form` — filter by detail form (via JSON extract)
- `process` — filter by process type (via JSON extract)
- `certification` — filter by certification (LIKE match)
- `skip`, `limit` — pagination

## Data Model

**3 tables:**

- **Product** — item_id, listing, category, details (JSON), certifications, sourcing, pricing, availability, technical, suggested_use, notes
- **Project** — name, requester info, status (enum - draft/submitted), timestamps
- **ProjectItem** — join table linking projects to products

### Indexes

- **Product** — `listing`, `category`, `certifications` (search and filter queries)
- **Project** — `requester_email`, `status`, `created_at` (lookup and sorting)
- **ProjectItem** — `project_id`, `product_id` (FK joins and lookups)

### Key Design Decisions

- **SQLite** — zero-config, single-file DB. Swap to Postgres via the connection string, if needed.
- **`details` as JSON column** — the nested object has variable fields (size, variety are optional). JSON allows for this flexibility.
- **Certifications as string** — for 10 products, `LIKE` filtering is pragmatic vs. a normalized many-to-many.
- **ProjectItem as a table** — unlike certs, project items have add/remove operations and per-item metadata. A join table is the right fit.

### What I'd Do With More Time

- Normalize certifications into a proper many-to-many for larger datasets
- Add pagination metadata (total count, next/prev links)
- Structured parsing of `pricing` and `technical` fields into sub-fields
- Authentication and authorization
- Comprehensive test suite (pytest)
- Docker Compose for one-command setup
