import express from 'express';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/settings', auth, async (req, res) => {
  try {
    res.json(req.user.settings || {});
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/settings', auth, async (req, res) => {
  try {
    req.user.settings = { ...req.user.settings, ...req.body };
    await req.user.save();
    
    res.json({
      message: 'Settings saved successfully',
      settings: req.user.settings
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/export', auth, async (req, res) => {
  try {
    const { format } = req.query;
    
    // For now, return user data as JSON
    const userData = {
      user: req.user.toJSON(),
      exportDate: new Date().toISOString(),
      format: format || 'json'
    };
    
    res.json(userData);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router; 