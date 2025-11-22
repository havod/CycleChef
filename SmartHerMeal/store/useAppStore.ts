import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types - you'll migrate these from your prototype
export interface UserProfile {
  name: string;
  age: number;
  gender: 'female' | 'male' | 'non-binary' | 'prefer-not-to-say';
  country: string;
  dietaryPreferences: string[];
  otherDietaryPreference?: string;
  menstrualCycle: 'regular' | 'irregular' | 'not-applicable';
  healthConditions: string[];
  weight: number;
  weightUnit: 'kg' | 'lbs';
  height: number;
  heightUnit: 'cm' | 'ft';
  nutritionalGoals: string[];
  activityLevel: 'sedentary' | 'lightly-active' | 'moderately-active' | 'very-active' | 'extremely-active';
  budget?: number;
  budgetFrequency?: 'weekly' | 'bi-weekly' | 'monthly';
  preferences?: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  ingredients: string[];
  instructions: string[];
  nutritionInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  tags?: string[];
  cyclePhase?: string[];
}

export interface MealPlan {
  id: string;
  weekNumber?: number;
  totalCalories: number;
  totalCost?: number;
  meals: {
    day: string;
    breakfast: Recipe;
    lunch: Recipe;
    dinner: Recipe;
    snacks?: Recipe[];
  }[];
}

export interface GroceryList {
  items: {
    name: string;
    quantity: string;
    category: string;
    estimatedPrice?: number;
    checked: boolean;
  }[];
  totalEstimatedCost?: number;
  generatedFrom?: string; // meal plan id
}

interface AppState {
  // State
  profile: UserProfile | null;
  mealPlan: MealPlan | null;
  groceryList: GroceryList | null;
  recipes: Recipe[];
  isLoading: boolean;
  
  // Actions
  updateProfile: (profile: UserProfile) => void;
  setMealPlan: (mealPlan: MealPlan | null) => void;
  setGroceryList: (groceryList: GroceryList | null) => void;
  addRecipe: (recipe: Recipe) => void;
  removeRecipe: (recipeId: string) => void;
  toggleGroceryItem: (itemName: string) => void;
  clearMealPlan: () => void;
  clearGroceryList: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      profile: null,
      mealPlan: null,
      groceryList: null,
      recipes: [],
      isLoading: false,

      // Actions
      updateProfile: (profile) => {
        set({ profile });
      },

      setMealPlan: (mealPlan) => {
        set({ mealPlan });
        // When meal plan changes, grocery list is no longer valid
        if (mealPlan === null) {
          set({ groceryList: null });
        }
      },

      setGroceryList: (groceryList) => {
        set({ groceryList });
      },

      addRecipe: (recipe) => {
        set((state) => ({
          recipes: [...state.recipes, recipe],
        }));
      },

      removeRecipe: (recipeId) => {
        set((state) => ({
          recipes: state.recipes.filter((r) => r.id !== recipeId),
        }));
      },

      toggleGroceryItem: (itemName) => {
        set((state) => {
          if (!state.groceryList) return state;
          
          return {
            groceryList: {
              ...state.groceryList,
              items: state.groceryList.items.map((item) =>
                item.name === itemName
                  ? { ...item, checked: !item.checked }
                  : item
              ),
            },
          };
        });
      },

      clearMealPlan: () => {
        set({ mealPlan: null, groceryList: null });
      },

      clearGroceryList: () => {
        set({ groceryList: null });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'smarthermeal-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);