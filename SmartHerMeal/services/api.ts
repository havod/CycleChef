import { UserProfile, MealPlan } from '../store/useAppStore';

// Update this with your actual API URL
// For development: Use your local IP (e.g., 'http://192.168.1.x:3000')
// For production: Use your deployed URL
const API_BASE_URL = __DEV__ 
  ? 'http://192.168.1.100:3000' // Replace with your local IP
  : 'https://your-production-url.com';

export interface GenerateMealPlanResponse {
  mealPlan: string;
  totalCalories?: number;
  estimatedPrice?: number;
}

export const apiService = {
  /**
   * Generate a meal plan using AI
   */
  async generateMealPlan(userProfile: UserProfile): Promise<GenerateMealPlanResponse> {
    const response = await fetch(`${API_BASE_URL}/api/generate-meal-plan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userProfile }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to generate meal plan');
    }

    return response.json();
  },

  /**
   * Derive a grocery list from a meal plan
   */
  async deriveGroceryList(params: {
    mealPlan: string;
    budget?: number;
    groceryStore?: string;
    country?: string;
    currency?: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/api/derive-grocery-list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to derive grocery list');
    }

    return response.json();
  },

  /**
   * Check API health
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`, {
        method: 'GET',
      });
      return response.ok;
    } catch {
      return false;
    }
  },
};