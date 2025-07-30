import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import React, { Suspense, lazy } from "react";
import CoachDashboard from "./pages/CoachDashboard";
import Leaderboard from "./pages/Leaderboard";
import Macros from "./pages/Macros";
import Friends from "./pages/Friends";
import AdminDashboard from "./pages/AdminDashboard";
import Settings from "./pages/PrivacySettings";
import { AuthProvider, useAuth } from "./lib/auth";
import Onboarding from "./components/Onboarding";
import Help from "./pages/Help";
import Skeleton from "./components/ui/skeleton";
import FeedbackWidget from "./components/FeedbackWidget";
import Signup from "./pages/Signup";
import FormCheck from "./pages/FormCheck";
import ActivityLog from "./pages/ActivityLog";
import Workouts from "./pages/Workouts";
// import HealthSync from "./pages/HealthSync";
import Button from "./components/ui/button";
import { Dumbbell, LogOut, Video, Activity, Menu, X, Calculator, Settings as SettingsIcon } from "lucide-react";
import { apiService } from "./lib/api";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0, // Always consider data stale for immediate updates
      gcTime: 0, // Don't cache data for real-time updates (newer version of cacheTime)
      refetchOnWindowFocus: true,
      retry: 1,
      refetchOnMount: true,
      refetchInterval: 3000, // Default refetch interval for real-time updates
      refetchIntervalInBackground: true, // Continue refetching in background
    },
  },
});

