import express from 'express';

const router = express.Router();

// Replace with your actual controller import
import categoryController from '../controllers/category.controller.js';
//
// Example controller shape expected:
// categoryController = {
//   list: async (req, res) => {},
//   get: async (req, res) => {},
//   create: async (req, res) => {},
//   update: async (req, res) => {},
//   remove: async (req, res) => {}
// };

/*
    Routes:
    GET    /           - list categories
    GET    /:id        - get category by id
    POST   /           - create category
    PUT    /:id        - update category
    DELETE /:id        - delete category
*/

// List categories
router.get('/', categoryController.getCategories);

// Get by id
router.get('/:id', categoryController.getCategoryById);

// Create
router.post('/', categoryController.createCategory);

// Update
router.put('/:id', categoryController.updateCategory);

// Delete
router.delete('/:id', categoryController.deleteCategory);

export default router;