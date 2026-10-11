
require("dotenv").config();

const request = require("supertest");
const app = require("../app");
const pool = require("../config/db");

describe("Products API", () => {
  let testProductId;

  afterAll(async () => {
    // Remove only the product created by this test
    if (testProductId) {
      await pool.query(
        "DELETE FROM products WHERE id = $1",
        [testProductId]
      );
    }

    await pool.end();
  });

  test("GET /api/products returns a list", async () => {
    const response = await request(app).get("/api/products");

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  test("POST /api/products creates a product", async () => {
    const response = await request(app)
      .post("/api/products")
      .send({
        name: "Jest Test Product",
        description: "Created by automated test",
        price: 100,
        stock_quantity: 5,
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.name).toBe("Jest Test Product");

    testProductId = response.body.data.id;
  });

  test("POST /api/products rejects invalid data", async () => {
    const response = await request(app)
      .post("/api/products")
      .send({
        name: "",
        price: -10,
        stock_quantity: -1,
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
  });

  test("GET /api/products/:id returns 404 for a missing product", async () => {
    const response = await request(app)
      .get("/api/products/999999999");

    expect(response.statusCode).toBe(404);
    expect(response.body.success).toBe(false);
  });

  
test("PUT /api/products/:id updates a product", async () => {
  expect(testProductId).toBeDefined();

  const response = await request(app)
    .put(`/api/products/${testProductId}`)
    .send({
      name: "Updated Jest Test Product",
      description: "Updated by automated test",
      price: 150,
      stock_quantity: 8,
    });

  expect(response.statusCode).toBe(200);
  expect(response.body.success).toBe(true);
  expect(response.body.data.name).toBe(
    "Updated Jest Test Product"
  );
  expect(Number(response.body.data.price)).toBe(150);
});

test("GET /api/products/:id rejects an invalid ID", async () => {
  const response = await request(app)
    .get("/api/products/abc");

  expect(response.statusCode).toBe(400);
  expect(response.body.success).toBe(false);
});

test("DELETE /api/products/:id deletes the test product", async () => {
  expect(testProductId).toBeDefined();

  const response = await request(app)
    .delete(`/api/products/${testProductId}`);

  expect(response.statusCode).toBe(200);
  expect(response.body.success).toBe(true);

  const checkResponse = await request(app)
    .get(`/api/products/${testProductId}`);

  expect(checkResponse.statusCode).toBe(404);
});

});
