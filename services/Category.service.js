import CategoryRepository from '../repositories/Category.repository.js';

class CategoryService {
    constructor() {
        this.categoryRepository = CategoryRepository;
    }

    async createCategory(data) {
        try {
            const category = await this.categoryRepository.createCategory(data);
            return category;
        } catch (err) {
            throw new Error('Error creating category: ' + err.message);
        }
    }

    async getCategories() {
        try {
            const categories = await this.categoryRepository.getCategories();
            return categories;
        } catch (err) {
            throw new Error('Error fetching categories: ' + err.message);
        }
    }

    async getCategoryById(id) {
        try {
            const category = await this.categoryRepository.getCategoryById(id);
            return category;
        } catch (err) {
            throw new Error('Error fetching category by id: ' + err.message);
        }
    }

    async updateCategory(id, data) {
        try {
            const category = await this.categoryRepository.updateCategory(id, data);
            return category;
        } catch (err) {
            throw new Error('Error updating category: ' + err.message);
        }
    }

    async deleteCategory(id) {
        try {
            const category = await this.categoryRepository.deleteCategory(id);
            return category;
        } catch (err) {
            throw new Error('Error deleting category: ' + err.message);
        }
    }
}

export default new CategoryService();