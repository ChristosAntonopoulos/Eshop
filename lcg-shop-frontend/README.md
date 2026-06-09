# LCG Shop Frontend

React + TypeScript + Vite storefront for **LCG Shop** — fitness & sports nutrition near OAKA / Marousi (inspired by [@lcgshop_oaka](https://instagram.com/lcgshop_oaka)).

## Deployment (Kubernetes / Azure DevOps)

Same cluster as coffee-brain, **NodePort 30083** → [http://185.193.66.50:30083/](http://185.193.66.50:30083/)

See **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)** and repo root **`azure-pipelines.yml`**.

## Tech stack

- React 19 + TypeScript + Vite
- React Router
- CSS Modules (no Tailwind / heavy UI libs)
- lucide-react, clsx
- Cart: Context API + reducer + `localStorage`
- Data: repository pattern with mock / HTTP switch via `VITE_USE_MOCK_DATA`

## Getting started

```bash
cd lcg-shop-frontend
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

Lint & format:

```bash
npm run lint
npm run format
```

## Environment

Copy `.env.example` to `.env`:

```env
VITE_USE_MOCK_DATA=true
VITE_USE_MOCK_AUTH=true
VITE_API_BASE_URL=http://localhost:8080/api
```

## Authentication (mock)

Login, register and account pages work with **mock auth** (`VITE_USE_MOCK_AUTH=true`). Guest checkout always works — no login required.

**Demo accounts:**

| Email | Password | Role |
|-------|----------|------|
| `maria@example.com` | `password123` | Customer |
| `admin@lcgshop.gr` | `admin123` | Admin |
| `dimitris@example.com` | `demo123` | Customer |

Routes: `/login`, `/register`, `/account`. Set `VITE_USE_MOCK_AUTH=false` when the C# backend exposes `/auth/login`, `/auth/register`, `/auth/me`.

## Product images

Product and category images use **placeholder URLs** from [picsum.photos](https://picsum.photos) with stable seeds per slug (see `src/data/mockProducts.ts`). Replace with real assets when available.

## Backend API contract

OpenAPI 3.0 spec and human-readable docs for the C# backend:

| Resource | Path |
|----------|------|
| **Backend developer guide** (clone, run, entities, migration) | [docs/BACKEND_DEVELOPER.md](docs/BACKEND_DEVELOPER.md) |
| OpenAPI spec (source of truth) | [docs/openapi.yaml](docs/openapi.yaml) |
| Endpoint overview | [docs/API.md](docs/API.md) |
| Swagger UI (static) | [public/api-docs.html](public/api-docs.html) |

**Browse interactively:**

```bash
npm run api-docs
# → http://localhost:3333/api-docs.html
```

Or during `npm run dev`: run `npm run sync:openapi` once, then open `http://localhost:5173/api-docs.html`.

After editing `docs/openapi.yaml`, run `npm run sync:openapi` to refresh `public/openapi.yaml`.

Base URL: `VITE_API_BASE_URL` (default `http://localhost:8080/api`). Paths in the spec are relative to that root (`/products`, `/categories`, `/orders`).

## Switching mock → backend

1. Set `VITE_USE_MOCK_DATA=false` in `.env`
2. Set `VITE_API_BASE_URL` to your API root
3. Restart the dev server

Repository selectors:

- `src/services/products/index.ts` → `productRepository`
- `src/services/categories/index.ts` → `categoryRepository`

HTTP implementations:

- `src/services/products/httpProductRepository.ts`
- `src/services/categories/httpCategoryRepository.ts`
- `src/services/api/apiClient.ts`

See [docs/API.md](docs/API.md) for the full endpoint list.

## Project structure

```
src/
  app/           App, router, providers
  components/    ui, layout, product, cart
  data/          mock products, categories, store info
  features/      pages + cart + product hooks
  services/      repositories + apiClient
  styles/        globals, variables, reset
  utils/
```

Path alias: `@/` → `src/`

## License

Private / demo project.
