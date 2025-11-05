import CategoryModel from '../models/Category.models.js'; // adjust path if needed

// /c:/Users/Ignacio-lopez/code/finanzas/controllers/category.controller.js

// Create a new category
class CategoryController {
    constructor() { }

    async createCategory(req, res) {
        try {
            const { name, description } = req.body;
            if (!name || !name.trim()) return res.status(400).json({ message: 'Name is required' });

            const existing = await CategoryModel.findOne({ name: name.trim() });
            if (existing) return res.status(409).json({ message: 'Category already exists' });

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
            const category = await CategoryModel.findById(id);
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
            if (req.body.name) update.name = req.body.name.trim();
            if (req.body.description !== undefined) update.description = req.body.description;

            if (update.name) {
                const dup = await CategoryModel.findOne({ name: update.name, _id: { $ne: id } });
                if (dup) return res.status(409).json({ message: 'Another category with that name exists' });
            }

            const updated = await CategoryModel.findByIdAndUpdate(id, update, { new: true, runValidators: true });
            if (!updated) return res.status(404).json({ message: 'Category not found' });
            return res.json(updated);
        } catch (err) {
            return res.status(500).json({ message: 'Server error', error: err.message });
        }
    }

    // Delete a category
    async deleteCategory(req, res) {
        try {
            const { id } = req.params;
            const deleted = await CategoryModel.findByIdAndDelete(id);
            if (!deleted) return res.status(404).json({ message: 'Category not found' });
            return res.json({ message: 'Category deleted' });
        } catch (err) {
            return res.status(500).json({ message: 'Server error', error: err.message });
        }
    }
}
export default new CategoryController();