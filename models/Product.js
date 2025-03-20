import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true
    },
    price: { 
        type: Number, 
        required: true, 
        min: 0
    },
    description: { 
        type: String,
        required: true 
    },
    stock: { 
        type: Number, 
        required: true,
        min: 0
    },
    createdAt: { 
        type: Date, 
        required: true,
        default: Date.now
    }
});

const Product = mongoose.model('Product', ProductSchema);
export default Product;
