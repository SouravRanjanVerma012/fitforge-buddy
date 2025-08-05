import express from 'express';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all workouts for user
router.get('/', auth, async (req, res) => {
  try {
    // For now, return empty array - you can add workout model later
    res.json({ workouts: [] });
  } catch (error) {
    console.error('Get workouts error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Save workout session
router.post('/', auth, async (req, res) => {
  try {
    const { session } = req.body;
    
    // For now, just return success - you can add workout model later
    res.json({
      message: 'Workout saved successfully',
      workout: { session, userId: req.user._id }
    });
  } catch (error) {
    console.error('Save workout error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router; 