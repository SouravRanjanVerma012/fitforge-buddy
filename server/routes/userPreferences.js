import express from 'express';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    res.json({ preferences: req.user.preferences || {} });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { key, value } = req.body;
    req.user.preferences.set(key, value);
    await req.user.save();
    
    res.json({
      message: 'Preference saved successfully',
      preferences: req.user.preferences
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:key', auth, async (req, res) => {
  try {
    const value = req.user.preferences.get(req.params.key);
    res.json({ value });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router; 