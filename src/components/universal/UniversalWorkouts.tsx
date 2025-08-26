import React from 'react';
import { Platform } from '../../lib/platform';
import { useWorkouts, useSaveWorkout } from '../../hooks/useUniversalData';

// Web-specific imports
const WebWorkouts = React.lazy(() => import('../../pages/Workouts'));

// Mobile-specific imports
const MobileWorkouts = React.lazy(() => import('./MobileWorkouts'));

interface UniversalWorkoutsProps {
  // Add any props you need
}

const UniversalWorkouts: React.FC<UniversalWorkoutsProps> = (props) => {
  const { data: workouts, isLoading, error } = useWorkouts();
  const saveWorkoutMutation = useSaveWorkout();

  // Check if we're on web or mobile
  const isWeb = Platform.OS === 'web';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading workouts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-red-500">Error loading workouts: {error.message}</div>
      </div>
    );
  }

  // Render platform-specific component with same data
  if (isWeb) {
    return (
      <React.Suspense fallback={<div>Loading...</div>}>
        <WebWorkouts {...props} />
      </React.Suspense>
    );
  } else {
    return (
      <React.Suspense fallback={<div>Loading...</div>}>
        <MobileWorkouts {...props} />
      </React.Suspense>
    );
  }
};

export default UniversalWorkouts; 