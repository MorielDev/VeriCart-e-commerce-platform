import express from 'express';
import Product from '../models/Product.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// GET all products
router.get('/', async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

//  GET a product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Invalid Product ID" });
    }
});

//  POST: Create a new product (Admin Only)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { name, price, description, stock } = req.body;
        const newProduct = new Product({ name, price, description, stock });
        await newProduct.save();
        res.status(201).json({ message: "Product created successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error creating product" });
    }
});

// Update a product by ID (Admin Only)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: "Error updating product" });
    }
});

// DELETE: Remove a product (Admin Only)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting product" });
    }
});

export default router;
