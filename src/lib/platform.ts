// Platform detection utility that works for both web and mobile
export const Platform = {
  OS: typeof window !== 'undefined' && typeof document !== 'undefined' ? 'web' : 'native',
  isWeb: typeof window !== 'undefined' && typeof document !== 'undefined',
  isMobile: typeof window !== 'undefined' && typeof document !== 'undefined' ? false : true,
  isAndroid: false, // Will be set by React Native if available
  isIOS: false, // Will be set by React Native if available
};

// Try to detect React Native environment
if (typeof global !== 'undefined' && global.navigator && global.navigator.product === 'ReactNative') {
  Platform.OS = 'native';
  Platform.isMobile = true;
  Platform.isWeb = false;
}

// Export platform constants
export const isWeb = Platform.isWeb;
export const isMobile = Platform.isMobile;
export const isAndroid = Platform.isAndroid;
export const isIOS = Platform.isIOS; 