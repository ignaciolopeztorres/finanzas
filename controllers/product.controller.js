import Product from '../models/product.model.js';

class ProductController {
    constructor() {}
    // Get all products
    async getProducts(req, res) {
        try {
            const products = await Product.findAll();
            if (products.length === 0) {
                return res.status(200

                ).json({ message: 'No products found' });
            }
            res.status(200).json({ products });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    // Get single product
    async getProductById(req, res) {
        try {
            const product = await Product.findByPk(req.params.id);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.status(200).json(product);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    // Create new product
    async createProduct(req, res) {
        try {
            const { name, description, quantity } = req.body;
            const product = await Product.create({ name, description, quantity });
            res.status(201).json(product);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    // Update product
    async updateProduct(req, res) {
        try {
            const { id } = req.params;
            const { name, description, quantity } = req.body;
            const product = await Product.update(
                { name, description, quantity },
                { where: { idProduct: id } },
                { new: true }
            );
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.status(200).json({ message: 'Product updated successfully', product });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    // Delete product
    async deleteProduct(req, res) {
        try {
            const id = req.params.id;
            const product = await Product.destroy({ where: { idProduct: id } });
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.status(200).json({ message: 'Product deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default new ProductController();