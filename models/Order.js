import mongoose from 'mongoose';
import User from './User.js';

const OrderSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        ref: User 
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',  // References the Product model
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1  // Ensures at least 1 item is ordered
            }
        }
    ], 

    totalPrice: { 
        type: Number, 
        required: true 
    },
    status: {
        type: String,
        enum: ['Pending', 'Shipped', 'Delivered'],  // Restricts values
        default: 'Pending'  //  All new orders start as "Pending"
    },
    createdAt: { 
        type:Date, 
        default: Date.now
    }
});

const Order = mongoose.model('Order', OrderSchema);
export default Order;
