import CategoryModel from '../models/Category.model.js';

class CategoryRepository {
    constructor() {}

    async createCategory(data) {
        try {
            const category = await CategoryModel.create(data);
            return category;
        } catch (err) {
            throw new Error('Error creating category: ' + err.message);
        }
    }

    async getCategories() {
        try {
            const categories = await CategoryModel.findAll();
            return categories;
        } catch (err) {
            throw new Error('Error fetching categories: ' + err.message);
        }
    }

    async getCategoryById(id) {
        try {
            const category = await CategoryModel.findOne({
                where: {
                    idCategory: id
                }
            });
            return category;
        } catch (err) {
            throw new Error('Error fetching category by id: ' + err.message);
        }
    }

    async updateCategory(id, data) {
        try {
            const category = await CategoryModel.findOne({
                where: {
                    idCategory: id
                }
            });
            if (!category) {
                throw new Error('Category not found');
            }
            await CategoryModel.update(data, {
                where: {
                    idCategory: id
                }
            });
            return await CategoryModel.findOne({
                where: {
                    idCategory: id
                }
            });
        } catch (err) {
            throw new Error('Error updating category: ' + err.message);
        }
    }

    async deleteCategory(id) {
        try {
            const category = await CategoryModel.findOne({
                where: {
                    idCategory: id
                }
            });
            if (!category) {
                throw new Error('Category not found');
            }
            await CategoryModel.destroy({
                where: {
                    idCategory: id
                }
            });
            return category;
        } catch (err) {
            throw new Error('Error deleting category: ' + err.message);
        }
    }
}

export default new CategoryRepository();