// Route protection component
function RequireAuth({ children }: { children: JSX.Element }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

const NavBar = () => {
  const { isAuthenticated, role, logout, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const location = useLocation();
  
  const handleLogout = () => {
    logout();
    // The RequireAuth component will handle the redirect
  };

  // Helper function to check if a link is active
  const isActiveLink = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="w-full bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Dumbbell className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-gray-900">FitForge Buddy</span>
            </div>
          </div>

          {/* Navigation Links */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-8">
              <a 
                href="/" 
                className={`font-medium transition-colors flex items-center gap-2 ${
                  isActiveLink('/') 
                    ? 'text-primary border-b-2 border-primary pb-1' 
                    : 'text-gray-700 hover:text-primary'
                }`}
              >
                Home
              </a>
              <a 
                href="/workouts" 
                className={`font-medium transition-colors flex items-center gap-2 ${
                  isActiveLink('/workouts') 
                    ? 'text-primary border-b-2 border-primary pb-1' 
                    : 'text-gray-700 hover:text-primary'
                }`}
              >
                <Dumbbell className="h-4 w-4" />
                Workouts
              </a>
              <a 
                href="/activity-log" 
                className={`font-medium transition-colors flex items-center gap-2 ${
                  isActiveLink('/activity-log') 
                    ? 'text-primary border-b-2 border-primary pb-1' 
                    : 'text-gray-700 hover:text-primary'
                }`}
              >
                <Activity className="h-4 w-4" />
                Activity Log
              </a>
              <a 
                href="/macros" 
                className={`font-medium transition-colors flex items-center gap-2 ${
                  isActiveLink('/macros') 
                    ? 'text-primary border-b-2 border-primary pb-1' 
                    : 'text-gray-700 hover:text-primary'
                }`}
              >
                <Calculator className="h-4 w-4" />
                Macros
              </a>
              {(role === 'coach' || role === 'admin') && (
                <a 
                  href="/coach" 
                  className={`font-medium transition-colors ${
                    isActiveLink('/coach') 
                      ? 'text-primary border-b-2 border-primary pb-1' 
                      : 'text-gray-700 hover:text-primary'
                  }`}
                >
                  Coach Dashboard
                </a>
              )}
              {role === 'admin' && (
                <a 
                  href="/admin" 
                  className={`font-medium transition-colors ${
                    isActiveLink('/admin') 
                      ? 'text-primary border-b-2 border-primary pb-1' 
                      : 'text-gray-700 hover:text-primary'
                  }`}
                >
                  Admin Dashboard
                </a>
              )}
              <a 
                href="/form-check" 
                className={`font-medium transition-colors flex items-center gap-2 ${
                  isActiveLink('/form-check') 
                    ? 'text-primary border-b-2 border-primary pb-1' 
                    : 'text-gray-700 hover:text-primary'
                }`}
              >
                <Video className="h-4 w-4" />
                Form Check
              </a>
              <a 
                href="/settings" 
                className={`font-medium transition-colors flex items-center gap-2 ${
                  isActiveLink('/settings') 
                    ? 'text-primary border-b-2 border-primary pb-1' 
                    : 'text-gray-700 hover:text-primary'
                }`}
              >
                <SettingsIcon className="h-4 w-4" />
                Settings
              </a>
            </div>
          )}

          {/* Mobile menu button */}
          {isAuthenticated && (
            <div className="md:hidden">
              <Button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                variant="ghost"
                className="p-2"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          )}

          {/* Logout Button */}
          {isAuthenticated && (
            <Button 
              onClick={handleLogout}
              className="hidden md:flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          )}
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {isAuthenticated && mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a 
              href="/" 
              className={`block px-3 py-2 font-medium transition-colors ${
                isActiveLink('/') 
                  ? 'text-primary bg-primary/10 border-l-4 border-primary' 
                  : 'text-gray-700 hover:text-primary'
              }`}
            >
              Home
            </a>
            <a 
              href="/workouts" 
              className={`flex px-3 py-2 font-medium transition-colors items-center gap-2 ${
                isActiveLink('/workouts') 
                  ? 'text-primary bg-primary/10 border-l-4 border-primary' 
                  : 'text-gray-700 hover:text-primary'
              }`}
            >
              <Dumbbell className="h-4 w-4" />
              Workouts
            </a>
            <a 
              href="/activity-log" 
              className={`flex px-3 py-2 font-medium transition-colors items-center gap-2 ${
                isActiveLink('/activity-log') 
                  ? 'text-primary bg-primary/10 border-l-4 border-primary' 
                  : 'text-gray-700 hover:text-primary'
              }`}
            >
              <Activity className="h-4 w-4" />
              Activity Log
            </a>
            <a 
              href="/macros" 
              className={`flex px-3 py-2 font-medium transition-colors items-center gap-2 ${
                isActiveLink('/macros') 
                  ? 'text-primary bg-primary/10 border-l-4 border-primary' 
                  : 'text-gray-700 hover:text-primary'
              }`}
            >
              <Calculator className="h-4 w-4" />
              Macros
            </a>
            {(role === 'coach' || role === 'admin') && (
              <a 
                href="/coach" 
                className={`block px-3 py-2 font-medium transition-colors ${
                  isActiveLink('/coach') 
                    ? 'text-primary bg-primary/10 border-l-4 border-primary' 
                    : 'text-gray-700 hover:text-primary'
                }`}
              >
                Coach Dashboard
              </a>
            )}
            {role === 'admin' && (
              <a 
                href="/admin" 
                className={`block px-3 py-2 font-medium transition-colors ${
                  isActiveLink('/admin') 
                    ? 'text-primary bg-primary/10 border-l-4 border-primary' 
                    : 'text-gray-700 hover:text-primary'
                }`}
              >
                Admin Dashboard
              </a>
            )}
            <a 
              href="/form-check" 
              className={`flex px-3 py-2 font-medium transition-colors items-center gap-2 ${
                isActiveLink('/form-check') 
                  ? 'text-primary bg-primary/10 border-l-4 border-primary' 
                  : 'text-gray-700 hover:text-primary'
              }`}
            >
              <Video className="h-4 w-4" />
              Form Check
            </a>
            <a 
              href="/settings" 
              className={`flex px-3 py-2 font-medium transition-colors items-center gap-2 ${
                isActiveLink('/settings') 
                  ? 'text-primary bg-primary/10 border-l-4 border-primary' 
                  : 'text-gray-700 hover:text-primary'
              }`}
            >
              <SettingsIcon className="h-4 w-4" />
              Settings
            </a>
            <Button 
              onClick={handleLogout}
              className="w-full mt-4 flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

const AppContent = () => {
  const [showOnboarding, setShowOnboarding] = React.useState(false);
  const { user, isAuthenticated } = useAuth();

  // Load onboarding status from backend
  React.useEffect(() => {
    const loadOnboardingStatus = async () => {
      if (user?._id) {
        try {
          const onboardingComplete = await apiService.getUserPreference('onboarding_complete');
          setShowOnboarding(!onboardingComplete);
        } catch (error) {
          console.error('Error loading onboarding status:', error);
          setShowOnboarding(true); // Default to showing onboarding if error
        }
      }
    };
    loadOnboardingStatus();
  }, [user?._id]);

  const handleFinishOnboarding = async () => {
    try {
      await apiService.saveUserPreference('onboarding_complete', '1');
      setShowOnboarding(false);
    } catch (error) {
      console.error('Error saving onboarding status:', error);
      setShowOnboarding(false); // Still hide onboarding even if save fails
    }
  };

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      {isAuthenticated && <NavBar />}
      {showOnboarding && <Onboarding onFinish={handleFinishOnboarding} />}
      <Suspense fallback={<div className="p-8 text-center"><Skeleton className="w-full h-32 mb-4" /><Skeleton className="w-1/2 h-8 mx-auto" /><Skeleton className="w-full h-8 mt-4" /></div>}>
        <Routes>
          <Route path="/" element={<RequireAuth><Index /></RequireAuth>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/leaderboard" element={<RequireAuth><Leaderboard /></RequireAuth>} />
          <Route path="/macros" element={<RequireAuth><Macros /></RequireAuth>} />
          <Route path="/friends" element={<RequireAuth><Friends /></RequireAuth>} />
          <Route path="/coach" element={<RequireAuth><CoachDashboard /></RequireAuth>} />
          <Route path="/admin" element={<RequireAuth><AdminDashboard /></RequireAuth>} />
          <Route path="/settings" element={<RequireAuth><Settings /></RequireAuth>} />
          <Route path="/help" element={<RequireAuth><Help /></RequireAuth>} />
          <Route path="/form-check" element={<RequireAuth><FormCheck /></RequireAuth>} />
          <Route path="/workouts" element={<RequireAuth><Workouts /></RequireAuth>} />
          <Route path="/activity-log" element={<RequireAuth><ActivityLog /></RequireAuth>} />
          {/* <Route path="/health-sync" element={<RequireAuth><HealthSync /></RequireAuth>} /> */}
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <FeedbackWidget />
    </BrowserRouter>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
