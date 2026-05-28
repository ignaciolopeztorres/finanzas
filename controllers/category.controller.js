import CategoryModel from '../models/Category.models.js'; // adjust path if needed

// /c:/Users/Ignacio-lopez/code/finanzas/controllers/category.controller.js

// Create a new category
class CategoryController {
    constructor() { }

    async createCategory(req, res) {
        try {
            const { name, description } = req.body;
            console.log(req.body);
            console.log('name:', name.trim());
            if (!name || !name.trim()) return res.status(400).json({ message: 'Name is required' });

            const existing = await CategoryModel.findOne({ where: { name: name.trim() } });
            if (existing) return res.status(409).json({ message: 'Category already exists', existing: existing.name });

            const category = new CategoryModel({ name: name.trim(), description });
            await category.save();
            return res.status(201).json(category);
        } catch (err) {
            return res.status(500).json({ message: 'Server error', error: err.message });
        }
    }

    // Get list of categories (supports pagination & search)
    async getCategories(req, res) {
        try {

            const items = await CategoryModel.findAll();
            /**
             * // Pagination and search can be implemented here in the future
             */
            /**
             * // Example for future implementation:
             * const page = parseInt(req.query.page) || 1;
             * const limit = parseInt(req.query.limit) || 10;
             * const search = req.query.search || '';
             * const query = search ? { name: { $regex: search, $options: 'i' } } : {};
             * const items = await CategoryModel.find(query)
             *     .skip((page - 1) * limit)
             *     .limit(limit);
             *  const total = await CategoryModel.countDocuments(query);
             *  //const totalPages = Math.ceil(total / limit);
             *  //return res.json({ total, totalPages, items });
             *  //return res.json({ total, items });
             *  //return res.json({ items });
             */
            const total = items.length;

            return res.json({
                total,
                items
            });
        } catch (err) {
            return res.status(500).json({ message: 'Server error getCategories', error: err.message });
        }
    }

    // Get a single category by id
    async getCategoryById(req, res) {
        try {
            const { id } = req.params;
            const category = await CategoryModel.findOne({ where: { idCategory: id } });
            if (!category) return res.status(404).json({ message: 'Category not found' });
            return res.json(category);
        } catch (err) {
            return res.status(500).json({ message: 'Server error', error: err.message });
        }
    }

    // Update a category
    async updateCategory(req, res) {
        try {
            const { id } = req.params;
            const update = {};

            // Only update fields that are provided
            if (req.body.name) update.name = req.body.name.trim();
            if (req.body.description !== undefined) update.description = req.body.description;
            
            // Check if category exists
            const dup = await CategoryModel.findOne({ where: { idCategory: id } });
            if (!dup) return res.status(404).json({ message: 'Category not found' });

            // Update the category
            const updateCategory = await CategoryModel.update(update, { where: { idCategory: id } });
            //const updatedCategory = await CategoryModel.findOne({ where: { idCategory: id } });
            return res.json({ name: 'Updated Category', updateCategory });

        } catch (err) {
            return res.status(500).json({ message: 'Server error', error: err.message });
        }
    }

    // Delete a category
    async deleteCategory(req, res) {
        try {
            const { id } = req.params;
            // Check if category exists
            const deleted = await CategoryModel.findOne({ where: { idCategory: id } });
            if (!deleted) return res.status(404).json({ message: 'Category not found' });
            // Delete the category
            const del = await CategoryModel.destroy({ where: { idCategory: id } });
            return res.json({ message: 'Category deleted', deleted: deleted });
        } catch (err) {
            return res.status(500).json({ message: 'Server error', error: err.message });
        }
    }
}
export default new CategoryController();