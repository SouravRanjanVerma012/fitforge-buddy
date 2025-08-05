import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Register user
router.post('/register', async (req, res) => {
  try {
    // Check if database is connected
    if (!req.dbConnected) {
      return res.status(503).json({ error: 'Database not connected. Please try again later.' });
    }

    const { name, email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create new user
    user = new User({
      name,
      email,
      password
    });

    await user.save();

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'User registered successfully',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    // Check if database is connected
    if (!req.dbConnected) {
      return res.status(503).json({ error: 'Database not connected. Please try again later.' });
    }

    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    // Check if database is connected
    if (!req.dbConnected) {
      return res.status(503).json({ error: 'Database not connected. Please try again later.' });
    }

    res.json({ user: req.user.toJSON() });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

export default router; 