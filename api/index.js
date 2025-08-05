import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
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

// Connect to MongoDB (don't block the app if it fails)
let dbConnection = null;
let dbConnectionStatus = 'connecting';

// Set a timeout for database connection
const dbConnectionTimeout = setTimeout(() => {
  if (dbConnectionStatus === 'connecting') {
    console.log('⚠️ Database connection timeout, setting status to disconnected');
    dbConnectionStatus = 'disconnected';
  }
}, 10000); // 10 second timeout

// Function to check if database is actually connected
const checkDatabaseConnection = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

connectDB().then(conn => {
  clearTimeout(dbConnectionTimeout);
  dbConnection = conn;
  if (conn) {
    console.log('✅ Database connected successfully');
    dbConnectionStatus = 'connected';
  } else {
    console.log('⚠️ Database connection failed, some features may not work');
    dbConnectionStatus = 'disconnected';
  }
}).catch(err => {
  clearTimeout(dbConnectionTimeout);
  console.error('❌ Failed to connect to MongoDB:', err.message);
  dbConnectionStatus = 'error';
});

// CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Be very permissive for Vercel domains
    if (origin.includes('vercel.app') || 
        origin.includes('sourav2000ranjan-6852s-projects.vercel.app') ||
        origin.includes('fitforge-buddy-main') ||
        origin.includes('localhost')) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
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

// Database connection middleware
app.use(async (req, res, next) => {
  // Check if database is actually connected
  const isConnected = await checkDatabaseConnection();
  req.dbConnected = isConnected || dbConnectionStatus === 'connected';
  next();
});

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
  res.json({ 
    status: 'OK', 
    message: 'FitForge Buddy API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: dbConnectionStatus
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Export for Vercel serverless functions
export default app; 