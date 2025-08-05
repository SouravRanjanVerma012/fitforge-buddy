import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fitforge-buddy';
    console.log('Attempting to connect to MongoDB...');
    console.log('MongoDB URI:', mongoURI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')); // Hide credentials in logs
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // 5 second timeout
      socketTimeoutMS: 45000, // 45 second timeout
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    // Don't exit the process, just log the error
    // process.exit(1);
    return null;
  }
};

export default connectDB; 