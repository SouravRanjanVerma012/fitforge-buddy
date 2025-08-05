import express from 'express';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    res.json({ currentWorkout: [] });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    res.json({
      message: 'Current workout saved successfully',
      currentWorkout: req.body.session
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/', auth, async (req, res) => {
  try {
    res.json({ message: 'Current workout cleared successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router; 