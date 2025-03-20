import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
const token = req.header('Authorization');
if (!token) return res.status(401).json({ error: 'Access denied' });
try {
    // remove bearer
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = decoded;
    next(); // move to the next router
    
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
        }
        };

export default authMiddleware;
