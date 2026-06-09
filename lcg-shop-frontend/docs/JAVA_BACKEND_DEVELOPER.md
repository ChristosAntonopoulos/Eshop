# LCG Shop — Java backend developer guide

This guide is for the **Java** developer connecting a **Spring Boot** API to the LCG Shop React frontend. The repo contains the **frontend + OpenAPI contract** only — you add your own backend (e.g. `lcg-shop-api/` in this repo or a separate project).

**Related docs:**

| Document | Audience |
|----------|----------|
| [openapi.yaml](./openapi.yaml) | Machine-readable catalog + orders contract |
| [API.md](./API.md) | Short endpoint reference |
| [BACKEND_DEVELOPER.md](./BACKEND_DEVELOPER.md) | Domain model, ER diagram, entity mapping (language-agnostic) |
| **This file** | Java / Spring Boot connection steps |

---

## Table of contents

1. [Overview](#1-overview)
2. [Clone and run the frontend](#2-clone-and-run-the-frontend)
3. [How the frontend talks to your API](#3-how-the-frontend-talks-to-your-api)
4. [Suggested Java stack](#4-suggested-java-stack)
5. [Project bootstrap (Spring Boot)](#5-project-bootstrap-spring-boot)
6. [Environment variables — frontend side](#6-environment-variables--frontend-side)
7. [API base URL and CORS](#7-api-base-url-and-cors)
8. [JSON rules (critical)](#8-json-rules-critical)
9. [Endpoints to implement](#9-endpoints-to-implement)
10. [Auth endpoints (JWT)](#10-auth-endpoints-jwt)
11. [Request / response DTOs (Java)](#11-request--response-dtos-java)
12. [JPA entity sketch](#12-jpa-entity-sketch)
13. [Controller routing order](#13-controller-routing-order)
14. [Phased implementation plan](#14-phased-implementation-plan)
15. [Testing the connection](#15-testing-the-connection)
16. [Guest checkout vs registered users](#16-guest-checkout-vs-registered-users)
17. [Seed data](#17-seed-data)
18. [Common mistakes](#18-common-mistakes)
19. [Quick checklist](#19-quick-checklist)
20. [Reference files in this repo](#20-reference-files-in-this-repo)

---

## 1. Overview

```
┌─────────────────────┐         HTTP (JSON)          ┌──────────────────────┐
│  React frontend     │  ─────────────────────────►  │  Your Spring Boot API │
│  localhost:5173     │  ◄─────────────────────────  │  localhost:8080/api   │
└─────────────────────┘         camelCase JSON       └──────────────────────┘
         │                                                      │
         │ mock mode (default)                                  │ PostgreSQL / MySQL / H2
         ▼                                                      ▼
   localStorage cart                                    JPA entities + JWT
```

**What works today without your API:**

- Product & category pages (mock JSON in `src/data/`)
- Cart (browser `localStorage`)
- Login / register / account (mock auth in `localStorage`)
- Checkout (demo submit — no real `POST /orders` yet)

**What you replace gradually:**

| Frontend flag | Switches |
|---------------|----------|
| `VITE_USE_MOCK_DATA=false` | Products + categories → your API |
| `VITE_USE_MOCK_AUTH=false` | Login / register / session → your API |

Catalog and auth are **independent** — you can connect products first and auth later.

---

## 2. Clone and run the frontend

```bash
git clone https://github.com/ChristosAntonopoulos/Eshop.git
cd Eshop/lcg-shop-frontend
npm install
cp .env.example .env    # Windows: copy .env.example .env
npm run dev
```

Open **http://localhost:5173** — the shop runs fully on mock data.

### Browse the API contract (Swagger)

```bash
cd lcg-shop-frontend
npm run api-docs
```

Open **http://localhost:3333/api-docs.html** — lists catalog and order schemas.

### Default `.env`

```env
VITE_USE_MOCK_DATA=true
VITE_USE_MOCK_AUTH=true
VITE_API_BASE_URL=http://localhost:8080/api
```

---

## 3. How the frontend talks to your API

All HTTP calls go through **`src/services/api/apiClient.ts`**:

- **Base URL:** `VITE_API_BASE_URL` (default `http://localhost:8080/api`)
- **Paths:** appended to base — e.g. `GET /products` → `http://localhost:8080/api/products`
- **Auth header:** when logged in via real API, sends `Authorization: Bearer <token>`
- **No credentials/cookies** by default — JWT in `localStorage` is the expected pattern

### Repository pattern (where to look in frontend code)

| Feature | Mock | HTTP (your API) | Toggle |
|---------|------|-----------------|--------|
| Products | `mockProductRepository.ts` | `httpProductRepository.ts` | `VITE_USE_MOCK_DATA` |
| Categories | `mockCategoryRepository.ts` | `httpCategoryRepository.ts` | `VITE_USE_MOCK_DATA` |
| Auth | `mockAuthRepository.ts` | `httpAuthRepository.ts` | `VITE_USE_MOCK_AUTH` |

**You do not need to change frontend code** if your API matches the contracts below.

---

## 4. Suggested Java stack

| Layer | Recommendation |
|-------|----------------|
| Framework | **Spring Boot 3.2+** (Java 17 or 21) |
| Web | `spring-boot-starter-web` |
| Security | `spring-boot-starter-security` + JWT (e.g. `jjwt` or Spring OAuth2 Resource Server) |
| Persistence | `spring-boot-starter-data-jpa` |
| Database | PostgreSQL (prod), H2 (local dev) |
| Migrations | Flyway or Liquibase |
| Validation | `spring-boot-starter-validation` (`jakarta.validation`) |
| API docs | springdoc-openapi (optional — frontend already ships OpenAPI) |
| Password hashing | BCrypt via `PasswordEncoder` |

---

## 5. Project bootstrap (Spring Boot)

### Option A — Spring Initializr

1. Go to [start.spring.io](https://start.spring.io)
2. Select: **Gradle** or **Maven**, **Java 21**, **Spring Boot 3.4.x**
3. Dependencies: **Web**, **Spring Security**, **Spring Data JPA**, **Validation**, **PostgreSQL** (or H2)
4. Group: `gr.lcgshop`, Artifact: `lcg-shop-api`
5. Unzip into `Eshop/lcg-shop-api/` (sibling to `lcg-shop-frontend`)

### Option B — Maven coordinates (reference)

```xml
<parent>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-parent</artifactId>
  <version>3.4.0</version>
</parent>
```

### Minimum `application.yml` for local dev

```yaml
server:
  port: 8080
  servlet:
    context-path: /api   # optional — see §7 for alternative

spring:
  application:
    name: lcg-shop-api
  datasource:
    url: jdbc:postgresql://localhost:5432/lcgshop
    username: lcgshop
    password: lcgshop
  jpa:
    hibernate:
      ddl-auto: validate
    open-in-view: false
  jackson:
    property-naming-strategy: LOWER_CAMEL_CASE
    serialization:
      write-dates-as-timestamps: false

lcg:
  cors:
    allowed-origins: http://localhost:5173
  jwt:
    secret: change-me-to-a-long-random-string-at-least-256-bits
    expiration-days: 7
```

> **Context path:** The frontend expects paths like `/api/products`. Either set `context-path: /api` **or** prefix all controllers with `@RequestMapping("/api")`. Do not double-prefix (`/api/api/products`).

---

## 6. Environment variables — frontend side

When your API is ready, edit `lcg-shop-frontend/.env`:

### Phase 1 — Categories only

```env
VITE_USE_MOCK_DATA=false
VITE_USE_MOCK_AUTH=true
VITE_API_BASE_URL=http://localhost:8080/api
```

Restart: `npm run dev`

### Phase 2 — Full catalog

Same as above; all product endpoints must work.

### Phase 3 — Auth

```env
VITE_USE_MOCK_DATA=false
VITE_USE_MOCK_AUTH=false
VITE_API_BASE_URL=http://localhost:8080/api
```

### Production build (Docker / K8s)

```bash
docker build \
  --build-arg VITE_USE_MOCK_DATA=false \
  --build-arg VITE_USE_MOCK_AUTH=false \
  --build-arg VITE_API_BASE_URL=https://api.yourdomain.com/api \
  -t lcg-shop-frontend .
```

---

## 7. API base URL and CORS

### Ports (development)

| Service | URL |
|---------|-----|
| React (Vite) | `http://localhost:5173` |
| Spring Boot API | `http://localhost:8080` |
| Full products URL | `http://localhost:8080/api/products` |

### CORS configuration (required)

The browser blocks cross-origin calls without CORS. Allow the Vite origin:

```java
@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer(
            @Value("${lcg.cors.allowed-origins}") String allowedOrigins) {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins(allowedOrigins.split(","))
                        .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .exposedHeaders("Authorization");
            }
        };
    }
}
```

For Spring Security 6, also permit preflight in your security filter chain:

```java
http.cors(Customizer.withDefaults())
    .csrf(csrf -> csrf.disable()); // stateless JWT API — OK for dev; review for prod
```

---

## 8. JSON rules (critical)

The React app expects **camelCase** property names in JSON.

| Java (field) | JSON (wire) | Notes |
|--------------|-------------|-------|
| `isActive` | `isActive` | Use `@JsonProperty("isActive")` on boolean getters if Lombok generates `getActive()` |
| `stockQuantity` | `stockQuantity` | |
| `categoryId` | `categoryId` | |
| `createdAt` | `createdAt` | ISO-8601 string, e.g. `2026-05-01T10:00:00Z` |
| `role` | `role` | Enum strings: `CUSTOMER`, `ADMIN` |

### Jackson config

```java
@Bean
public Jackson2ObjectMapperBuilderCustomizer jsonCustomizer() {
    return builder -> builder
            .featuresToDisable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
            .serializationInclusion(JsonInclude.Include.NON_NULL);
}
```

### Product IDs

Frontend uses **string** ids (`"1"`, `"supplements"`). Easiest approach: expose `String id` in DTOs (convert from `Long` in mapper).

### Null vs 404 for single resources

`GET /products/{slug}` and `GET /categories/{slug}`:

- Frontend accepts **`200` with JSON `null`** body, **or** **`404`**
- Current HTTP client only checks `response.ok` — prefer **`200` + product** or **`404`**

---

## 9. Endpoints to implement

Base: `{VITE_API_BASE_URL}` → `http://localhost:8080/api`

### Catalog (required for shop UI)

| Method | Path | Frontend wired | Notes |
|--------|------|----------------|-------|
| `GET` | `/products` | Yes | Query params below |
| `GET` | `/products/featured` | Yes | Register **before** `/{slug}` |
| `GET` | `/products/{slug}` | Yes | Slug, not numeric id |
| `GET` | `/products/{id}/related` | Yes | **`id`** = product id string |
| `GET` | `/categories` | Yes | Active categories |
| `GET` | `/categories/{slug}` | Yes | |

#### `GET /products` query parameters

| Param | Type | Example | Behaviour |
|-------|------|---------|-----------|
| `search` | string | `whey` | Match name, description, tags (case-insensitive) |
| `categoryId` | string | `supplements` | Filter by category |
| `minPrice` | number | `10` | Inclusive |
| `maxPrice` | number | `50` | Inclusive |
| `sortBy` | enum | `price-asc` | `newest`, `price-asc`, `price-desc`, `name` |
| `onlyInStock` | boolean | `true` | Exclude `stockQuantity === 0` |

**Response:** `200` + `ProductDto[]` (may be empty)

**Errors:** `400` invalid params, `500` server error

Full schema: [openapi.yaml](./openapi.yaml) → `components.schemas.Product`

### Orders (checkout — implement early, wire UI later)

| Method | Path | Frontend wired | Notes |
|--------|------|----------------|-------|
| `POST` | `/orders` | Not yet | Body: `CreateOrderRequest` |

`CheckoutPage` currently fakes success. Implement the endpoint so it is ready when frontend wires `apiClient.post("/orders", body)`.

---

## 10. Auth endpoints (JWT)

When `VITE_USE_MOCK_AUTH=false`, the frontend calls:

| Method | Path | Body | Response |
|--------|------|------|----------|
| `POST` | `/auth/login` | `{ email, password }` | `AuthSessionDto` |
| `POST` | `/auth/register` | `{ firstName, lastName, email, phone?, password }` | `AuthSessionDto` |
| `POST` | `/auth/logout` | `{}` | `204` or `200` (optional server-side invalidate) |
| `GET` | `/auth/me` | — | `AuthUserDto` (requires `Authorization: Bearer`) |

### `AuthSessionDto` (login + register response)

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user-1",
    "firstName": "Maria",
    "lastName": "Papadopoulou",
    "email": "maria@example.com",
    "phone": "+30 210 1234567",
    "role": "CUSTOMER",
    "defaultAddress": {
      "street": "Leoforos Kifisias 45",
      "city": "Marousi",
      "postalCode": "15125",
      "country": "GR"
    },
    "createdAt": "2025-11-01T10:00:00Z"
  },
  "expiresAt": "2026-06-11T10:00:00Z"
}
```

Frontend stores this in `localStorage` key `lcg-shop-auth-session`.

### `GET /auth/me`

- Header: `Authorization: Bearer <token>`
- Returns current user (same shape as `user` above, without wrapping in session)
- On invalid/expired token: **`401`** — frontend clears session

### Security rules

| Endpoint | Auth |
|----------|------|
| `GET /products`, `/categories` | Public |
| `POST /auth/login`, `/auth/register` | Public |
| `POST /orders` | Public (guest checkout) — optional: attach user if JWT present |
| `GET /auth/me` | Authenticated |
| Future admin APIs | `ROLE_ADMIN` |

### Demo users to seed (matches frontend mock)

| Email | Password | Role |
|-------|----------|------|
| `maria@example.com` | `password123` | `CUSTOMER` |
| `admin@lcgshop.gr` | `admin123` | `ADMIN` |
| `dimitris@example.com` | `demo123` | `CUSTOMER` |

Store **BCrypt** hashes only — never return `passwordHash` in JSON.

---

## 11. Request / response DTOs (Java)

Use separate **DTO records** for API responses — do not expose JPA entities directly.

### ProductDto (response)

```java
public record ProductDto(
    String id,
    String slug,
    String name,
    String description,
    String shortDescription,
    String categoryId,
    String brand,
    BigDecimal price,
    BigDecimal compareAtPrice,
    String imageUrl,
    List<String> gallery,
    int stockQuantity,
    boolean isActive,
    boolean isFeatured,
    boolean isNew,
    List<String> tags,
    ProductNutritionalInfoDto nutritionalInfo,
    Instant createdAt
) {}
```

Required fields for UI: see `src/features/products/types/product.types.ts`. Missing `gallery` or `tags` (empty array) can break listing cards — return `[]` not `null`.

### CategoryDto (response)

```java
public record CategoryDto(
    String id,
    String slug,
    String name,
    String description,
    String imageUrl,
    boolean isActive
) {}
```

### CreateOrderRequest (request body)

```java
public record CreateOrderRequest(
    @NotNull OrderCustomerDto customer,
    @NotNull OrderShippingAddressDto shippingAddress,
    @NotEmpty List<OrderLineItemDto> items,
    String notes
) {}

public record OrderCustomerDto(
    @NotBlank String firstName,
    @NotBlank String lastName,
    @Email String email,
    @NotBlank String phone
) {}

public record OrderShippingAddressDto(
    @NotBlank String address,   // maps to Address.street in DB
    @NotBlank String city,
    @NotBlank String postalCode
) {}

public record OrderLineItemDto(
    @NotBlank String productId,
    @Min(1) int quantity,
    @NotNull BigDecimal unitPrice
) {}
```

### OrderResponse (response — checkout DTO)

```java
public record OrderResponse(
    String id,
    String status,       // "pending" | "confirmed" | "cancelled" (checkout DTO)
    BigDecimal subtotal,
    BigDecimal shipping,
    BigDecimal total,
    Instant createdAt
) {}
```

**Database:** store status as `PENDING`, `PAID`, `SHIPPED`, `DELIVERED`, `CANCELLED` — map to checkout DTO when returning. See [BACKEND_DEVELOPER.md §7](./BACKEND_DEVELOPER.md#7-entity-vs-api-contract--discrepancies).

### Auth DTOs

```java
public record LoginRequest(@Email String email, @NotBlank String password) {}

public record RegisterRequest(
    @NotBlank String firstName,
    @NotBlank String lastName,
    @Email String email,
    String phone,
    @NotBlank @Size(min = 6) String password
) {}

public record AuthSessionDto(String token, AuthUserDto user, Instant expiresAt) {}

public record AuthUserDto(
    String id,
    String firstName,
    String lastName,
    String email,
    String phone,
    String role,
    AddressDto defaultAddress,
    Instant createdAt
) {}
```

---

## 12. JPA entity sketch

Full domain description: [BACKEND_DEVELOPER.md §5–6](./BACKEND_DEVELOPER.md#5-domain-model-database-entities).

```java
@Entity
@Table(name = "products")
public class Product {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String slug;
    private String name;
    private String description;
    private String shortDescription;
    private BigDecimal price;
    private Integer stockQuantity;
    private String imageUrl;
    private boolean active = true;
    private boolean featured;
    private boolean newProduct;  // column "is_new"; map to isNew in DTO

    @ManyToOne(fetch = FetchType.LAZY)
    private Category category;

    private Instant createdAt;
    private Instant updatedAt;
    // tags, gallery, nutritionalInfo: @ElementCollection or JSON column
}

@Entity
@Table(name = "customers")
public class Customer {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;
    private String lastName;

    @Column(unique = true)
    private String email;

    private String phone;
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    private CustomerRole role = CustomerRole.CUSTOMER;

    private Instant createdAt;
}

public enum CustomerRole { CUSTOMER, ADMIN }

public enum OrderStatus { PENDING, PAID, SHIPPED, DELIVERED, CANCELLED }
```

Use a **mapper** (`ProductMapper.toDto(entity)`) to convert `active` → `isActive`, `newProduct` → `isNew`, `Long id` → `String id`.

---

## 13. Controller routing order

Spring MVC matches the **most specific** pattern, but avoid ambiguity:

```java
@RestController
@RequestMapping("/products")
public class ProductController {

    @GetMapping("/featured")
    public List<ProductDto> featured() { ... }

    @GetMapping("/{id}/related")
    public List<ProductDto> related(@PathVariable String id) { ... }

    @GetMapping("/{slug}")
    public ResponseEntity<ProductDto> bySlug(@PathVariable String slug) { ... }

    @GetMapping
    public List<ProductDto> list(@Valid ProductQueryParams params) { ... }
}
```

`/products/featured` must not be captured by `/{slug}` — declare `/featured` first or use separate path segments as above.

For `/{id}/related`: the path variable is **product id** (`"1"`), not slug (`"whey-protein-chocolate-1kg"`).

---

## 14. Phased implementation plan

| Phase | Build in Java | Frontend `.env` | Verify |
|-------|---------------|-----------------|--------|
| **0** | Spring Boot project, CORS, health `GET /actuator/health` | mocks on | API starts on 8080 |
| **1** | JPA + Flyway: `Category`, `Product`; seed data | `MOCK_DATA=false` | Home + product pages load |
| **2** | Query filters + sort on `GET /products` | same | Search, category filter, sort work |
| **3** | `Customer`, `Address`, `Order`, `OrderItem`; `POST /orders` | same | Test with Swagger / curl |
| **4** | JWT auth: login, register, `/auth/me` | `MOCK_AUTH=false` | Login page, header avatar, checkout prefill |
| **5** | Admin endpoints (optional) | same | `ADMIN` role seed user |
| **6** | Server-side cart (optional) | frontend change needed | Later |

---

## 15. Testing the connection

### 1. curl smoke tests

```bash
# Categories
curl -s http://localhost:8080/api/categories | jq .

# Products
curl -s "http://localhost:8080/api/products?categoryId=supplements&sortBy=price-asc" | jq .

# Featured (must not 404)
curl -s http://localhost:8080/api/products/featured | jq .

# Login
curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"maria@example.com","password":"password123"}' | jq .

# Me (replace TOKEN)
curl -s http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer TOKEN" | jq .
```

### 2. Browser DevTools

1. Set `VITE_USE_MOCK_DATA=false` in `.env`
2. `npm run dev`
3. Open **Network** tab → filter `products` / `categories`
4. Expect `200` from `localhost:8080`, not mock files

### 3. Typical failures

| Symptom | Cause |
|---------|-------|
| CORS error in console | CORS not configured for `http://localhost:5173` |
| `404` on `/api/products` | Wrong context path or missing controller mapping |
| `featured` returns wrong product | Route `/{slug}` eats `featured` |
| Empty product cards | Missing required JSON fields (`gallery`, `tags`, `isFeatured`) |
| Login works but catalog empty | Only auth connected — set up catalog endpoints too |
| `401` on every request | Security filter blocks public catalog — permit `GET /products/**` |

---

## 16. Guest checkout vs registered users

**Guest checkout is mandatory** — do not require login for `POST /orders`.

Recommended flow:

1. Accept order with customer email + address in body (always).
2. If `Authorization` header present, link order to logged-in `Customer`.
3. If guest, **find or create** customer by email (no password).
4. Snapshot `productName` + `priceAtPurchase` on each `OrderItem`.
5. Decrement `stockQuantity` inside a transaction.

Checkout form field names (from `CheckoutPage.tsx`): `firstName`, `lastName`, `email`, `phone`, `address`, `city`, `postalCode`, `notes`.

---

## 17. Seed data

Use frontend mock files as **shape reference**:

| File | Content |
|------|---------|
| `src/data/mockCategories.ts` | 6 fitness categories |
| `src/data/mockProducts.ts` | ~15 products with full DTO fields |
| `src/data/mockUsers.ts` | 3 demo customers |

Example category seed:

```sql
INSERT INTO categories (id, slug, name, description, image_url, active)
VALUES ('supplements', 'supplements', 'Supplements',
        'Protein, creatine, amino acids and daily performance support.',
        'https://picsum.photos/seed/cat-supplements/600/400', true);
```

Or a Spring `ApplicationRunner` that reads JSON exported from mock files.

---

## 18. Common mistakes

1. **Snake_case JSON** — Java defaults can leak `stock_quantity`; force camelCase.
2. **Double `/api` prefix** — context-path + controller `@RequestMapping("/api")` = `/api/api/...`.
3. **`related` route uses slug** — frontend passes product **id** from `product.id`.
4. **Returning entity with lazy `Category`** — serialize DTOs only; avoid `LazyInitializationException`.
5. **Blocking guest orders** — `POST /orders` must be `permitAll()`.
6. **Wrong password field in login** — frontend sends `{ email, password }`, not `username`.
7. **Enum case** — role is `"CUSTOMER"` / `"ADMIN"` (uppercase), order checkout status is lowercase `pending`.

---

## 19. Quick checklist

- [ ] Clone repo; `npm run dev` — UI works with mocks
- [ ] `npm run api-docs` — read OpenAPI + this guide
- [ ] Create Spring Boot app on port **8080**, base path **`/api`**
- [ ] Configure **CORS** for `http://localhost:5173`
- [ ] Jackson **camelCase** + ISO dates
- [ ] Flyway migrations for domain tables ([BACKEND_DEVELOPER.md](./BACKEND_DEVELOPER.md))
- [ ] Seed categories + products from mock data
- [ ] Implement `GET /categories`, `GET /categories/{slug}`
- [ ] Set `VITE_USE_MOCK_DATA=false` — verify shop in browser
- [ ] Implement all `GET /products*` endpoints (mind routing order)
- [ ] Implement `POST /orders` with line-item snapshots
- [ ] Implement JWT auth endpoints
- [ ] Set `VITE_USE_MOCK_AUTH=false` — test login, account, checkout prefill
- [ ] Document your API URL for deployment

---

## 20. Reference files in this repo

| Purpose | Path |
|---------|------|
| OpenAPI catalog + orders | `docs/openapi.yaml` |
| Endpoint summary | `docs/API.md` |
| Domain model + ER diagram | `docs/BACKEND_DEVELOPER.md` |
| Product TypeScript types | `src/features/products/types/product.types.ts` |
| Auth TypeScript types | `src/features/auth/types/auth.types.ts` |
| HTTP product client | `src/services/products/httpProductRepository.ts` |
| HTTP category client | `src/services/categories/httpCategoryRepository.ts` |
| HTTP auth client | `src/services/auth/httpAuthRepository.ts` |
| API client + Bearer header | `src/services/api/apiClient.ts` |
| Checkout form fields | `src/features/checkout/CheckoutPage.tsx` |

When the frontend team changes contracts, they update `docs/openapi.yaml`. Pull latest `main` before integrating.

---

**Questions?** Inspect the HTTP repository files above — they are the exact calls your Java API must satisfy.
