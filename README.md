# FitForge Buddy

A universal React Native/React web application for fitness tracking and coaching.

## Features

- **Universal Platform Support**: Works on both web browsers and mobile devices
- **Fitness Tracking**: Workout logging, macro tracking, and activity monitoring
- **Social Features**: Friends system and leaderboards
- **Coaching Tools**: Coach dashboard for managing clients
- **Admin Panel**: Administrative tools for platform management

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Android Studio (for Android development)
- Android SDK
- Expo CLI

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd fitforge-buddy-main/fitforge-buddy-main
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with your configuration:
```env
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
VITE_RUNWAY_API_KEY=your_runway_api_key
```

## Running the Application

### Web Development
```bash
npm run dev
```
This will start the Vite development server for web development.

### Mobile Development (Android)

#### Option 1: Using Expo CLI (Recommended)
```bash
npx expo run:android
```
This will build and run the app on your connected Android device or emulator.

#### Option 2: Using Android Studio
1. Open Android Studio
2. Open the `android` folder from your project directory
3. Wait for Gradle sync to complete
4. Connect your Android device or start an emulator
5. Click the "Run" button (green play icon)

### Universal Development (Both Web and Mobile)
```bash
# Start the development server
npx expo start

# Then press:
# - 'w' for web
# - 'a' for Android
# - 'i' for iOS
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── lib/           # Utility libraries and services
├── hooks/         # Custom React hooks
├── types/         # TypeScript type definitions
└── assets/        # Static assets

android/           # Android-specific configuration
public/            # Public assets for web
```

## Platform-Specific Features

### Web Features
- Full browser compatibility
- Responsive design
- Web-specific optimizations
- Feedback widget

### Mobile Features
- Native mobile UI components
- Touch-optimized navigation
- Mobile-specific performance optimizations
- Platform-specific styling

## Development Notes

- The app uses a universal codebase that works on both web and mobile
- React Router is used for web navigation
- Platform detection is handled automatically
- Components are designed to be responsive and work on all screen sizes

## Troubleshooting

### Android Issues
1. Make sure Android Studio is properly configured
2. Ensure Android SDK is installed and configured
3. Check that your device/emulator is connected
4. Clear Metro cache: `npx expo start --clear`

### Web Issues
1. Check that all dependencies are installed
2. Clear browser cache
3. Check console for any JavaScript errors

### General Issues
1. Clear node_modules and reinstall: `rm -rf node_modules && npm install`
2. Clear Expo cache: `npx expo start --clear`
3. Check environment variables are properly set

## Building for Production

### Web Build
```bash
npm run build
```

### Android Build
```bash
npx expo build:android
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on both web and mobile
5. Submit a pull request

## License

This project is licensed under the MIT License.
