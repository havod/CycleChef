import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useAppStore } from '../../store/useAppStore';
import { useRouter } from 'expo-router';

export default function MealPlannerScreen() {
  const { profile, mealPlan } = useAppStore();
  const router = useRouter();

  if (!profile) {
    return (
      <View style={styles.container}>
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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Meal Planner</Text>
        <Text style={styles.subtitle}>
          Generate personalized meal plans based on your preferences
        </Text>
      </View>

      {/* TODO: Add meal plan generation form here */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Generate New Meal Plan</Text>
        <Text style={styles.cardText}>
          This feature will be connected to your AI backend
        </Text>
      </View>

      {mealPlan && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Current Meal Plan</Text>
          <Text style={styles.cardText}>
            Total Calories: {mealPlan.totalCalories}
          </Text>
          {/* TODO: Display meal plan details */}
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
  header: {
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  card: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#666',
  },
  button: {
    backgroundColor: '#D0B7D6',
    padding: 16,
    borderRadius: 8,
    margin: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  groceryItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#D0B7D6',
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  groceryInfo: {
    flex: 1,
  },
  groceryName: {
    fontSize: 16,
    fontWeight: '500',
  },
  checked: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  groceryQuantity: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  groceryPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D0B7D6',
  },
});

