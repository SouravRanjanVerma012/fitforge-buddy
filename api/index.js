import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import connectDB from '../server/config/database.js';
import authRoutes from '../server/routes/auth.js';
import workoutRoutes from '../server/routes/workouts.js';
import formCheckRoutes from '../server/routes/formCheck.js';
import workoutPlanRoutes from '../server/routes/workoutPlans.js';
import currentWorkoutRoutes from '../server/routes/currentWorkout.js';
import userPreferenceRoutes from '../server/routes/userPreferences.js';
import bluetoothDeviceRoutes from '../server/routes/bluetoothDevices.js';
import userRoutes from '../server/routes/users.js';
import recommendationRoutes from '../server/routes/recommendation.js';

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://your-app-name.vercel.app'] 
    : ['http://localhost:8080', 'http://localhost:8081', 'http://localhost:8082', 'http://localhost:8083', 'http://localhost:8084', 'http://localhost:8085', 'http://localhost:8086', 'http://localhost:8087', 'http://localhost:8088', 'http://localhost:8089', 'http://localhost:8090'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/form-check', formCheckRoutes);
app.use('/api/workout-plans', workoutPlanRoutes);
app.use('/api/current-workout', currentWorkoutRoutes);
app.use('/api/user-preferences', userPreferenceRoutes);
app.use('/api/bluetooth', bluetoothDeviceRoutes);
app.use('/api/user', userRoutes);
app.use('/api/recommendation', recommendationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'FitForge Buddy API is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Export for Vercel serverless functions
export default app; 