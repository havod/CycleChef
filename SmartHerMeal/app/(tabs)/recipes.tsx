import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useAppStore } from '../../store/useAppStore';
import { useRouter } from 'expo-router';

export default  function RecipesScreen() {
  const { recipes } = useAppStore();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recipe Bank</Text>
        <Text style={styles.subtitle}>
          {recipes.length} recipes available
        </Text>
      </View>

      {recipes.length === 0 ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>No Recipes Yet</Text>
          <Text style={styles.cardText}>
            Generate a meal plan to get recipe suggestions
          </Text>
        </View>
      ) : (
        recipes.map((recipe) => (
          <View key={recipe.id} style={styles.card}>
            <Text style={styles.cardTitle}>{recipe.name}</Text>
            <Text style={styles.cardText}>{recipe.description}</Text>
          </View>
        ))
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
