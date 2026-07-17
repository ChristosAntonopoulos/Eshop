# LCG Shop — Backend API contract

Human-readable API overview for backend developers. The machine-readable spec is **[openapi.yaml](./openapi.yaml)** (OpenAPI 3.0).

**Backend guides:**

| Stack | Guide |
|-------|-------|
| **Java / Spring Boot** | **[JAVA_BACKEND_DEVELOPER.md](./JAVA_BACKEND_DEVELOPER.md)** |
| Domain model + ER diagram (any language) | [BACKEND_DEVELOPER.md](./BACKEND_DEVELOPER.md) |

**Base URL:** `VITE_API_BASE_URL` → default `http://localhost:8080/api`  
All paths below are appended to that base (e.g. full URL `http://localhost:8080/api/products`).

Frontend flags:

| Flag | When `false` |
|------|----------------|
| `VITE_USE_MOCK_DATA` | Products + categories (storefront + admin CRUD) |
| `VITE_USE_MOCK_AUTH` | Auth + admin customers |
| `VITE_USE_MOCK_ORDERS` | Checkout + admin orders |

Frontend HTTP clients:

| Repository | File |
|------------|------|
| Products | `src/services/products/httpProductRepository.ts` |
| Categories | `src/services/categories/httpCategoryRepository.ts` |
| Orders | `src/services/orders/httpOrderRepository.ts` |
| Admin customers | `src/services/admin/httpAdminCustomerRepository.ts` |
| Auth | `src/services/auth/httpAuthRepository.ts` |
| HTTP helper | `src/services/api/apiClient.ts` |

DTO types: `product.types.ts`, `order.types.ts`, `auth.types.ts`.

---

## Endpoints

| Method | Path | Summary | Auth |
|--------|------|---------|------|
| `GET` | `/products` | List/filter (`includeInactive` for admin) | Public |
| `GET` | `/products/featured` | Featured products | Public |
| `GET` | `/products/{slug}` | Product by slug | Public |
| `GET` | `/products/{id}/related` | Related by **id** | Public |
| `GET` | `/products/by-id/{id}` | Product by id (admin edit) | Admin |
| `POST` | `/products` | Create product | Admin |
| `PUT` | `/products/{id}` | Update product | Admin |
| `PATCH` | `/products/{id}/active` | `{ isActive }` | Admin |
| `GET` | `/categories` | List (`includeInactive` for admin) | Public |
| `GET` | `/categories/{slug}` | Category by slug | Public |
| `GET` | `/categories/by-id/{id}` | Category by id | Admin |
| `POST` | `/categories` | Create category | Admin |
| `PUT` | `/categories/{id}` | Update category | Admin |
| `PATCH` | `/categories/{id}/active` | `{ isActive }` | Admin |
| `POST` | `/orders` | Create order (checkout) | Public / guest |
| `GET` | `/orders` | List orders (`?status=`) | Admin |
| `GET` | `/orders/{id}` | Order detail | Admin |
| `PATCH` | `/orders/{id}/status` | `{ status }` | Admin |
| `GET` | `/admin/customers` | List users | Admin |
| `GET` | `/admin/customers/{id}` | User detail | Admin |
| `POST` | `/auth/login` | Login | Public |
| `POST` | `/auth/register` | Register | Public |
| `POST` | `/auth/logout` | Logout | Bearer |
| `GET` | `/auth/me` | Current user | Bearer |

### Order status

`PENDING` | `CONFIRMED` | `SHIPPED` | `DELIVERED` | `CANCELLED`

### `POST /orders`

**Body:** `CreateOrderRequest` — `customer`, `shippingAddress`, `items[]`, optional `notes`  
**Response:** `200`/`201` → full `Order` (includes line `productName`, totals, status)

Wired from `CheckoutPage` when `VITE_USE_MOCK_ORDERS=false` (mock mode persists to `localStorage`).

---

## Schemas (summary)

- **Product** / **ProductWriteInput** — catalog + admin forms
- **Category** / **CategoryWriteInput**
- **Order** / **CreateOrderRequest** / **OrderStatus**
- **AuthUser** — admin customers + `/auth/me`

Full field lists: [openapi.yaml](./openapi.yaml).

---

## View in Swagger UI

```bash
cd lcg-shop-frontend
npm run api-docs
```

Open **http://localhost:3333/api-docs.html**

After editing `docs/openapi.yaml`, run `npm run sync:openapi`.

---

## CORS

Enable CORS for the Vite origin (e.g. `http://localhost:5173`). See [JAVA_BACKEND_DEVELOPER.md §7](./JAVA_BACKEND_DEVELOPER.md#7-api-base-url-and-cors).
