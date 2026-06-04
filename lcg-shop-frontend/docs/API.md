# LCG Shop — Backend API contract

Human-readable overview for the C# backend. The machine-readable spec is **[openapi.yaml](./openapi.yaml)** (OpenAPI 3.0).

**Base URL:** `VITE_API_BASE_URL` → default `http://localhost:8080/api`  
All paths below are appended to that base (e.g. full URL `http://localhost:8080/api/products`).

Frontend HTTP clients:

| Repository | File |
|------------|------|
| Products | `src/services/products/httpProductRepository.ts` |
| Categories | `src/services/categories/httpCategoryRepository.ts` |
| HTTP helper | `src/services/api/apiClient.ts` |

DTO types: `src/features/products/types/product.types.ts`, `src/services/products/productRepository.ts` (`ProductQueryParams`).

---

## Endpoints

| Method | Path | Summary | Used by frontend |
|--------|------|---------|------------------|
| `GET` | `/products` | List/filter products | Yes |
| `GET` | `/products/featured` | Featured products (home) | Yes |
| `GET` | `/products/{slug}` | Product detail by slug | Yes |
| `GET` | `/products/{id}/related` | Related products (**id**, not slug) | Yes |
| `GET` | `/categories` | All categories | Yes |
| `GET` | `/categories/{slug}` | Category by slug | Yes |
| `POST` | `/orders` | Create order (checkout) | Planned |

### `GET /products` — query parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `search` | string | Search name, description, tags |
| `categoryId` | string | e.g. `supplements`, `hydration` |
| `minPrice` | number | Min price (inclusive) |
| `maxPrice` | number | Max price (inclusive) |
| `sortBy` | enum | `newest` \| `price-asc` \| `price-desc` \| `name` |
| `onlyInStock` | boolean | Hide out-of-stock items |

**Response:** `200` → `Product[]`  
**Errors:** `400`, `500`

### `GET /products/featured`

**Response:** `200` → `Product[]`  
Register **before** `/products/{slug}` in routing.

### `GET /products/{slug}`

**Response:** `200` → `Product` or `null` (mock returns null; 404 also acceptable)  
**Errors:** `404`, `500`

### `GET /products/{id}/related`

**Path:** `id` = product id (e.g. `"1"`), not slug.

**Response:** `200` → `Product[]`  
**Errors:** `404`, `500`

### `GET /categories`

**Response:** `200` → `Category[]`

### `GET /categories/{slug}`

**Response:** `200` → `Category` or `null`  
**Errors:** `404`, `500`

### `POST /orders`

**Body:** `CreateOrderRequest` — `customer`, `shippingAddress`, `items[]`, optional `notes`  
**Response:** `201` → `OrderResponse`  
**Errors:** `400`, `500`

Not wired in the React app yet; shape matches `CheckoutPage` form fields + cart lines.

---

## Schemas (summary)

- **Product** — catalog item (`id`, `slug`, `name`, `price`, `stockQuantity`, `tags`, optional `nutritionalInfo`, …)
- **Category** — `id`, `slug`, `name`, `description`, optional `imageUrl`, `isActive`
- **ProductNutritionalInfo** — optional `protein`, `carbs`, `calories`, `servingSize` (strings)
- **CreateOrderRequest** — `customer`, `shippingAddress`, `items`, `notes?`

Full field lists and JSON examples: see [openapi.yaml](./openapi.yaml).

---

## View in Swagger UI

### Option A — Static page (recommended)

```bash
cd lcg-shop-frontend
npm run api-docs
```

Opens a local server; browse to **http://localhost:3333/api-docs.html**

The spec is copied from `docs/openapi.yaml` → `public/openapi.yaml` automatically.

### Option B — During Vite dev

```bash
npm run sync:openapi
npm run dev
```

Open **http://localhost:5173/api-docs.html** (Vite serves `public/`).

### Option C — Swagger Editor (online)

1. Open [editor.swagger.io](https://editor.swagger.io)
2. **File → Import file** → select `docs/openapi.yaml`

### Option D — Redocly preview

```bash
npx @redocly/cli preview-docs docs/openapi.yaml
```

---

## CORS

The browser calls the API from the Vite origin (e.g. `http://localhost:5173`). Enable CORS on the ASP.NET API for development.

---

## Keeping docs in sync

When changing `httpProductRepository.ts`, `httpCategoryRepository.ts`, or product/category types, update **`docs/openapi.yaml`** then run:

```bash
npm run sync:openapi
```
