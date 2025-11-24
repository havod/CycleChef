import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '../../store/useAppStore';
import { Ionicons } from '@expo/vector-icons';
import Markdown from 'react-native-markdown-display';

export default function MealPlanDetailScreen() {
  const router = useRouter();
  const { mealPlan, clearMealPlan } = useAppStore();

  if (!mealPlan) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="restaurant-outline" size={64} color="#D0B7D6" />
        <Text style={styles.emptyTitle}>No Meal Plan</Text>
        <Text style={styles.emptyText}>
          Generate a meal plan to see the details
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleClearPlan = () => {
    clearMealPlan();
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meal Plan Details</Text>
        <TouchableOpacity onPress={handleClearPlan}>
          <Ionicons name="trash-outline" size={24} color="#E74C3C" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{mealPlan.totalCalories}</Text>
            <Text style={styles.statLabel}>Total Calories</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>${mealPlan.totalCost || 0}</Text>
            <Text style={styles.statLabel}>Estimated Cost</Text>
          </View>
        </View>

        <View style={styles.planCard}>
          <Text style={styles.planTitle}>Your Personalized Meal Plan</Text>
          {mealPlan.rawPlan ? (
            <Markdown style={markdownStyles}>
              {mealPlan.rawPlan}
            </Markdown>
          ) : (
            <Text style={styles.planText}>
              Meal plan details are being processed...
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.generateGroceryButton}
          onPress={() => router.push('/grocery-list')}
        >
          <Ionicons name="cart" size={20} color="#fff" />
          <Text style={styles.buttonText}>Generate Grocery List</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 8,
    justifyContent: 'space-around',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 16,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#D0B7D6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  planCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  planTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  planText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#333',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#D0B7D6',
    padding: 16,
    borderRadius: 8,
    paddingHorizontal: 32,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  generateGroceryButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    margin: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
});

const markdownStyles = {
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  heading1: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 12,
    color: '#D0B7D6',
  },
  heading2: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
  },
  heading3: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
    color: '#333',
  },
  strong: {
    fontWeight: 'bold',
    color: '#333',
  },
  bullet_list: {
    marginVertical: 8,
  },
  ordered_list: {
    marginVertical: 8,
  },
  list_item: {
    marginVertical: 4,
  },
};