import { Router } from "express";
import User from "../models/user";
import authMiddleware from "../middleware/authMiddleware";


const router = Router();
router.get('/search', authMiddleware, async (req, res) => {
    const { query } = req.query;
    try {
        const users = await User.find({ username: { $regex: query, $options: 'i' } });
        res.json(users || []);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;