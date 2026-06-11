import { Router } from "express";
import { validate } from "../../middlewares";
import * as productsController from "./products.controller";
import { createProductSchema } from "./dto/create-products.dto";
import { updateProductSchema } from "./dto/update-products.dto";

const router = Router();

/**
 * @route   GET /api/v1/products
 * @desc    Get all products
 */
router.get("/", productsController.getAllProducts);

/**
 * @route   GET /api/v1/products/:id
 * @desc    Get a single product by ID
 */
router.get("/:id", productsController.getProductById);

/**
 * @route   POST /api/v1/products
 * @desc    Create a new product
 */
router.post(
  "/",
  validate(createProductSchema, "body"),
  productsController.createProduct
);

/**
 * @route   PATCH /api/v1/products/:id
 * @desc    Update a product
 */
router.patch(
  "/:id",
  validate(updateProductSchema, "body"),
  productsController.updateProduct
);

/**
 * @route   DELETE /api/v1/products/:id
 * @desc    Delete a product
 */
router.delete("/:id", productsController.deleteProduct);

export default router;
