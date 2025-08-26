import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';

// Navigation context for managing screen state
export const NavigationContext = React.createContext<{
  currentScreen: string;
  setCurrentScreen: (screen: string) => void;
  navigationHistory: string[];
  goBack: () => void;
  goToScreen: (screen: string) => void;
}>({
  currentScreen: 'home',
  setCurrentScreen: () => {},
  navigationHistory: [],
  goBack: () => {},
  goToScreen: () => {},
});

// Navigation provider component
export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = React.useState('home');
  const [navigationHistory, setNavigationHistory] = React.useState<string[]>(['home']);

  const goToScreen = (screen: string) => {
    setNavigationHistory(prev => [...prev, screen]);
    setCurrentScreen(screen);
  };

  const goBack = () => {
    if (navigationHistory.length > 1) {
      const newHistory = navigationHistory.slice(0, -1);
      const previousScreen = newHistory[newHistory.length - 1];
      setNavigationHistory(newHistory);
      setCurrentScreen(previousScreen);
    }
  };

  return (
    <NavigationContext.Provider value={{
      currentScreen,
      setCurrentScreen: goToScreen,
      navigationHistory,
      goBack,
      goToScreen,
    }}>
      {children}
    </NavigationContext.Provider>
  );
};

// Bottom tab navigation component
export const BottomTabNavigation: React.FC = () => {
  const { currentScreen, setCurrentScreen } = React.useContext(NavigationContext);

  const tabItems = [
    { id: 'home', title: 'Home', icon: '🏠' },
    { id: 'workouts', title: 'Workouts', icon: '💪' },
    { id: 'analysis', title: 'Analysis', icon: '📊' },
    { id: 'macros', title: 'Macros', icon: '🍎' },
    { id: 'friends', title: 'Friends', icon: '👥' },
  ];

  return (
    <SafeAreaView style={styles.bottomTabContainer}>
      <View style={styles.tabBar}>
        {tabItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.tabItem,
              currentScreen === item.id && styles.tabItemActive
            ]}
            onPress={() => setCurrentScreen(item.id)}
          >
            <Text style={styles.tabIcon}>{item.icon}</Text>
            <Text style={[
              styles.tabText,
              currentScreen === item.id && styles.tabTextActive
            ]}>
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

// Header navigation component
export const HeaderNavigation: React.FC = () => {
  const { currentScreen, goBack, navigationHistory } = React.useContext(NavigationContext);

  const getScreenTitle = (screen: string) => {
    const titles: { [key: string]: string } = {
      home: 'FitForge Buddy',
      workouts: 'Workouts',
      analysis: 'Analysis',
      macros: 'Macro Tracking',
      friends: 'Friends',
      settings: 'Settings',
      coach: 'Coach Dashboard',
      admin: 'Admin Dashboard',
    };
    return titles[screen] || screen;
  };

  const canGoBack = navigationHistory.length > 1;

  return (
    <SafeAreaView style={styles.headerContainer}>
      <View style={styles.header}>
        {canGoBack && (
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>{getScreenTitle(currentScreen)}</Text>
        <View style={styles.headerRight}>
          {/* Add header actions here */}
        </View>
      </View>
    </SafeAreaView>
  );
};

// Floating action button for quick actions
export const FloatingActionButton: React.FC<{ onPress: () => void }> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.fab} onPress={onPress}>
      <Text style={styles.fabText}>+</Text>
    </TouchableOpacity>
  );
};

// Navigation styles
const styles = StyleSheet.create({
  bottomTabContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  tabBar: {
    flexDirection: 'row',
    height: 60,
    paddingHorizontal: 10,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabItemActive: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  tabText: {
    fontSize: 10,
    color: '#6b7280',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  headerContainer: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 20,
    color: '#3b82f6',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  fab: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
}); 