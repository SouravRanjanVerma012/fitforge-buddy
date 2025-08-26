import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useWorkouts, useUser, useWorkoutAnalytics } from '../hooks/useUniversalData';

const HomeScreen: React.FC = () => {
  const { data: workouts, isLoading: workoutsLoading } = useWorkouts();
  const { data: user, isLoading: userLoading } = useUser();
  const { data: analytics } = useWorkoutAnalytics();

  // Calculate progress data
  const getProgressData = () => {
    if (!workouts || !analytics) return { weeklyProgress: 0, monthlyProgress: 0, totalWorkouts: 0 };
    
    const totalWorkouts = workouts.length;
    const weeklyProgress = analytics.weeklyProgress || 0;
    const monthlyProgress = analytics.monthlyProgress || 0;
    
    return { weeklyProgress, monthlyProgress, totalWorkouts };
  };

  const { weeklyProgress, monthlyProgress, totalWorkouts } = getProgressData();
  const recentWorkouts = workouts?.slice(0, 5) || [];

  const quickActions = [
    { id: 'start-workout', title: 'Start Workout', icon: '💪', color: '#3b82f6' },
    { id: 'log-meal', title: 'Log Meal', icon: '🍎', color: '#10b981' },
    { id: 'check-macros', title: 'Check Macros', icon: '📊', color: '#f59e0b' },
    { id: 'view-progress', title: 'View Progress', icon: '📈', color: '#8b5cf6' },
  ];

  const notifications = [
    { id: '1', type: 'achievement', message: 'Great job! You completed 5 workouts this week!', time: '2h ago' },
    { id: '2', type: 'reminder', message: 'Time for your scheduled workout', time: '1h ago' },
    { id: '3', type: 'friend', message: 'John joined your fitness challenge', time: '30m ago' },
  ];

  const renderProgressCard = (title: string, value: number, unit: string, color: string) => (
    <View style={[styles.progressCard, { borderLeftColor: color }]}>
      <Text style={styles.progressTitle}>{title}</Text>
      <Text style={[styles.progressValue, { color }]}>{value}</Text>
      <Text style={styles.progressUnit}>{unit}</Text>
    </View>
  );

  const renderQuickAction = (action: any) => (
    <TouchableOpacity key={action.id} style={[styles.quickAction, { backgroundColor: action.color }]}>
      <Text style={styles.quickActionIcon}>{action.icon}</Text>
      <Text style={styles.quickActionTitle}>{action.title}</Text>
    </TouchableOpacity>
  );

  const renderRecentWorkout = (workout: any, index: number) => (
    <View key={index} style={styles.recentWorkoutCard}>
      <View style={styles.workoutHeader}>
        <Text style={styles.workoutTitle}>{workout.name || 'Workout'}</Text>
        <Text style={styles.workoutDate}>
          {new Date(workout.date || workout.createdAt).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.workoutStats}>
        <Text style={styles.workoutStat}>Duration: {workout.duration || 'N/A'} min</Text>
        <Text style={styles.workoutStat}>Calories: {workout.calories || 'N/A'}</Text>
      </View>
    </View>
  );

  const renderNotification = (notification: any) => (
    <View key={notification.id} style={styles.notificationCard}>
      <View style={styles.notificationIcon}>
        <Text style={styles.notificationIconText}>
          {notification.type === 'achievement' ? '🏆' : 
           notification.type === 'reminder' ? '⏰' : '👥'}
        </Text>
      </View>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationMessage}>{notification.message}</Text>
        <Text style={styles.notificationTime}>{notification.time}</Text>
      </View>
    </View>
  );

  if (userLoading || workoutsLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading your fitness dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeText}>
          Welcome back, {user?.name || 'Fitness Buddy'}! 👋
        </Text>
        <Text style={styles.welcomeSubtext}>
          Ready to crush your fitness goals today?
        </Text>
      </View>

      {/* Progress Overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Progress Overview</Text>
        <View style={styles.progressGrid}>
          {renderProgressCard('Weekly Progress', weeklyProgress, '%', '#3b82f6')}
          {renderProgressCard('Monthly Progress', monthlyProgress, '%', '#10b981')}
          {renderProgressCard('Total Workouts', totalWorkouts, 'workouts', '#f59e0b')}
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map(renderQuickAction)}
        </View>
      </View>

      {/* Recent Activities */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activities</Text>
        {recentWorkouts.length > 0 ? (
          recentWorkouts.map(renderRecentWorkout)
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>🏃‍♂️</Text>
            <Text style={styles.emptyStateTitle}>No recent activities</Text>
            <Text style={styles.emptyStateSubtitle}>Start your first workout today!</Text>
          </View>
        )}
      </View>

      {/* Goal Tracking */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Goal Tracking</Text>
        <View style={styles.goalCard}>
          <Text style={styles.goalTitle}>Weekly Workout Goal</Text>
          <View style={styles.goalProgress}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${Math.min(weeklyProgress, 100)}%` }]} />
            </View>
            <Text style={styles.progressText}>{weeklyProgress}% Complete</Text>
          </View>
          <Text style={styles.goalTarget}>Target: 5 workouts per week</Text>
        </View>
      </View>

      {/* Notifications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        {notifications.map(renderNotification)}
      </View>

      {/* Weather Integration Placeholder */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Weather & Recommendations</Text>
        <View style={styles.weatherCard}>
          <Text style={styles.weatherIcon}>☀️</Text>
          <Text style={styles.weatherText}>Perfect weather for outdoor cardio!</Text>
          <TouchableOpacity style={styles.weatherAction}>
            <Text style={styles.weatherActionText}>View Outdoor Workouts</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100, // Space for bottom tab
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  welcomeSection: {
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  welcomeSubtext: {
    fontSize: 16,
    color: '#6b7280',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  progressGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  progressTitle: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  progressValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  progressUnit: {
    fontSize: 12,
    color: '#6b7280',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAction: {
    width: '48%',
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
  recentWorkoutCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  workoutTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  workoutDate: {
    fontSize: 12,
    color: '#6b7280',
  },
  workoutStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  workoutStat: {
    fontSize: 14,
    color: '#6b7280',
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  goalCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  goalProgress: {
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#6b7280',
  },
  goalTarget: {
    fontSize: 12,
    color: '#6b7280',
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationIconText: {
    fontSize: 16,
  },
  notificationContent: {
    flex: 1,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#1f2937',
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: '#6b7280',
  },
  weatherCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  weatherIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  weatherText: {
    fontSize: 16,
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  weatherAction: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  weatherActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
});

export default HomeScreen; 