import React, { Suspense } from 'react';
import { Platform } from './lib/platform';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./lib/authUniversal";

// Web-specific imports
const WebApp = React.lazy(() => import('./App'));

// Mobile-specific imports
const MobileApp = React.lazy(() => import('./AppMobile'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      gcTime: 0,
      refetchOnWindowFocus: false, // Disabled for mobile
      retry: 1,
      refetchOnMount: true,
      refetchInterval: false, // Disabled for mobile
      refetchIntervalInBackground: false, // Disabled for mobile
    },
  },
});

const AppUniversal: React.FC = () => {
  // Check if we're on web or mobile
  const isWeb = Platform.OS === 'web';

  if (isWeb) {
    // Web version with HTML elements
    return (
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-lg">Loading FitForge Buddy...</div>
            </div>
          }>
            <WebApp />
          </Suspense>
        </AuthProvider>
      </QueryClientProvider>
    );
  } else {
    // Mobile version with React Native components
    return (
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-lg">Loading FitForge Buddy...</div>
            </div>
          }>
            <MobileApp />
          </Suspense>
        </AuthProvider>
      </QueryClientProvider>
    );
  }
};

export default AppUniversal; 