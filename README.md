# HCLTech-Hackathon
It has the combined code for the project

# ShopSmart AI — Hackathon Architecture Plan

> **Repository:** `/Users/dipesh/Downloads/HCLTech_1/HCLTech-Hackathon`
> **Your role:** Backend APIs · Database integration · AI integration · End-to-end wiring

---

## Environment Audit (What You Have Today)

| Tool | Status | Version / Detail |
|---|---|---|
| Node.js | ✅ Available | v24.5.0 |
| npm | ✅ Available | 11.5.1 |
| Java 17 (Zulu) | ✅ Available | OpenJDK 17.0.12 |
| Maven (mvn) | ❌ **MISSING** | Not found in PATH |
| Docker Desktop | ⚠️ Installed but not started | Found in `/Applications/Docker Desktop` |
| PostgreSQL (psql CLI) | ❌ **MISSING** | Not found in PATH — will run via Docker |
| Git | ✅ Available | 2.39.5 |

> [!CAUTION]
> **Maven is not in your PATH.** This is the most critical blocker. You must fix this before writing any backend code. See Prerequisites section at the bottom.

---

## 1. Proposed Folder Structure

The repository will have **two root folders** — one for the frontend and one for the backend. This is the clean separation judges look for.

```
HCLTech-Hackathon/
│
├── README.md                          ← exists already (keep it)
│
├── backend/                           ← Spring Boot project (YOUR work)
│   ├── pom.xml                        ← Maven build file (all dependencies listed here)
│   ├── src/
│   │   └── main/
│   │       ├── java/com/shopsmart/
│   │       │   ├── ShopSmartApplication.java   ← Spring Boot entry point
│   │       │   ├── config/
│   │       │   │   ├── CorsConfig.java          ← Allow React frontend to call backend
│   │       │   │   ├── SecurityConfig.java      ← Basic auth config
│   │       │   │   └── VectorStoreConfig.java   ← PgVector setup
│   │       │   ├── product/
│   │       │   │   ├── Product.java             ← JPA Entity (maps to DB table)
│   │       │   │   ├── ProductRepository.java   ← DB queries
│   │       │   │   ├── ProductService.java      ← Business logic
│   │       │   │   └── ProductController.java   ← REST API endpoints
│   │       │   ├── order/
│   │       │   │   ├── Order.java
│   │       │   │   ├── OrderRepository.java
│   │       │   │   ├── OrderService.java
│   │       │   │   └── OrderController.java
│   │       │   ├── ai/
│   │       │   │   ├── ShoppingAssistantController.java  ← Module 1 AI
│   │       │   │   ├── ShoppingAssistantService.java
│   │       │   │   ├── KnowledgeAssistantController.java ← Module 2 RAG
│   │       │   │   ├── KnowledgeAssistantService.java
│   │       │   │   └── DocumentIngestionService.java     ← PDF/MD loader
│   │       │   └── common/
│   │       │       ├── ApiResponse.java          ← Standard JSON wrapper
│   │       │       └── GlobalExceptionHandler.java
│   │       └── resources/
│   │           ├── application.yml              ← Config (DB, AI keys, CORS)
│   │           ├── application-local.yml        ← Local overrides (git-ignored)
│   │           ├── data.sql                     ← Seed product data
│   │           └── documents/                   ← Policy PDFs for RAG
│   │               ├── return-policy.pdf
│   │               ├── shipping-policy.pdf
│   │               └── refund-policy.pdf
│   └── docker-compose.yml             ← Starts PostgreSQL + PgVector locally
│
├── frontend/                          ← React + Vite (teammate's work)
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── api/                       ← All fetch() calls to backend live here
│       │   ├── productApi.js
│       │   ├── orderApi.js
│       │   └── aiApi.js
│       └── components/
│           ├── ProductCatalog.jsx
│           ├── ShoppingAssistant.jsx
│           └── PolicyAssistant.jsx
│
└── .gitignore                         ← Ignore secrets, build folders
```

> [!TIP]
> Each feature (product, order, ai) lives in its own package. This is called **package-by-feature** structure. It makes it easy to show judges "here is everything about products, here is everything about AI."

---

## 2. Backend Architecture — How Spring Boot Works (Simple Explanation)

Think of the backend as a restaurant:

