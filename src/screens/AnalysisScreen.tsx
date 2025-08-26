import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useWorkoutAnalytics } from '../hooks/useUniversalData';

const AnalysisScreen: React.FC = () => {
  const { data: analytics, isLoading } = useWorkoutAnalytics();

  const renderStatCard = (title: string, value: string | number, unit: string, color: string) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statUnit}>{unit}</Text>
    </View>
  );

  const renderProgressBar = (label: string, value: number, maxValue: number, color: string) => (
    <View style={styles.progressItem}>
      <View style={styles.progressHeader}>
        <Text style={styles.progressLabel}>{label}</Text>
        <Text style={styles.progressValue}>{value}/{maxValue}</Text>
      </View>
      <View style={styles.progressBarContainer}>
        <View 
          style={[
            styles.progressBar, 
            { 
              width: `${(value / maxValue) * 100}%`,
              backgroundColor: color 
            }
          ]} 
        />
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading analytics...</Text>
      </View>
    );
  }

  const weeklyProgress = analytics?.weeklyProgress || 0;
  const monthlyProgress = analytics?.monthlyProgress || 0;
  const totalWorkouts = analytics?.totalWorkouts || 0;
  const totalCalories = analytics?.totalCalories || 0;
  const averageDuration = analytics?.averageDuration || 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Overview Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.statsGrid}>
          {renderStatCard('Total Workouts', totalWorkouts, 'sessions', '#3b82f6')}
          {renderStatCard('Total Calories', totalCalories, 'cal', '#10b981')}
          {renderStatCard('Avg Duration', averageDuration, 'min', '#f59e0b')}
        </View>
      </View>

      {/* Progress Tracking */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Progress Tracking</Text>
        {renderProgressBar('Weekly Goal', weeklyProgress, 5, '#3b82f6')}
        {renderProgressBar('Monthly Goal', monthlyProgress, 20, '#10b981')}
      </View>

      {/* Workout Distribution */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Workout Distribution</Text>
        <View style={styles.distributionContainer}>
          {analytics?.workoutTypes?.map((type: any, index: number) => (
            <View key={index} style={styles.distributionItem}>
              <View style={styles.distributionHeader}>
                <Text style={styles.distributionName}>{type.name}</Text>
                <Text style={styles.distributionCount}>{type.count}</Text>
              </View>
              <View style={styles.distributionBarContainer}>
                <View 
                  style={[
                    styles.distributionBar, 
                    { 
                      width: `${(type.count / Math.max(...analytics.workoutTypes.map((t: any) => t.count))) * 100}%`,
                      backgroundColor: type.color || '#3b82f6'
                    }
                  ]} 
                />
              </View>
            </View>
          )) || (
            <Text style={styles.noDataText}>No workout data available</Text>
          )}
        </View>
      </View>

      {/* Recent Trends */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Trends</Text>
        <View style={styles.trendsContainer}>
          {analytics?.recentTrends?.map((trend: any, index: number) => (
            <View key={index} style={styles.trendItem}>
              <Text style={styles.trendPeriod}>{trend.period}</Text>
              <Text style={styles.trendValue}>{trend.workouts} workouts</Text>
              <Text style={[styles.trendChange, { color: trend.change >= 0 ? '#10b981' : '#ef4444' }]}>
                {trend.change >= 0 ? '+' : ''}{trend.change}%
              </Text>
            </View>
          )) || (
            <Text style={styles.noDataText}>No trend data available</Text>
          )}
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statTitle: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statUnit: {
    fontSize: 12,
    color: '#94a3b8',
  },
  progressItem: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
  },
  progressValue: {
    fontSize: 14,
    color: '#64748b',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  distributionContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  distributionItem: {
    marginBottom: 12,
  },
  distributionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  distributionName: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '500',
  },
  distributionCount: {
    fontSize: 14,
    color: '#64748b',
  },
  distributionBarContainer: {
    height: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  distributionBar: {
    height: '100%',
    borderRadius: 3,
  },
  trendsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  trendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  trendPeriod: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '500',
  },
  trendValue: {
    fontSize: 14,
    color: '#64748b',
  },
  trendChange: {
    fontSize: 14,
    fontWeight: '600',
  },
  noDataText: {
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: 14,
    fontStyle: 'italic',
  },
});

export default AnalysisScreen; 