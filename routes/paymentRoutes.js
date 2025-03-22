import express from 'express';
import Order from '../models/Order.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        console.log(" Payment Request Body:", req.body);  // Debugging Step

        const { orderId, paymentMethod } = req.body;
        if (!orderId || !paymentMethod) {
            return res.status(400).json({ message: "Order ID and payment method are required" });
        }

        // Fetch the order from the database
            const order = await Order.findById(orderId);
            if (!order) {
                return res.status(404).json({ message: "Order not found" });
                }
            if (order.status !== "Pending") {
                return res.status(400).json({ message: "Order has already been paid or processed" });
                }

        // Simulate a payment transaction
        const isPaymentSuccessful = Math.random() > 0.3; // 70% chance of success

        // Update order status if payment is successful
        if (isPaymentSuccessful) {
            order.status = "Paid";
            await order.save();
            return res.json({ message: "Payment successful", order });
        } else {
            return res.status(400).json({ message: "Payment failed. Try again." });
        }


    } catch (error) {
        console.error(" Error Processing Payment:", error);
        res.status(500).json({ message: "Error processing payment" });
    }
});
export default router;