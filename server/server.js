import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import authRoutes from './routes/auth.js';
import workoutRoutes from './routes/workouts.js';
import formCheckRoutes from './routes/formCheck.js';
import workoutPlanRoutes from './routes/workoutPlans.js';
import currentWorkoutRoutes from './routes/currentWorkout.js';
import userPreferenceRoutes from './routes/userPreferences.js';
import bluetoothDeviceRoutes from './routes/bluetoothDevices.js';
import userRoutes from './routes/users.js';
import recommendationRoutes from './routes/recommendation.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:8081', 'http://localhost:8082', 'http://localhost:8083', 'http://localhost:8084', 'http://localhost:8085', 'http://localhost:8086', 'http://localhost:8087', 'http://localhost:8088', 'http://localhost:8089', 'http://localhost:8090'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Increased from 100 to 1000 requests per 15 minutes
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

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(` Health check: http://localhost:${PORT}/api/health`);
}); 