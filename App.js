import { Platform } from 'react-native';

// Check if we're running on web or mobile
const isWeb = Platform.OS === 'web' || typeof window !== 'undefined';

if (isWeb) {
  // For web: use the universal app (which will load web-specific UI)
  const AppUniversal = require('./src/AppUniversal').default;
  module.exports = AppUniversal;
} else {
  // For mobile: use the universal app (which will load mobile-specific UI)
  const AppUniversal = require('./src/AppUniversal').default;
  module.exports = AppUniversal;
} 