import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useMacroData, useSaveMacroData } from '../hooks/useUniversalData';

const MacrosScreen: React.FC = () => {
  const { data: macroData, isLoading, refetch } = useMacroData();
  const saveMacroMutation = useSaveMacroData();
  const [isAdding, setIsAdding] = useState(false);
  const [newMacro, setNewMacro] = useState({
    protein: '',
    carbs: '',
    fats: '',
    calories: '',
    date: new Date().toISOString().split('T')[0]
  });

  const macroGoals = {
    protein: 150, // grams
    carbs: 200,   // grams
    fats: 65,     // grams
    calories: 2000 // calories
  };

  const handleSaveMacro = () => {
    const macroEntry = {
      ...newMacro,
      protein: parseFloat(newMacro.protein) || 0,
      carbs: parseFloat(newMacro.carbs) || 0,
      fats: parseFloat(newMacro.fats) || 0,
      calories: parseFloat(newMacro.calories) || 0,
      date: newMacro.date
    };

    saveMacroMutation.mutate(macroEntry, {
      onSuccess: () => {
        Alert.alert('Success', 'Macro data saved successfully!');
        setIsAdding(false);
        setNewMacro({ protein: '', carbs: '', fats: '', calories: '', date: newMacro.date });
        refetch();
      },
      onError: (error) => {
        Alert.alert('Error', 'Failed to save macro data. Please try again.');
        console.error('Save macro error:', error);
      }
    });
  };

  const renderMacroCard = (title: string, current: number, goal: number, unit: string, color: string) => {
    const percentage = Math.min((current / goal) * 100, 100);
    
    return (
      <View style={styles.macroCard}>
        <View style={styles.macroHeader}>
          <Text style={styles.macroTitle}>{title}</Text>
          <Text style={styles.macroValue}>{current}g</Text>
        </View>
        <View style={styles.macroProgressContainer}>
          <View style={[styles.macroProgressBar, { width: `${percentage}%`, backgroundColor: color }]} />
        </View>
        <Text style={styles.macroGoal}>Goal: {goal}g</Text>
      </View>
    );
  };

  const renderCalorieCard = (current: number, goal: number) => {
    const percentage = Math.min((current / goal) * 100, 100);
    const remaining = Math.max(goal - current, 0);
    
    return (
      <View style={styles.calorieCard}>
        <Text style={styles.calorieTitle}>Daily Calories</Text>
        <View style={styles.calorieMain}>
          <Text style={styles.calorieCurrent}>{current}</Text>
          <Text style={styles.calorieGoal}>/ {goal}</Text>
        </View>
        <View style={styles.calorieProgressContainer}>
          <View style={[styles.calorieProgressBar, { width: `${percentage}%` }]} />
        </View>
        <Text style={styles.calorieRemaining}>{remaining} calories remaining</Text>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading macro data...</Text>
      </View>
    );
  }

  const todayData = macroData?.find((entry: any) => 
    entry.date === new Date().toISOString().split('T')[0]
  ) || { protein: 0, carbs: 0, fats: 0, calories: 0 };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Add Macro Entry */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Macros</Text>
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={() => setIsAdding(!isAdding)}
          >
            <Text style={styles.addButtonText}>{isAdding ? 'Cancel' : 'Add Entry'}</Text>
          </TouchableOpacity>
        </View>

        {isAdding && (
          <View style={styles.addForm}>
            <View style={styles.inputRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Protein (g)</Text>
                <TextInput
                  style={styles.input}
                  value={newMacro.protein}
                  onChangeText={(text) => setNewMacro({ ...newMacro, protein: text })}
                  keyboardType="numeric"
                  placeholder="0"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Carbs (g)</Text>
                <TextInput
                  style={styles.input}
                  value={newMacro.carbs}
                  onChangeText={(text) => setNewMacro({ ...newMacro, carbs: text })}
                  keyboardType="numeric"
                  placeholder="0"
                />
              </View>
            </View>
            <View style={styles.inputRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Fats (g)</Text>
                <TextInput
                  style={styles.input}
                  value={newMacro.fats}
                  onChangeText={(text) => setNewMacro({ ...newMacro, fats: text })}
                  keyboardType="numeric"
                  placeholder="0"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Calories</Text>
                <TextInput
                  style={styles.input}
                  value={newMacro.calories}
                  onChangeText={(text) => setNewMacro({ ...newMacro, calories: text })}
                  keyboardType="numeric"
                  placeholder="0"
                />
              </View>
            </View>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveMacro}>
              <Text style={styles.saveButtonText}>Save Entry</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Calorie Overview */}
      <View style={styles.section}>
        {renderCalorieCard(todayData.calories, macroGoals.calories)}
      </View>

      {/* Macro Breakdown */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Macro Breakdown</Text>
        {renderMacroCard('Protein', todayData.protein, macroGoals.protein, 'g', '#3b82f6')}
        {renderMacroCard('Carbs', todayData.carbs, macroGoals.carbs, 'g', '#10b981')}
        {renderMacroCard('Fats', todayData.fats, macroGoals.fats, 'g', '#f59e0b')}
      </View>

      {/* Macro History */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent History</Text>
        {macroData && macroData.length > 0 ? (
          macroData.slice(0, 7).map((entry: any, index: number) => (
            <View key={index} style={styles.historyCard}>
              <Text style={styles.historyDate}>
                {new Date(entry.date).toLocaleDateString()}
              </Text>
              <View style={styles.historyMacros}>
                <Text style={styles.historyMacro}>P: {entry.protein}g</Text>
                <Text style={styles.historyMacro}>C: {entry.carbs}g</Text>
                <Text style={styles.historyMacro}>F: {entry.fats}g</Text>
                <Text style={styles.historyMacro}>Cal: {entry.calories}</Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>🍎</Text>
            <Text style={styles.emptyStateText}>No macro data yet</Text>
            <Text style={styles.emptyStateSubtext}>Start tracking your nutrition to see your history here!</Text>
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
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  addButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  addForm: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  inputGroup: {
    flex: 1,
    marginHorizontal: 4,
  },
  inputLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  saveButton: {
    backgroundColor: '#10b981',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  calorieCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  calorieTitle: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 8,
  },
  calorieMain: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  calorieCurrent: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  calorieGoal: {
    fontSize: 20,
    color: '#64748b',
    marginLeft: 4,
  },
  calorieProgressContainer: {
    width: '100%',
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  calorieProgressBar: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 4,
  },
  calorieRemaining: {
    fontSize: 14,
    color: '#64748b',
  },
  macroCard: {
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
  macroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  macroTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  macroValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  macroProgressContainer: {
    height: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 3,
    marginBottom: 4,
    overflow: 'hidden',
  },
  macroProgressBar: {
    height: '100%',
    borderRadius: 3,
  },
  macroGoal: {
    fontSize: 12,
    color: '#94a3b8',
  },
  historyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  historyDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  historyMacros: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  historyMacro: {
    fontSize: 14,
    color: '#64748b',
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

export default MacrosScreen; 