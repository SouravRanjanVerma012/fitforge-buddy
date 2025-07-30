import express from 'express';
import { auth } from '../middleware/auth.js';
import BluetoothDevice from '../models/BluetoothDevice.js';
import HealthData from '../models/HealthData.js';
import SyncSession from '../models/SyncSession.js';

const router = express.Router();

// Get all paired devices for a user
router.get('/devices', auth, async (req, res) => {
  try {
    const devices = await BluetoothDevice.find({ 
      userId: req.user._id, 
      isActive: true 
    }).sort({ lastSync: -1 });
    
    res.json(devices);
  } catch (error) {
    console.error('Error fetching devices:', error);
    res.status(500).json({ error: 'Failed to fetch devices' });
  }
});

// Pair a new device
router.post('/devices/pair', auth, async (req, res) => {
  try {
    const {
      deviceId,
      deviceName,
      deviceType,
      brand,
      model,
      macAddress,
      firmwareVersion
    } = req.body;

    // Check if device already exists for this user
    const existingDevice = await BluetoothDevice.findOne({
      userId: req.user._id,
      deviceId: deviceId
    });

    if (existingDevice) {
      // Update existing device
      existingDevice.isConnected = true;
      existingDevice.lastConnected = new Date();
      existingDevice.lastSync = new Date();
      await existingDevice.save();
      
      return res.json(existingDevice);
    }

    // Create new device
    const newDevice = new BluetoothDevice({
      userId: req.user._id,
      deviceId,
      deviceName,
      deviceType: deviceType || 'smartwatch',
      brand,
      model,
      macAddress,
      firmwareVersion,
      isConnected: true,
      lastConnected: new Date(),
      lastSync: new Date()
    });

    await newDevice.save();
    res.status(201).json(newDevice);
  } catch (error) {
    console.error('Error pairing device:', error);
    res.status(500).json({ error: 'Failed to pair device' });
  }
});

// Update device connection status
router.put('/devices/:deviceId/status', auth, async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { isConnected, batteryLevel, signalStrength } = req.body;

    const device = await BluetoothDevice.findOne({
      userId: req.user._id,
      deviceId: deviceId
    });

    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }

    device.isConnected = isConnected;
    if (batteryLevel !== undefined) device.batteryLevel = batteryLevel;
    if (signalStrength !== undefined) device.signalStrength = signalStrength;
    
    if (isConnected) {
      device.lastConnected = new Date();
    } else {
      device.lastDisconnected = new Date();
    }

    await device.save();
    res.json(device);
  } catch (error) {
    console.error('Error updating device status:', error);
    res.status(500).json({ error: 'Failed to update device status' });
  }
});

// Unpair/delete a device
router.delete('/devices/:deviceId', auth, async (req, res) => {
  try {
    const { deviceId } = req.params;

    // Soft delete the device
    const device = await BluetoothDevice.findOneAndUpdate(
      { userId: req.user._id, deviceId: deviceId },
      { isActive: false, isConnected: false, lastDisconnected: new Date() },
      { new: true }
    );

    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }

    // Delete all health data for this device
    await HealthData.updateMany(
      { userId: req.user._id, deviceId: deviceId },
      { isActive: false }
    );

    res.json({ message: 'Device unpaired and data deleted successfully' });
  } catch (error) {
    console.error('Error unpairing device:', error);
    res.status(500).json({ error: 'Failed to unpair device' });
  }
});

