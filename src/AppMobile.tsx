import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, SafeAreaView, FlatList } from 'react-native';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "./lib/authUniversal";
import { useWorkouts, useSaveWorkout, useUser, useUserSettings, useSaveUserSettings } from "./hooks/useUniversalData";
import { NavigationProvider, NavigationContext, BottomTabNavigation, HeaderNavigation, FloatingActionButton } from "./navigation/MobileNavigation";
import HomeScreen from "./screens/HomeScreen";
import WorkoutsScreen from "./screens/WorkoutsScreen";
import AnalysisScreen from "./screens/AnalysisScreen";
import MacrosScreen from "./screens/MacrosScreen";
import FriendsScreen from "./screens/FriendsScreen";
import SettingsScreen from "./screens/SettingsScreen";
import CoachScreen from "./screens/CoachScreen";
import AdminScreen from "./screens/AdminScreen";
import HealthScreen from "./screens/HealthScreen";
import SocialScreen from "./screens/SocialScreen";
import AuthContainer from "./screens/AuthContainer";

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

// Demo mode context
const DemoContext = React.createContext<{
  isDemoMode: boolean;
  setDemoMode: (mode: boolean) => void;
}>({
  isDemoMode: false,
  setDemoMode: () => {},
});

// Keep the existing DemoContext