```
Browser / React App
      │
      │  HTTP Request (e.g. GET /api/products?category=laptops)
      ▼
┌─────────────────────────────────────────────────────────────┐
│                    Spring Boot Application                   │
│                                                             │
│  Controller (Waiter)                                        │
│    - Receives the request                                   │
│    - Validates input                                        │
│    - Calls Service                                          │
│                                                             │
│  Service (Chef)                                             │
│    - Contains business logic                                │
│    - Calls Repository or AI                                 │
│                                                             │
│  Repository (Pantry)                                        │
│    - Talks to PostgreSQL database                           │
│    - Fetches or saves data                                  │
│                                                             │
│  AI Layer (Spring AI)                                       │
│    - Calls Gemini / OpenAI with prompts                     │
│    - Performs vector search on PgVector                     │
└─────────────────────────────────────────────────────────────┘
      │
      ▼
PostgreSQL + PgVector Database
```

- A **Controller** handles incoming HTTP requests from React.
- A **Service** does the real work (search, filter, call AI).
- A **Repository** uses Spring Data JPA — you write almost no SQL; Spring generates it from method names like `findByCategory(String category)`.
- **Spring AI** wraps the AI model calls so you write Java instead of raw API calls.

---

## 3. Database Schema

### Table: `products`
```sql
CREATE TABLE products (
    id          VARCHAR(20) PRIMARY KEY,        -- e.g. "LAP101"
    name        VARCHAR(255) NOT NULL,
    category    VARCHAR(100) NOT NULL,          -- "Laptops", "Phones"
    brand       VARCHAR(100),
    description TEXT,
    price       DECIMAL(10,2) NOT NULL,
    rating      DECIMAL(3,2),                  -- e.g. 4.50
    stock_qty   INTEGER NOT NULL DEFAULT 0,
    image_url   VARCHAR(500),
    created_at  TIMESTAMP DEFAULT NOW()
);
```

### Table: `orders`
```sql
CREATE TABLE orders (
    id              BIGSERIAL PRIMARY KEY,
    order_number    VARCHAR(50) UNIQUE NOT NULL, -- e.g. "ORD-2026-00123"
    customer_email  VARCHAR(255) NOT NULL,
    product_id      VARCHAR(20) REFERENCES products(id),
    quantity        INTEGER NOT NULL DEFAULT 1,
    total_price     DECIMAL(10,2) NOT NULL,
    status          VARCHAR(50) NOT NULL,        -- PLACED, SHIPPED, DELIVERED
    tracking_info   TEXT,                        -- Simulated tracking text
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW()
);
```

### Table: `vector_store` (auto-created by Spring AI PgVector)
```sql
-- Spring AI creates this automatically when you start the app.
-- It stores embeddings (numerical representations) of your policy documents.
-- You do NOT write this table manually.
CREATE TABLE vector_store (
    id        UUID PRIMARY KEY,
    content   TEXT,                -- Original chunk of document text
    metadata  JSONB,               -- Source file name, section, version
    embedding VECTOR(1536)         -- The AI "fingerprint" of the text
);
```

> [!NOTE]
> PgVector adds the `VECTOR` data type to PostgreSQL. Spring AI handles inserting and searching these embeddings automatically. Your job is to load the documents — Spring AI does the rest.

### Table: `customers` (minimal — auth is in scope)
```sql
CREATE TABLE customers (
    id              BIGSERIAL PRIMARY KEY,
    email           VARCHAR(255) UNIQUE NOT NULL,
    name            VARCHAR(255) NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    membership_tier VARCHAR(20) DEFAULT 'BASIC', -- BASIC, PRIME, PREMIUM
    created_at      TIMESTAMP DEFAULT NOW()
);
```

---

## 4. REST API Endpoints

All endpoints are prefixed with `/api`. React calls these from the browser.

### Product Catalogue (Module 1)

| Method | Endpoint | What it does |
|---|---|---|
| `GET` | `/api/products` | List all products. Supports `?category=Laptops&maxPrice=1000&page=0&size=10` |
| `GET` | `/api/products/{id}` | Get one product by ID |
| `GET` | `/api/products/search?q=laptop` | Full-text search by name/description |
| `GET` | `/api/products/categories` | Returns list of category names |

### Order Tracking (Module 1)

| Method | Endpoint | What it does |
|---|---|---|
| `POST` | `/api/orders` | Create a simulated order |
| `GET` | `/api/orders/{orderNumber}` | Get order + tracking status |
| `GET` | `/api/orders/my` | Get all orders for logged-in user |

### AI Shopping Assistant (Module 1)

| Method | Endpoint | What it does |
|---|---|---|
| `POST` | `/api/ai/shopping-assistant` | Send a natural-language query, get product recommendations |

**Request body:**
```json
{ "query": "Suggest a laptop under $1000 for Java development" }
```
**Response:**
```json
{
  "interpretedRequirement": "Laptop for Java/AI development",
  "budget": 1000,
  "recommendations": [
    {
      "productId": "LAP101",
      "productName": "Dell Inspiron 15",
      "reason": "16GB RAM, i7 processor",
      "availability": "IN_STOCK"
    }
  ],
  "clarifyingQuestion": null
}
```

