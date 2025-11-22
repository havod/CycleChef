import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '../../store/useAppStore';
import { Ionicons } from '@expo/vector-icons';
import 'expo-router/entry';

export default function DashboardScreen() {
  const router = useRouter();
  const { profile, mealPlan, recipes } = useAppStore();

  const features = [
    {
      title: 'AI Meal Planner',
      description: 'Generate personalized meal plans that fit your body, goals, and budget.',
      route: '/meal-planner',
      icon: 'restaurant',
      color: '#D0B7D6',
    },
    {
      title: 'Recipe Bank',
      description: 'Explore and save delicious, cycle-friendly recipes.',
      route: '/recipes',
      icon: 'book',
      color: '#E0B0B3',
    },
    {
      title: 'Grocery List',
      description: 'Smart shopping lists generated from your meal plans.',
      route: '/grocery-list',
      icon: 'cart',
      color: '#C8A8D4',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to SmartHer Meal</Text>
        <Text style={styles.subtitle}>
          Your personal AI-powered nutrition assistant for hormonal health
        </Text>
      </View>

      {!profile && (
        <View style={styles.alertCard}>
          <Ionicons name="information-circle" size={24} color="#D0B7D6" />
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>Complete Your Profile</Text>
            <Text style={styles.alertText}>
              Set up your profile to get personalized meal plans
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/profile')}
            style={styles.alertButton}
          >
            <Text style={styles.alertButtonText}>Set Up</Text>
          </TouchableOpacity>
        </View>
      )}

      {profile && (
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Quick Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{mealPlan ? '1' : '0'}</Text>
              <Text style={styles.statLabel}>Active Meal Plan</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{recipes.length}</Text>
              <Text style={styles.statLabel}>Saved Recipes</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{profile.budget || 0}</Text>
              <Text style={styles.statLabel}>Weekly Budget</Text>
            </View>
          </View>
        </View>
      )}

      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>Features</Text>
        {features.map((feature, index) => (
          <TouchableOpacity
            key={index}
            style={styles.featureCard}
            onPress={() => router.push(feature.route as any)}
          >
            <View style={[styles.featureIcon, { backgroundColor: feature.color }]}>
              <Ionicons name={feature.icon as any} size={32} color="#fff" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#999" />
          </TouchableOpacity>
        ))}
      </View>

      {profile && mealPlan && (
        <View style={styles.currentPlanCard}>
          <Text style={styles.sectionTitle}>Current Meal Plan</Text>
          <View style={styles.planDetails}>
            <Text style={styles.planText}>
              Total Calories: {mealPlan.totalCalories} kcal
            </Text>
            {mealPlan.totalCost && (
              <Text style={styles.planText}>
                Estimated Cost: ${mealPlan.totalCost.toFixed(2)}
              </Text>
            )}
            <TouchableOpacity
              style={styles.viewButton}
              onPress={() => router.push('/meal-planner')}
            >
              <Text style={styles.viewButtonText}>View Details</Text>
            </TouchableOpacity>
          </View>
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
    backgroundColor: '#D0B7D6',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  alertCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#D0B7D6',
  },
  alertContent: {
    flex: 1,
    marginLeft: 12,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  alertText: {
    fontSize: 14,
    color: '#666',
  },
  alertButton: {
    backgroundColor: '#D0B7D6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  alertButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  statsCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 8,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#D0B7D6',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  featuresSection: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  featureIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureContent: {
    flex: 1,
    marginLeft: 16,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
  },
  currentPlanCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 8,
  },
  planDetails: {
    marginTop: 8,
  },
  planText: {
    fontSize: 14,
    marginBottom: 8,
    color: '#333',
  },
  viewButton: {
    backgroundColor: '#D0B7D6',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  viewButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});