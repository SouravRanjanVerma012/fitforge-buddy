import mongoose from 'mongoose';

const syncSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  deviceId: {
    type: String,
    required: true
  },
  deviceName: {
    type: String,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'failed', 'cancelled'],
    default: 'in-progress'
  },
  dataPoints: {
    type: Number,
    default: 0
  },
  bytesTransferred: {
    type: Number,
    default: 0
  },
  syncType: {
    type: String,
    enum: ['full', 'incremental'],
    default: 'incremental'
  },
  syncErrors: [{
    timestamp: { type: Date, default: Date.now },
    message: String,
    code: String
  }],
  healthDataCount: {
    type: Number,
    default: 0
  },
  workoutDataCount: {
    type: Number,
    default: 0
  },
  sleepDataCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
syncSessionSchema.index({ userId: 1, startTime: -1 });
syncSessionSchema.index({ deviceId: 1, startTime: -1 });
syncSessionSchema.index({ status: 1 });

export default mongoose.model('SyncSession', syncSessionSchema); 