// Enhanced mobile navigation component
const MobileNavBar = () => {
  const { isAuthenticated, role, logout } = useAuth();
  const { isDemoMode, setDemoMode } = React.useContext(DemoContext);
  const { currentScreen, setCurrentScreen } = React.useContext(NavigationContext);

  const handleLogout = () => {
    if (isDemoMode) {
      setDemoMode(false);
    } else {
      logout();
    }
  };

  const menuItems = [
    { id: 'home', title: 'Home', icon: '🏠' },
    { id: 'workouts', title: 'Workouts', icon: '💪' },
    { id: 'analysis', title: 'Analysis', icon: '📊' },
    { id: 'macros', title: 'Macros', icon: '🍎' },
    { id: 'health', title: 'Health', icon: '❤️' },
    { id: 'social', title: 'Social', icon: '🌟' },
    { id: 'friends', title: 'Friends', icon: '👥' },
    { id: 'settings', title: 'Settings', icon: '⚙️' },
  ];

  if (role === 'coach' || isDemoMode) {
    menuItems.push({ id: 'coach', title: 'Coach', icon: '📈' });
  }

  if (role === 'admin' || isDemoMode) {
    menuItems.push({ id: 'admin', title: 'Admin', icon: '🔧' });
  }

  return (
    <SafeAreaView style={styles.navBar}>
      <View style={styles.navHeader}>
        <Text style={styles.logo}>💪 FitForge Buddy</Text>
        {(isAuthenticated || isDemoMode) && (
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>{isDemoMode ? 'Exit Demo' : 'Logout'}</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {(isAuthenticated || isDemoMode) && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.navMenu}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.navItem,
                currentScreen === item.id && styles.navItemActive
              ]}
              onPress={() => setCurrentScreen(item.id)}
            >
              <Text style={styles.navIcon}>{item.icon}</Text>
              <Text style={[
                styles.navText,
                currentScreen === item.id && styles.navTextActive
              ]}>
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

// Use the new enhanced HomeScreen component
const HomeScreenWrapper = () => {
  return <HomeScreen />;
};

const WorkoutsScreenWrapper = () => {
  return <WorkoutsScreen />;
};

const AnalysisScreenWrapper = () => {
  return <AnalysisScreen />;
};

const MacrosScreenWrapper = () => {
  return <MacrosScreen />;
};

const FriendsScreenWrapper = () => {
  return <FriendsScreen />;
};

const SettingsScreenWrapper = () => {
  return <SettingsScreen />;
};

const CoachScreenWrapper = () => {
  return <CoachScreen />;
};

const AdminScreenWrapper = () => {
  return <AdminScreen />;
};

const HealthScreenWrapper = () => {
  return <HealthScreen />;
};

const SocialScreenWrapper = () => {
  return <SocialScreen />;
};



// Auth Container for Login/Signup
const AuthContainerWrapper = () => {
  const { setDemoMode } = React.useContext(DemoContext);

  const handleDemoMode = () => {
    console.log('Demo Mode button pressed - setting demo mode to true');
    setDemoMode(true);
    console.log('Demo mode should now be active');
  };

  return (
    <View style={styles.authContainer}>
      <AuthContainer />
      <TouchableOpacity 
        style={[styles.demoButton, { marginTop: 20 }]} 
        onPress={handleDemoMode}
      >
        <Text style={styles.demoButtonText}>Demo Mode</Text>
      </TouchableOpacity>
    </View>
  );
};

// Main mobile app content
const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();
  const { isDemoMode } = React.useContext(DemoContext);
  const { currentScreen, setCurrentScreen } = React.useContext(NavigationContext);

  console.log('AppContent render - isAuthenticated:', isAuthenticated, 'isDemoMode:', isDemoMode, 'loading:', loading);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const renderScreen = () => {
    if (!isAuthenticated && !isDemoMode) {
      console.log('Rendering AuthContainer - not authenticated and not in demo mode');
      return <AuthContainerWrapper />;
    }

    console.log('Rendering main app interface - currentScreen:', currentScreen);
    switch (currentScreen) {
      case 'home':
        return <HomeScreenWrapper />;
      case 'workouts':
        return <WorkoutsScreenWrapper />;
      case 'analysis':
        return <AnalysisScreenWrapper />;
      case 'macros':
        return <MacrosScreenWrapper />;
      case 'health':
        return <HealthScreenWrapper />;
      case 'social':
        return <SocialScreenWrapper />;
      case 'friends':
        return <FriendsScreenWrapper />;
      case 'settings':
        return <SettingsScreenWrapper />;
      case 'coach':
        return <CoachScreenWrapper />;
      case 'admin':
        return <AdminScreenWrapper />;
      default:
        return <HomeScreenWrapper />;
    }
  };

  return (
    <View style={styles.container}>
      <MobileNavBar />
      <ScrollView style={styles.content}>
        {renderScreen()}
      </ScrollView>
    </View>
  );
};

// Main mobile app component
const AppMobile = () => {
  const [isDemoMode, setDemoMode] = useState(false);

  return (
    <DemoContext.Provider value={{ isDemoMode, setDemoMode }}>
      <NavigationProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </QueryClientProvider>
      </NavigationProvider>
    </DemoContext.Provider>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    fontSize: 18,
    color: '#333',
  },
  navBar: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  navHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  navMenu: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  navItem: {
    alignItems: 'center',
    marginRight: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  navItemActive: {
    backgroundColor: '#007bff',
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 5,
  },
  navText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  navTextActive: {
    color: '#ffffff',
  },
  content: {
    flex: 1,
  },
  screen: {
    padding: 20,
    minHeight: 400,
  },
  screenContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  screenText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#007bff',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  // New styles for enhanced screens
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    width: '100%',
  },
  statCard: {
    backgroundColor: '#e0f7fa',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    width: '45%',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  quickActions: {
    marginTop: 20,
    width: '100%',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'left',
    width: '100%',
  },
  actionButton: {
    backgroundColor: '#4caf50',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  workoutCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  workoutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  workoutDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  workoutDuration: {
    fontSize: 14,
    color: '#007bff',
    marginBottom: 5,
  },
  workoutExercises: {
    fontSize: 14,
    color: '#555',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalScroll: {
    maxHeight: '60%',
  },
  exerciseItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  exerciseDetails: {
    fontSize: 14,
    color: '#666',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  modalButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  errorText: {
    fontSize: 18,
    color: '#ff4444',
    marginBottom: 15,
  },
  retryButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  chartContainer: {
    marginTop: 20,
    width: '100%',
  },
  chartPlaceholder: {
    backgroundColor: '#e0f7fa',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartText: {
    fontSize: 16,
    color: '#666',
  },



  coachStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    width: '100%',
  },
  coachStatCard: {
    backgroundColor: '#e0f7fa',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    width: '45%',
  },
  coachStatNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 5,
  },
  coachStatLabel: {
    fontSize: 14,
    color: '#666',
  },
  clientsContainer: {
    marginTop: 20,
    width: '100%',
  },
  clientCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  clientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  clientProgress: {
    fontSize: 14,
    color: '#007bff',
    marginBottom: 2,
  },
  clientLastCheck: {
    fontSize: 12,
    color: '#999',
  },
  adminStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: 20,
    width: '100%',
  },
  adminStatCard: {
    backgroundColor: '#e0f7fa',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    width: '45%',
    marginBottom: 10,
  },
  adminStatNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 5,
  },
  adminStatLabel: {
    fontSize: 14,
    color: '#666',
  },
  recentActivities: {
    marginTop: 20,
    width: '100%',
  },
  activityCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  activityDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  activityDuration: {
    fontSize: 12,
    color: '#007bff',
  },
  emptyActivity: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  analysisContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: 20,
    width: '100%',
  },
  analysisCard: {
    backgroundColor: '#e0f7fa',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    width: '45%',
    marginBottom: 10,
  },
  analysisNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 5,
  },
  analysisLabel: {
    fontSize: 14,
    color: '#666',
  },
  performanceContainer: {
    marginTop: 20,
    width: '100%',
  },
  insightCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  insightText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  authContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  demoButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  demoButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },


});

export default AppMobile; 