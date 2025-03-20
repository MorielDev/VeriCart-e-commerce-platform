import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// GET: User's Order History (Only logged-in users)
router.get('/my-orders', authMiddleware, async (req, res) => {
    const orders = await Order.find({ user: req.user.id }).populate('products.productId', 'name price');
    res.json(orders);
});

//  POST: Place a new order
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { products } = req.body;
        let totalPrice = 0;

        for (const item of products) {
            const product = await Product.findById(item.productId);
            if (!product) return res.status(404).json({ message: `Product ${item.productId} not found` });

            totalPrice += product.price * item.quantity;
        }

        const newOrder = new Order({
            user: req.user.id,
            products,
            totalPrice,
        });

        await newOrder.save();
        res.status(201).json({ message: "Order placed successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error placing order" });
    }
});

//  GET: Admin - View all orders
router.get('/', authMiddleware, async (req, res) => {
    const orders = await Order.find().populate('user', 'email');
    res.json(orders);
});

//PUT: Update order status (Admin Only)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: "Order not found" });

        order.status = req.body.status;  // Update status (Pending -> Shipped -> Delivered)
        await order.save();
        res.json({ message: "Order status updated!" });
    } catch (error) {
        res.status(500).json({ message: "Error updating order" });
    }
});

export default router;