### Policy Assistant / RAG (Module 2)

| Method | Endpoint | What it does |
|---|---|---|
| `POST` | `/api/ai/policy-assistant` | Ask a question about policies. Returns answer + source documents |
| `POST` | `/api/documents/ingest` | Upload a PDF/Markdown and add it to the vector store |
| `GET` | `/api/documents` | List all ingested documents |

**Request body (policy-assistant):**
```json
{ "question": "Can I return an opened laptop?" }
```
**Response:**
```json
{
  "answer": "Opened laptops can be returned within 7 days if there is no physical damage.",
  "confidence": "HIGH",
  "sources": [
    {
      "document": "Laptop Return Policy",
      "section": "Opened Products",
      "version": "2026.1"
    }
  ],
  "followUpRequired": false
}
```

### Authentication

| Method | Endpoint | What it does |
|---|---|---|
| `POST` | `/api/auth/register` | Register new customer |
| `POST` | `/api/auth/login` | Login, returns a JWT token |

---

## 5. How Frontend Communicates with Backend

```
React Component (e.g. ProductCatalog.jsx)
      │
      │ fetch('http://localhost:8080/api/products?category=Laptops')
      ▼
Spring Boot Controller (ProductController.java)
      │
      │ calls ProductService
      ▼
Spring Boot Service (ProductService.java)
      │
      │ queries DB
      ▼
PostgreSQL Database
      │
      │ returns rows
      ▼
Service → Controller → JSON Response
      │
      ▼
React renders products in the UI
```

**CORS** (Cross-Origin Resource Sharing) is the key connection point. Since React runs on port `5173` and Spring Boot runs on port `8080`, the browser will block requests unless you explicitly allow them in `CorsConfig.java`. This is one of the first things to configure.

---

## 6. How Spring AI (RAG) Works — Simple Explanation

RAG = **Retrieval-Augmented Generation**. Instead of the AI making up answers, it first searches your documents, finds the relevant section, and then writes an answer based only on that.

```
Step 1 — Ingestion (done ONCE at startup or via API):
  PDF/Markdown → Split into chunks → Generate embeddings → Store in PgVector

Step 2 — Query (every user question):
  User question → Generate query embedding → Search PgVector for similar chunks
       │
       ▼
  Top 3 matching chunks retrieved
       │
       ▼
  Gemini/OpenAI called with: "Using ONLY this context: [chunks], answer: [question]"
       │
       ▼
  Grounded answer with source citations returned to user
```

Spring AI does Steps 1 and 2 with very few lines of code. You configure the vector store, and Spring AI provides a `VectorStore` bean you inject and use.

---

## 7. Key Maven Dependencies (pom.xml)

These are the libraries you will add to `pom.xml` — no manual downloading needed:

```xml
<!-- Spring Boot starters -->
spring-boot-starter-web           ← REST API support
spring-boot-starter-data-jpa      ← Talk to PostgreSQL with Java objects
spring-boot-starter-security      ← Authentication/JWT
spring-boot-starter-validation    ← Input validation (@NotNull, @Size, etc.)

<!-- Database -->
postgresql                        ← PostgreSQL JDBC driver
spring-ai-pgvector-store-spring-boot-starter  ← PgVector integration

<!-- Spring AI — choose ONE AI provider -->
spring-ai-openai-spring-boot-starter           ← If using OpenAI/Gemini-compatible endpoint
spring-ai-google-vertexai-gemini-spring-boot-starter ← If using Gemini directly

<!-- Utilities -->
lombok                            ← Reduces boilerplate (@Getter, @Setter, @Builder)
```

---

## 8. Configuration File (`application.yml`)

```yaml
server:
  port: 8080

spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/shopsmart
    username: ${DB_USERNAME:shopsmart}
    password: ${DB_PASSWORD:shopsmart}
  jpa:
    hibernate:
      ddl-auto: update        # auto-creates/updates tables — use 'validate' in production
    show-sql: true            # prints SQL queries to console — very useful for debugging
  ai:
    openai:
      api-key: ${OPENAI_API_KEY}   # Set as environment variable, never hardcode

cors:
  allowed-origins: http://localhost:5173   # React frontend URL
```

> [!IMPORTANT]
> **Never commit API keys or passwords to GitHub.** Use environment variables or a `.env` file that is listed in `.gitignore`.

---

## 9. Local Development — How to Start Everything

