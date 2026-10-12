# OrderFlow — Product Management REST API

OrderFlow is a backend REST API built with **Node.js, Express.js, and PostgreSQL** for managing product inventory. It provides CRUD (Create, Read, Update, Delete) operations, request validation, database integration, automated testing, and containerized development.

The project demonstrates practical backend engineering skills, including REST API design, SQL query safety, Docker, and Continuous Integration (CI).

## Features

- RESTful API for product management
- Create, retrieve, update, and delete products
- Retrieve all products or a single product by ID
- Request validation and meaningful HTTP status codes
- Parameterized SQL queries to help prevent SQL injection
- PostgreSQL database integration
- Automated API tests using Jest and Supertest
- Docker and Docker Compose support
- GitHub Actions CI workflow
- Health-check endpoint

## Technology Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | REST API framework |
| PostgreSQL | Relational database |
| `pg` | PostgreSQL client for Node.js |
| Jest | Automated testing |
| Supertest | HTTP endpoint testing |
| Docker | Application containerization |
| Docker Compose | Local multi-container development |
| GitHub Actions | Continuous Integration |
| Neon PostgreSQL | Planned hosted database for deployment |
| Vercel | Planned API hosting |

## Project Structure

```text
OrderFlow/
├── .github/
│   └── workflows/
│       └── ci.yml
├── db/
│   └── schema.sql
├── src/
│   ├── config/
│   │   ├── db.js
│   │   └── test-db.js
│   ├── routes/
│   │   ├── health.routes.js
│   │   └── product.routes.js
│   ├── tests/
│   │   ├── health.test.js
│   │   ├── products.test.js
│   │   └── setup-env.js
│   ├── app.js
│   └── server.js
├── .dockerignore
├── .gitignore
├── compose.yaml
├── Dockerfile
├── package.json
└── package-lock.json
```

## Prerequisites

Install the following tools before running the project:

- [Node.js](https://nodejs.org/) — compatible with Node.js 22
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Git](https://git-scm.com/)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Malka01/OrderFlow.git
cd OrderFlow
```

### 2. Configure environment variables

Create a `.env` file in the project root.

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5433
DB_NAME=orderflow
DB_USER=orderflow_user
DB_PASSWORD=your_local_database_password
```

Replace the example password with your own local development password. Never commit `.env` or real credentials to GitHub.

### 3. Start the application with Docker Compose

Ensure Docker Desktop is running, then execute:

```bash
docker compose up --build -d
```

This starts the API and PostgreSQL containers.

Check the container status:

```bash
docker compose ps
```

View the API logs:

```bash
docker compose logs -f api
```

### 4. Verify the API

Open the following URL in your browser or API client:

```text
http://localhost:3000/api/health
```

Expected response:

```json
{
  "success": true,
  "message": "OrderFlow API is running"
}
```

### 5. Run locally without Docker (optional)

If you have a compatible PostgreSQL instance running and configured your environment variables:

```bash
npm ci
npm start
```

For development with automatic restarts:

```bash
npm run dev
```

## API Endpoints

Base URL: `http://localhost:3000`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Check API health |
| GET | `/api/products` | Retrieve all products |
| GET | `/api/products/:id` | Retrieve one product |
| POST | `/api/products` | Create a product |
| PUT | `/api/products/:id` | Update a product |
| DELETE | `/api/products/:id` | Delete a product |

### Create a Product

**Request**

```http
POST /api/products
Content-Type: application/json
```

```json
{
  "name": "Wireless Mouse",
  "description": "Wireless mouse with USB receiver",
  "price": 2500.00,
  "stock_quantity": 20
}
```

**Success response:** `201 Created`

The API returns the created product and a success message.

### Retrieve Products

```http
GET /api/products
```

Returns a JSON response containing the product count and product data.

### Update a Product

```http
PUT /api/products/1
Content-Type: application/json
```

```json
{
  "name": "Wireless Mouse Pro",
  "description": "Updated wireless mouse",
  "price": 3200.00,
  "stock_quantity": 15
}
```

### Delete a Product

```http
DELETE /api/products/1
```

Deletes the product with ID `1` if it exists.

## Validation and Error Handling

The API validates product input before executing database operations.

- Product names must be non-empty strings.
- Prices must be finite, non-negative numbers.
- Stock quantities must be non-negative integers.
- Product IDs must be positive integers.
- Invalid input returns `400 Bad Request`.
- Missing products return `404 Not Found`.
- Successful creation returns `201 Created`.
- Unexpected database errors return `500 Internal Server Error`.

SQL queries use parameterized values rather than directly inserting user input into SQL statements.

## Database Schema

The schema is maintained in `db/schema.sql`.

The `products` table includes:

| Column | Type | Description |
|---|---|---|
| `id` | Integer identity | Primary key |
| `name` | `VARCHAR(255)` | Product name |
| `description` | `TEXT` | Optional product description |
| `price` | `NUMERIC(10,2)` | Product price |
| `stock_quantity` | `INTEGER` | Available inventory |
| `created_at` | `TIMESTAMPTZ` | Creation timestamp |

The schema includes database constraints to prevent negative prices and stock quantities.

## Running Tests

Install dependencies:

```bash
npm ci
```

Run the automated test suite:

```bash
npm test
```

Tests require the test database and environment to be configured correctly. Use a separate test database, such as `orderflow_test`, rather than your development or production database.

## Continuous Integration

The GitHub Actions workflow is maintained under `.github/workflows/ci.yml`.

The CI pipeline runs automated tests against PostgreSQL when configured push and pull-request events occur on the `master` branch. It can also be triggered manually if the workflow supports it.

This helps verify that code changes do not break existing functionality.

## Docker Commands

Start the application:

```bash
docker compose up --build -d
```

Stop the containers:

```bash
docker compose down
```

View container status:

```bash
docker compose ps
```

View API logs:

```bash
docker compose logs -f api
```

Restart the API:

```bash
docker compose restart api
```

The named PostgreSQL volume preserves database data when containers are stopped or recreated. Do not remove the volume unless you intentionally want to delete its stored data.

## Deployment

The project is being prepared for hosted deployment using a Node.js-compatible hosting platform and managed PostgreSQL.

Planned deployment components:

- **API hosting:** Vercel
- **Database hosting:** Neon PostgreSQL
- **Environment configuration:** Platform-managed environment variables
- **Database initialization:** `db/schema.sql`

The public API URL and deployment status will be added here after the deployment has been completed and verified.

## Security Considerations

- Store credentials in environment variables.
- Never commit `.env` files or production secrets.
- Use parameterized SQL queries.
- Validate incoming request data.
- Keep production and test databases separate.
- Use HTTPS for public production traffic.
- Configure database access and credentials according to the hosting provider's security recommendations.

## Future Improvements

- Add pagination, filtering, and sorting to product listing.
- Add authentication and role-based authorization.
- Introduce database migrations.
- Add structured logging and monitoring.
- Improve API documentation with Swagger/OpenAPI.
- Add integration tests for more error cases.
- Add rate limiting and additional production security controls.
- Complete and document the public deployment.

## Author

**Malka Sandaruwan**

GitHub: [Malka01](https://github.com/Malka01)

---

*OrderFlow is a portfolio project demonstrating practical backend development, REST API design, PostgreSQL integration, containerization, and CI/CD fundamentals.*