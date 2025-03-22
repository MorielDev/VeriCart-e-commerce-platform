import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from './models/User.js'; 
import authMiddleware from './middleware/authMiddleware.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

dotenv.config();  // Load environment variables

const app = express();
app.use(express.json());
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);


mongoose.connect(process.env.MONGO_URI, {
}).then(() => console.log("Connected to MongoDB"))
.catch(err => console.log("MongoDB Connection Error:", err));

app.get('/', (req, res) => {
    res.send('Welcome to the Server! 🚀');
});

app.get('/dashboard', authMiddleware, async (req, res) => {
    res.json({ message:`Welcome to your dashboard, user ${req.user.id}!`})
})

app.get('/profile', authMiddleware, async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    res.json({ username: user.username, email: user.email });
});


// Register Route
app.post('/register', async (req, res) => {  
    const { username, email, password } = req.body;

    console.log ("Recieved Data:", req.body);
    if (!password) {
        return res.status(400).json({ message: "Password is required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
    
});

// Login Route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, message: "Login successful!" });
});

try {
} catch (error) {
    res.status(500).json({ error: 'Login failed' });
    }
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
