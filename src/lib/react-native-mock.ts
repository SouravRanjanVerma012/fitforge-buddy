// React Native mock for web environment
export const Platform = {
  OS: 'web',
  isWeb: true,
  isMobile: false,
  isAndroid: false,
  isIOS: false,
};

export const View = 'div';
export const Text = 'span';
export const TouchableOpacity = 'button';
export const ScrollView = 'div';
export const FlatList = 'div';
export const Image = 'img';
export const TextInput = 'input';
export const Switch = 'input';
export const Alert = {
  alert: (title: string, message?: string) => {
    if (typeof window !== 'undefined') {
      window.alert(`${title}${message ? `: ${message}` : ''}`);
    }
  },
};
export const StyleSheet = {
  create: (styles: any) => styles,
};
export const Dimensions = {
  get: (dimension: string) => {
    if (typeof window !== 'undefined') {
      return dimension === 'window' ? window : document.documentElement;
    }
    return { width: 0, height: 0 };
  },
};
export const StatusBar = {
  setBarStyle: () => {},
  setBackgroundColor: () => {},
};
export const SafeAreaView = 'div';
export const Modal = 'div';
export const ActivityIndicator = 'div';
export const Linking = {
  openURL: (url: string) => {
    if (typeof window !== 'undefined') {
      window.open(url, '_blank');
    }
  },
};
export const NetInfo = {
  addEventListener: () => {},
  removeEventListener: () => {},
};
export const AccessibilityInfo = {
  isScreenReaderEnabled: () => Promise.resolve(false),
  announceForAccessibility: () => {},
};
export const Animated = {
  Value: class {
    constructor(value: number) {
      this.value = value;
    }
    value: number;
    setValue(value: number) {
      this.value = value;
    }
  },
  timing: () => ({
    start: () => {},
  }),
};
export const Easing = {
  linear: () => {},
  ease: () => {},
};
export const InteractionManager = {
  runAfterInteractions: (callback: () => void) => {
    if (typeof window !== 'undefined') {
      setTimeout(callback, 0);
    }
  },
}; 