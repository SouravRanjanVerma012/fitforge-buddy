import express from 'express';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    res.json({ workoutPlan: null });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    res.json({
      message: 'Workout plan saved successfully',
      workoutPlan: { ...req.body.plan, userId: req.user._id }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/', auth, async (req, res) => {
  try {
    res.json({ message: 'Workout plan deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router; 