# Mobile Setup Guide

## Overview
This project now has separate components for web and mobile:
- **Web**: Uses the original `src/App.tsx` with React Router (unchanged)
- **Mobile**: Uses `src/AppMobile.tsx` with React Native navigation

## Current Status
✅ **Web app**: Fully functional, no changes made  
✅ **Mobile app**: New mobile-specific component created  
✅ **API service**: Mobile-compatible version created (uses AsyncStorage)  
⚠️ **Android**: May show white screen due to React Router incompatibility  

## Quick Fix for White Screen

### Step 1: Install AsyncStorage (Required)
```bash
npm install @react-native-async-storage/async-storage
```

### Step 2: Use Development Build (Recommended)
```bash
# Press 's' in your Expo terminal to switch to development build
# This will use the built APK instead of Expo Go
```

### Step 3: Clear Cache and Restart
```bash
npx expo start --clear
```

### Alternative: Use Android Studio
1. Open Android Studio
2. Open the `android` folder from your project
3. Wait for Gradle sync
4. Click the Run button

## Mobile Features
- ✅ Native React Native navigation
- ✅ Touch-optimized UI
- ✅ Platform-specific styling
- ✅ Authentication support
- ✅ Screen navigation (Home, Workouts, Macros, Friends, etc.)
- ✅ Mobile-compatible API service (AsyncStorage instead of localStorage)

## Troubleshooting

### localStorage Error (Fixed)
- **Issue**: `Property 'localStorage' doesn't exist, js engine: hermes`
- **Solution**: Install AsyncStorage and use mobile API service
- **Command**: `npm install @react-native-async-storage/async-storage`

### White Screen Issues
1. **Install AsyncStorage**: `npm install @react-native-async-storage/async-storage`
2. **Clear Metro cache**: `npx expo start --clear`
3. **Restart development server**: Stop and restart Expo
4. **Check device connection**: Ensure emulator/device is connected
5. **Use development build**: Press 's' to switch from Expo Go

### Build Issues
1. **Clean Android build**: `cd android && ./gradlew clean`
2. **Reinstall dependencies**: `npm install`
3. **Clear npm cache**: `npm cache clean --force`

## File Structure
```
src/
├── App.tsx          # Web app (unchanged)
├── AppMobile.tsx    # Mobile app (new)
├── lib/
│   ├── api.ts       # Web API service (unchanged)
│   └── apiMobile.ts # Mobile API service (new)
└── ...
App.js               # Platform detection entry point
```

## Development Commands
```bash
# Install AsyncStorage (required for mobile)
npm install @react-native-async-storage/async-storage

# Web development (unchanged)
npm run dev:web

# Mobile development
npm run dev:mobile

# Android specific
npm run dev:android

# Universal development
npx expo start
```

## Notes
- Web app remains completely unchanged
- Mobile app uses React Native components
- Platform detection happens in `App.js`
- Both apps share the same backend and authentication
- Mobile app uses AsyncStorage instead of localStorage 