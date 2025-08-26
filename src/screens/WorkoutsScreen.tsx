import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useWorkouts, useSaveWorkout } from '../hooks/useUniversalData';

const WorkoutsScreen: React.FC = () => {
  const { data: workouts, isLoading, refetch } = useWorkouts();
  const saveWorkoutMutation = useSaveWorkout();
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null);

  const workoutTypes = [
    { id: 'strength', name: 'Strength Training', icon: '🏋️', color: '#3b82f6' },
    { id: 'cardio', name: 'Cardio', icon: '🏃', color: '#10b981' },
    { id: 'yoga', name: 'Yoga', icon: '🧘', color: '#8b5cf6' },
    { id: 'hiit', name: 'HIIT', icon: '⚡', color: '#f59e0b' },
    { id: 'flexibility', name: 'Flexibility', icon: '🤸', color: '#ec4899' },
    { id: 'custom', name: 'Custom', icon: '🎯', color: '#6b7280' },
  ];

  const handleStartWorkout = (workoutType: any) => {
    Alert.alert(
      'Start Workout',
      `Start a ${workoutType.name} session?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Start', 
          onPress: () => {
            const newWorkout = {
              type: workoutType.id,
              name: workoutType.name,
              startTime: new Date().toISOString(),
              exercises: [],
              status: 'in-progress'
            };
            setSelectedWorkout(newWorkout);
          }
        }
      ]
    );
  };

  const handleEndWorkout = () => {
    if (!selectedWorkout) return;

    const endTime = new Date();
    const duration = Math.round((endTime.getTime() - new Date(selectedWorkout.startTime).getTime()) / 60000);
    
    const completedWorkout = {
      ...selectedWorkout,
      endTime: endTime.toISOString(),
      duration,
      status: 'completed',
      calories: Math.round(duration * 8), // Rough estimate
    };

    saveWorkoutMutation.mutate(completedWorkout, {
      onSuccess: () => {
        Alert.alert('Workout Complete!', `Great job! You worked out for ${duration} minutes.`);
        setSelectedWorkout(null);
        refetch();
      },
      onError: (error) => {
        Alert.alert('Error', 'Failed to save workout. Please try again.');
        console.error('Save workout error:', error);
      }
    });
  };

  const renderWorkoutType = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={[styles.workoutTypeCard, { backgroundColor: item.color }]}
      onPress={() => handleStartWorkout(item)}
    >
      <Text style={styles.workoutTypeIcon}>{item.icon}</Text>
      <Text style={styles.workoutTypeName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderWorkoutHistory = ({ item }: { item: any }) => (
    <View style={styles.workoutHistoryCard}>
      <View style={styles.workoutHistoryHeader}>
        <Text style={styles.workoutHistoryTitle}>{item.name || 'Workout'}</Text>
        <Text style={styles.workoutHistoryDate}>
          {new Date(item.date || item.createdAt).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.workoutHistoryStats}>
        <Text style={styles.workoutHistoryStat}>Duration: {item.duration || 'N/A'} min</Text>
        <Text style={styles.workoutHistoryStat}>Calories: {item.calories || 'N/A'}</Text>
        <Text style={styles.workoutHistoryStat}>Type: {item.type || 'N/A'}</Text>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading workouts...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Active Workout Section */}
      {selectedWorkout && (
        <View style={styles.activeWorkoutCard}>
          <Text style={styles.activeWorkoutTitle}>Active Workout</Text>
          <Text style={styles.activeWorkoutName}>{selectedWorkout.name}</Text>
          <Text style={styles.activeWorkoutTime}>
            Started: {new Date(selectedWorkout.startTime).toLocaleTimeString()}
          </Text>
          <TouchableOpacity style={styles.endWorkoutButton} onPress={handleEndWorkout}>
            <Text style={styles.endWorkoutButtonText}>End Workout</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Workout Types Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Start New Workout</Text>
        <FlatList
          data={workoutTypes}
          renderItem={renderWorkoutType}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.workoutTypesContainer}
        />
      </View>

      {/* Workout History Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Workouts</Text>
        {workouts && workouts.length > 0 ? (
          <FlatList
            data={workouts.slice(0, 10)}
            renderItem={renderWorkoutHistory}
            keyExtractor={(item, index) => item.id || index.toString()}
            scrollEnabled={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>💪</Text>
            <Text style={styles.emptyStateText}>No workouts yet</Text>
            <Text style={styles.emptyStateSubtext}>Start your first workout to see your history here!</Text>
          </View>
        )}
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    fontSize: 16,
    color: '#64748b',
  },
  activeWorkoutCard: {
    backgroundColor: '#10b981',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  activeWorkoutTitle: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
    marginBottom: 4,
  },
  activeWorkoutName: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  activeWorkoutTime: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
    marginBottom: 12,
  },
  endWorkoutButton: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  endWorkoutButtonText: {
    color: '#10b981',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  workoutTypesContainer: {
    paddingHorizontal: 4,
  },
  workoutTypeCard: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  workoutTypeIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  workoutTypeName: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
    textAlign: 'center',
  },
  workoutHistoryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  workoutHistoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  workoutHistoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  workoutHistoryDate: {
    fontSize: 14,
    color: '#64748b',
  },
  workoutHistoryStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  workoutHistoryStat: {
    fontSize: 14,
    color: '#64748b',
    marginRight: 16,
    marginBottom: 4,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
  },
});

export default WorkoutsScreen; 