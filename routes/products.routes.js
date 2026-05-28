import express from 'express';
/**
 * Product Model
 */
import Product from "../models/product.model.js";
import ProductController from "../controllers/product.controller.js";

const router = express.Router();

// Get all products
router.get("/", ProductController.getProducts);
// Get single product
router.get("/:id", ProductController.getProductById);
// Create new product
router.post("/", ProductController.createProduct);
// Update product
router.put("/:id", ProductController.updateProduct);    
// Delete product
router.delete("/:id", ProductController.deleteProduct); 
export default router;