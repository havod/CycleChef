// SmartHerMeal/app/(tabs)/meal-planner.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAppStore } from '../../store/useAppStore';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type BudgetFrequency = 'weekly' | 'bi-weekly' | 'monthly';

export default function MealPlannerScreen() {
  const { profile, mealPlan, setMealPlan, setLoading } = useAppStore();
  const router = useRouter();

  const [preferences, setPreferences] = useState('');
  const [budgetAmount, setBudgetAmount] = useState(profile?.budget?.toString() || '100');
  const [budgetFrequency, setBudgetFrequency] = useState<BudgetFrequency>(
    profile?.budgetFrequency || 'weekly'
  );
  const [isGenerating, setIsGenerating] = useState(false);

  if (!profile) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="person-circle-outline" size={64} color="#D0B7D6" />
        <Text style={styles.title}>Complete Your Profile First</Text>
        <Text style={styles.subtitle}>
          We need your information to create personalized meal plans
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/profile')}
        >
          <Text style={styles.buttonText}>Go to Profile</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleGenerate = async () => {
    setIsGenerating(true);
    setLoading(true);

    try {
      // Import API service at the top of the file
      const { apiService } = await import('../../services/api');

      // Call the API
      const data = await apiService.generateMealPlan({
        ...profile,
        budget: parseFloat(budgetAmount),
        budgetFrequency: budgetFrequency,
        preferences: preferences,
      });
      
      // Create a meal plan object compatible with your store
      const newMealPlan = {
        id: `plan-${Date.now()}`,
        totalCalories: data.totalCalories || 0,
        totalCost: data.estimatedPrice || parseFloat(budgetAmount),
        meals: parseMealPlanText(data.mealPlan), // Helper function to parse the text
        rawPlan: data.mealPlan, // Store the raw text for display
      };

      setMealPlan(newMealPlan);
      Alert.alert('Success!', 'Your meal plan has been generated');
    } catch (error) {
      console.error('Error generating meal plan:', error);
      Alert.alert(
        'Error', 
        error instanceof Error ? error.message : 'Failed to generate meal plan. Please try again.'
      );
    } finally {
      setIsGenerating(false);
      setLoading(false);
    }
  };

  // Helper function to parse meal plan text into structured data
  const parseMealPlanText = (text: string) => {
    // This is a simplified parser - you may need to adjust based on your AI output format
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const meals = [];

    for (const day of days) {
      meals.push({
        day,
        breakfast: { id: `${day}-breakfast`, name: 'Breakfast', description: '', ingredients: [], instructions: [], prepTime: 0, cookTime: 0, servings: 0, nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0 } },
        lunch: { id: `${day}-lunch`, name: 'Lunch', description: '', ingredients: [], instructions: [], prepTime: 0, cookTime: 0, servings: 0, nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0 } },
        dinner: { id: `${day}-dinner`, name: 'Dinner', description: '', ingredients: [], instructions: [], prepTime: 0, cookTime: 0, servings: 0, nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0 } },
      });
    }

    return meals;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="restaurant" size={32} color="#D0B7D6" />
        <Text style={styles.title}>AI Meal Planner</Text>
        <Text style={styles.subtitle}>
          Describe your preferences and let our AI create your perfect meal plan
        </Text>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Preferences (Optional)</Text>
        <TextInput
          style={styles.textArea}
          value={preferences}
          onChangeText={setPreferences}
          placeholder="e.g., 'I prefer quick meals', 'I don't like fish', 'I want more protein'"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Budget</Text>
        <View style={styles.budgetContainer}>
          <Text style={styles.currencySymbol}>$</Text>
          <TextInput
            style={styles.budgetInput}
            value={budgetAmount}
            onChangeText={setBudgetAmount}
            keyboardType="numeric"
            placeholder="100"
          />
        </View>

        <Text style={styles.label}>Frequency</Text>
        <View style={styles.radioGroup}>
          {(['weekly', 'bi-weekly', 'monthly'] as BudgetFrequency[]).map((freq) => (
            <TouchableOpacity
              key={freq}
              style={styles.radioOption}
              onPress={() => setBudgetFrequency(freq)}
            >
              <View style={styles.radioCircle}>
                {budgetFrequency === freq && <View style={styles.radioSelected} />}
              </View>
              <Text style={styles.radioLabel}>
                {freq === 'bi-weekly' ? 'Bi-weekly' : freq.charAt(0).toUpperCase() + freq.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={[styles.button, isGenerating && styles.buttonDisabled]}
        onPress={handleGenerate}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Ionicons name="sparkles" size={20} color="#fff" />
            <Text style={styles.buttonText}>Generate Meal Plan</Text>
          </>
        )}
      </TouchableOpacity>

      {mealPlan && (
        <View style={styles.resultCard}>
          <View style={styles.resultHeader}>
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            <Text style={styles.resultTitle}>Current Meal Plan</Text>
          </View>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{mealPlan.totalCalories}</Text>
              <Text style={styles.statLabel}>Total Calories</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>${mealPlan.totalCost || budgetAmount}</Text>
              <Text style={styles.statLabel}>Estimated Cost</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.viewDetailsButton}
            onPress={() => router.push('/meal-plan-detail')}
          >
            <Text style={styles.viewDetailsText}>View Full Plan</Text>
            <Ionicons name="arrow-forward" size={20} color="#D0B7D6" />
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F0F0F0',
  },
  header: {
    padding: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  formSection: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    color: '#333',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    backgroundColor: '#F9F9F9',
  },
  budgetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginRight: 8,
  },
  budgetInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    fontWeight: 'bold',
    width: 100,
    backgroundColor: '#F9F9F9',
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 16,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D0B7D6',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D0B7D6',
  },
  radioLabel: {
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#D0B7D6',
    padding: 16,
    borderRadius: 8,
    margin: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonDisabled: {
    backgroundColor: '#C8A8D4',
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#333',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#ddd',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D0B7D6',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
  },
  viewDetailsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D0B7D6',
    marginRight: 8,
  },
});