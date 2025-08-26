import { Platform } from './platform';

// Network configuration for different environments
export const NETWORK_CONFIG = {
  // Development URLs
  development: {
    web: 'http://localhost:5000/api',
    android: 'http://10.0.2.2:5000/api', // Android emulator
    ios: 'http://localhost:5000/api', // iOS simulator
    physical: 'http://192.168.1.100:5000/api', // Physical device (adjust IP)
  },
  // Production URLs
  production: {
    web: 'https://your-production-domain.com/api',
    android: 'https://your-production-domain.com/api',
    ios: 'https://your-production-domain.com/api',
    physical: 'https://your-production-domain.com/api',
  }
};

// Get the appropriate base URL based on platform and environment
export function getBaseURL(): string {
  const isDevelopment = import.meta.env.DEV || __DEV__;
  const config = isDevelopment ? NETWORK_CONFIG.development : NETWORK_CONFIG.production;
  
  if (Platform.OS === 'web') {
    return config.web;
  } else if (Platform.OS === 'android') {
    return config.android;
  } else if (Platform.OS === 'ios') {
    return config.ios;
  }
  
  // Fallback
  return config.web;
}

// Test network connectivity
export async function testNetworkConnection(): Promise<{ success: boolean; url: string; error?: string }> {
  const baseURL = getBaseURL();
  const testURL = `${baseURL}/health`;
  
  try {
    console.log(`🧪 Testing network connection to: ${testURL}`);
    const response = await fetch(testURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Network test successful:', data);
      return { success: true, url: testURL };
    } else {
      console.log('❌ Network test failed with status:', response.status);
      return { success: false, url: testURL, error: `HTTP ${response.status}` };
    }
  } catch (error) {
    console.log('❌ Network test failed with error:', error);
    return { success: false, url: testURL, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Test multiple URLs to find a working connection
export async function findWorkingConnection(): Promise<string | null> {
  const urls = [
    'http://10.0.2.2:5000/api', // Android emulator
    'http://localhost:5000/api', // Local development
    'http://127.0.0.1:5000/api', // Alternative localhost
    'http://192.168.1.100:5000/api', // Physical device (adjust IP)
  ];
  
  for (const baseURL of urls) {
    try {
      const testURL = `${baseURL}/health`;
      console.log(`🔍 Testing: ${testURL}`);
      
      const response = await fetch(testURL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        console.log(`✅ Found working connection: ${baseURL}`);
        return baseURL;
      }
    } catch (error) {
      console.log(`❌ Failed to connect to: ${baseURL}`);
    }
  }
  
  console.log('❌ No working connection found');
  return null;
}

// Get your machine's IP address for physical device testing
export function getLocalIPAddress(): string {
  // This is a placeholder - you'll need to manually set your IP
  // You can find your IP by running 'ipconfig' on Windows or 'ifconfig' on Mac/Linux
  return '192.168.1.100'; // Replace with your actual IP address
} 