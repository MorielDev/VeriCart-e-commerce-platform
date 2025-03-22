import express from 'express';
import Order from '../models/Order.js';
import amqp from 'amqplib';
import Product from '../models/Product.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://rabbitmq';

// Function to publish messages to RabbitMQ
const sendToQueue = async (queue, message) => {
    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();
        await channel.assertQueue(queue, { durable: true });

        channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
        console.log(`✅ Message sent to queue: ${queue}`, message);

        setTimeout(() => connection.close(), 500); // Close connection after a short delay
    } catch (error) {
        console.error('❌ Error sending message to RabbitMQ:', error);
    }
};

// GET: User's Order History (Only logged-in users)
router.get('/my-orders', authMiddleware, async (req, res) => {
    const orders = await Order.find({ user: req.user.id }).populate('products.productId', 'name price');
    res.json(orders);
});

// POST: Place a new order (Now publishing to RabbitMQ)
router.post('/', authMiddleware, async (req, res) => {
    try {
        console.log("FULL REQUEST BODY:", req.body);  // Debugging Step

        if (!req.body || typeof req.body !== 'object') {
            console.log(" Request body is missing or not an object");
            return res.status(400).json({ message: "Invalid request body" });
        }

        if (!req.body.products || !Array.isArray(req.body.products) || req.body.products.length === 0) {
            console.log(" No products found in request!");
            return res.status(400).json({ message: "No products in order" });
        }

        const { products } = req.body;
        let totalPrice = 0;

        for (const item of products) {
            console.log(` Checking Product: ${item.productId}`);  // Debugging Step

            const product = await Product.findById(item.productId);
            if (!product) {
                console.log(` Product ${item.productId} not found!`);
                return res.status(404).json({ message: `Product ${item.productId} not found` });
            }

            totalPrice += product.price * item.quantity;
        }

        console.log(" All Products Verified. Creating Order...");

        const newOrder = new Order({
            user: req.user.id,
            products,
            totalPrice
        });

        await newOrder.save();
        console.log(" Order Placed Successfully!");

        // Publish order to RabbitMQ
        await sendToQueue('order_notifications', {
            orderId: newOrder._id,
            userId: req.user.id,
            products,
            totalPrice,
            status: "pending"
        });

        res.status(201).json({ message: "Order placed successfully!", order: newOrder });
    } catch (error) {
        console.error("❌ Error Placing Order:", error);
        res.status(500).json({ message: "Error placing order", error: error.message });
    }
});

// GET: Admin - View all orders
router.get('/', authMiddleware, async (req, res) => {
    const orders = await Order.find().populate('user', 'email');
    res.json(orders);
});

// PUT: Update order status (Admin Only)
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
