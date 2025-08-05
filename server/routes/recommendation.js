import express from 'express';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    // For now, return mock recommendations
    const recommendations = {
      workouts: [
        {
          name: 'Full Body Strength',
          duration: 45,
          difficulty: 'Intermediate',
          exercises: ['Squats', 'Push-ups', 'Rows', 'Planks']
        },
        {
          name: 'Cardio Blast',
          duration: 30,
          difficulty: 'Beginner',
          exercises: ['Jumping Jacks', 'Burpees', 'Mountain Climbers']
        }
      ],
      nutrition: {
        dailyCalories: 2000,
        protein: 150,
        carbs: 200,
        fats: 65
      }
    };
    
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router; 