### Step 1 — Start the Database (Docker)
```bash
# Navigate to backend folder
cd backend

# Start PostgreSQL + PgVector in Docker (runs in background)
docker compose up -d

# What this does: Starts a PostgreSQL database with PgVector extension
# in a container named "shopsmart-db" on port 5432.
# The -d flag means "detached" (runs in background).
```

### Step 2 — Set Environment Variables (one-time setup)
```bash
# In your terminal, set these before starting the backend
export OPENAI_API_KEY="your-key-here"
export DB_USERNAME="shopsmart"
export DB_PASSWORD="shopsmart"
```

### Step 3 — Start the Backend
```bash
cd backend

# This compiles all Java code and starts the Spring Boot server
./mvnw spring-boot:run

# The server is ready when you see: "Started ShopSmartApplication in X seconds"
# It will be running at: http://localhost:8080
```

### Step 4 — Start the Frontend (different terminal)
```bash
cd frontend
npm run dev

# React app will be at: http://localhost:5173
```

> [!TIP]
> Open **two separate terminal windows** — one for backend, one for frontend. Both must be running at the same time during development.

---

## 10. Prerequisites — What Must Be Installed Before Coding

| Prerequisite | Status | Action Required |
|---|---|---|
| Java 17 | ✅ Ready | Nothing |
| Maven 3.10 | ❌ **MISSING** | Install immediately (see below) |
| Docker Desktop | ⚠️ Installed | **Start the Docker Desktop app** from Applications |
| PostgreSQL | 🐳 Via Docker | No separate install needed |
| An AI API Key | ❓ Unknown | Obtain from Google AI Studio (Gemini) or OpenAI |
| Git | ✅ Ready | Nothing |
| Node.js + npm | ✅ Ready | Nothing |

### Install Maven (most urgent fix)
```bash
# Option A: Using Homebrew (recommended, easiest)
brew install maven

# Verify it worked:
mvn -v
# Expected: Apache Maven 3.x.x

# Option B: The Maven Wrapper (alternative — no install needed)
# When you create the Spring Boot project via Spring Initializr,
# it includes ./mvnw — a self-contained Maven that downloads itself.
# Use ./mvnw instead of mvn for all commands.
```

### Get an AI API Key (pick ONE)
- **Gemini (recommended for hackathon):** Go to [aistudio.google.com](https://aistudio.google.com) → Get API Key. Free tier available.
- **OpenAI:** Go to [platform.openai.com](https://platform.openai.com) → API Keys. Requires billing.

> [!WARNING]
> Do not embed the API key in `application.yml`. Always load it from an environment variable. If the key is accidentally committed to GitHub, revoke it immediately.

---

## 11. Team GitHub Workflow

```
main branch          ← stable, working code only
  └── feature/product-catalogue    ← teammate 1
  └── feature/order-tracking       ← teammate 2
  └── feature/ai-shopping          ← your branch (backend AI)
  └── feature/rag-policy           ← your branch (RAG)
  └── feature/frontend-ui          ← frontend team
```

**Daily workflow:**
```bash
git checkout -b feature/your-feature-name   # create your branch
# ... make changes ...
git add .
git commit -m "feat: add product search endpoint"
git push origin feature/your-feature-name   # push to GitHub
# Create a Pull Request on GitHub → teammate reviews → merge to main
```

---

## 12. What to Tell Judges (Your Contribution Summary)

> *"I designed and implemented the backend architecture using Java 17 and Spring Boot 3. I defined the PostgreSQL schema with PgVector extension for AI vector search. I built the REST API endpoints for product catalogue, order tracking, and both AI modules. For the AI Shopping Assistant, I used Spring AI to call a large language model with a structured prompt that extracts budget and preferences from natural language. For the Policy Assistant, I implemented a full RAG pipeline — ingesting PDF documents, chunking them, generating embeddings, storing them in PgVector, and retrieving grounded answers with source citations. I also managed the integration between the React frontend and the Spring Boot backend using CORS configuration and a consistent JSON API contract."*

---

## Next Steps (in order)

- [ ] **Step 1:** Install Maven — `brew install maven`
- [ ] **Step 2:** Start Docker Desktop from Applications
- [ ] **Step 3:** Get a Gemini API key from aistudio.google.com
- [ ] **Step 4:** Create the Spring Boot project at start.spring.io with the right dependencies
- [ ] **Step 5:** Set up `docker-compose.yml` for PostgreSQL + PgVector
- [ ] **Step 6:** Create the `products` and `orders` tables and seed test data
- [ ] **Step 7:** Build and test the product catalogue API
- [ ] **Step 8:** Wire up Spring AI and test the shopping assistant
- [ ] **Step 9:** Ingest policy PDFs and test the RAG pipeline
- [ ] **Step 10:** Confirm frontend can call each API endpoint
