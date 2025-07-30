import mongoose from 'mongoose';

const bluetoothDeviceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  deviceId: {
    type: String,
    required: true
  },
  deviceName: {
    type: String,
    required: true
  },
  deviceType: {
    type: String,
    enum: ['smartwatch', 'fitness-band', 'phone', 'tablet', 'health-monitor'],
    default: 'smartwatch'
  },
  brand: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  macAddress: {
    type: String
  },
  firmwareVersion: {
    type: String
  },
  isConnected: {
    type: Boolean,
    default: false
  },
  batteryLevel: {
    type: Number,
    min: 0,
    max: 100,
    default: 100
  },
  signalStrength: {
    type: Number,
    min: 0,
    max: 100,
    default: 100
  },
  lastSync: {
    type: Date,
    default: Date.now
  },
  lastConnected: {
    type: Date
  },
  lastDisconnected: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
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

// Compound index to ensure unique device per user
bluetoothDeviceSchema.index({ userId: 1, deviceId: 1 }, { unique: true });

export default mongoose.model('BluetoothDevice', bluetoothDeviceSchema); 