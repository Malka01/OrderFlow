
const express = require("express");
const pool = require("../config/db");

const router = express.Router();

// GET /api/products
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, description, price,
              stock_quantity, created_at
       FROM products
       ORDER BY id ASC`
    );

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error("Failed to fetch products:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to retrieve products",
    });
  }
});


router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid product ID",
    });
  }

  try {
    const result = await pool.query(
      `SELECT id, name, description, price,
              stock_quantity, created_at
       FROM products
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Failed to fetch product:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to retrieve product",
    });
  }
});

// POST /api/products
router.post("/", async (req, res) => {
  const { name, description, price, stock_quantity } = req.body;

  // 1. Validate the input
  if (
    typeof name !== "string" ||
    name.trim() === "" ||
    typeof price !== "number" ||
    !Number.isFinite(price) ||
    price < 0 ||
    !Number.isInteger(stock_quantity) ||
    stock_quantity < 0 ||
    (description !== undefined &&
      description !== null &&
      typeof description !== "string")
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid product data",
    });
  }

  try {
    // 2. Save the product safely
    const result = await pool.query(
      `INSERT INTO products
        (name, description, price, stock_quantity)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, description, price,
                 stock_quantity, created_at`,
      [
        name.trim(),
        description ?? null,
        price,
        stock_quantity,
      ]
    );

    // 3. Return the created product
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Failed to create product:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to create product",
    });
  }
});


//Update Product
router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { name, description, price, stock_quantity } = req.body;

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid product ID",
    });
  }

  if (
    typeof name !== "string" ||
    name.trim() === "" ||
    typeof price !== "number" ||
    !Number.isFinite(price) ||
    price < 0 ||
    !Number.isInteger(stock_quantity) ||
    stock_quantity < 0 ||
    (description !== undefined &&
      description !== null &&
      typeof description !== "string")
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid product data",
    });
  }

  try {
    const result = await pool.query(
      `UPDATE products
       SET name = $1,
           description = $2,
           price = $3,
           stock_quantity = $4
       WHERE id = $5
       RETURNING id, name, description, price,
                 stock_quantity, created_at`,
      [
        name.trim(),
        description ?? null,
        price,
        stock_quantity,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Failed to update product:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to update product",
    });
  }
});

//Delete Product
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid product ID",
    });
  }

  try {
    const result = await pool.query(
      `DELETE FROM products
       WHERE id = $1
       RETURNING id, name`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Failed to delete product:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to delete product",
    });
  }
});




module.exports = router;