// Sync health data from device
router.post('/devices/:deviceId/sync', auth, async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { healthData, syncType = 'incremental' } = req.body;

    // Verify device exists and is connected
    const device = await BluetoothDevice.findOne({
      userId: req.user._id,
      deviceId: deviceId,
      isActive: true
    });

    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }

    // Create sync session
    const sessionId = `sync_${Date.now()}_${deviceId}`;
    const syncSession = new SyncSession({
      userId: req.user._id,
      sessionId,
      deviceId,
      deviceName: device.deviceName,
      startTime: new Date(),
      status: 'in-progress',
      syncType
    });

    await syncSession.save();

    let totalDataPoints = 0;
    let healthDataCount = 0;
    let workoutDataCount = 0;
    let sleepDataCount = 0;

    // Process health data
    if (healthData && Array.isArray(healthData)) {
      for (const data of healthData) {
        const { date, timestamp, ...healthMetrics } = data;
        
        // Use timestamp if available, otherwise use date, otherwise use current date
        let dataDate;
        if (timestamp) {
          dataDate = new Date(timestamp);
        } else if (date) {
          dataDate = new Date(date);
        } else {
          dataDate = new Date();
        }
        
        // Validate the date
        if (isNaN(dataDate.getTime())) {
          console.warn('Invalid date received, using current date:', { date, timestamp });
          dataDate = new Date();
        }
        
        dataDate.setHours(0, 0, 0, 0); // Set to start of day

        // Upsert health data (update if exists, insert if not)
        const healthDataDoc = await HealthData.findOneAndUpdate(
          {
            userId: req.user._id,
            deviceId: deviceId,
            date: dataDate
          },
          {
            ...healthMetrics,
            syncSessionId: syncSession._id,
            updatedAt: new Date()
          },
          {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
          }
        );

        totalDataPoints += Object.keys(healthMetrics).length;
        healthDataCount++;

        // Count workouts and sleep data
        if (healthMetrics.workouts && healthMetrics.workouts.length > 0) {
          workoutDataCount += healthMetrics.workouts.length;
        }
        if (healthMetrics.sleepStages) {
          sleepDataCount++;
        }
      }
    }

    // Update sync session
    syncSession.endTime = new Date();
    syncSession.status = 'completed';
    syncSession.dataPoints = totalDataPoints;
    syncSession.healthDataCount = healthDataCount;
    syncSession.workoutDataCount = workoutDataCount;
    syncSession.sleepDataCount = sleepDataCount;
    syncSession.bytesTransferred = totalDataPoints * 64; // Estimate

    await syncSession.save();

    // Update device last sync time
    device.lastSync = new Date();
    await device.save();

    res.json({
      message: 'Sync completed successfully',
      sessionId: syncSession._id,
      dataPoints: totalDataPoints,
      healthDataCount,
      workoutDataCount,
      sleepDataCount
    });

  } catch (error) {
    console.error('Error syncing device data:', error);
    res.status(500).json({ error: 'Failed to sync device data' });
  }
});

// Get health data for a device
router.get('/devices/:deviceId/health-data', auth, async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { startDate, endDate, limit = 30 } = req.query;

    let query = {
      userId: req.user._id,
      deviceId: deviceId,
      isActive: true
    };

    // Add date range filter if provided
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const healthData = await HealthData.find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit));

    res.json(healthData);
  } catch (error) {
    console.error('Error fetching health data:', error);
    res.status(500).json({ error: 'Failed to fetch health data' });
  }
});

// Get sync history for a device
router.get('/devices/:deviceId/sync-history', auth, async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { limit = 20 } = req.query;

    const syncHistory = await SyncSession.find({
      userId: req.user._id,
      deviceId: deviceId
    })
    .sort({ startTime: -1 })
    .limit(parseInt(limit));

    res.json(syncHistory);
  } catch (error) {
    console.error('Error fetching sync history:', error);
    res.status(500).json({ error: 'Failed to fetch sync history' });
  }
});

// Get all sync sessions for user
router.get('/sync-sessions', auth, async (req, res) => {
  try {
    const { limit = 50 } = req.query;

    const syncSessions = await SyncSession.find({
      userId: req.user._id
    })
    .sort({ startTime: -1 })
    .limit(parseInt(limit));

    res.json(syncSessions);
  } catch (error) {
    console.error('Error fetching sync sessions:', error);
    res.status(500).json({ error: 'Failed to fetch sync sessions' });
  }
});

export default router; 