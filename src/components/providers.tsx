'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { UserProfile, Recipe } from '@/lib/types';
import type { GenerateMealPlanFromPromptOutput } from '@/ai/flows/generate-meal-plan-from-prompt';
import { recipes as initialRecipes } from '@/lib/data';

interface AppContextType {
  profile: UserProfile | null;
  updateProfile: (data: UserProfile) => void;
  mealPlan: GenerateMealPlanFromPromptOutput | null;
  setMealPlan: (plan: GenerateMealPlanFromPromptOutput | null) => void;
  recipes: Recipe[];
  addRecipe: (recipe: Recipe) => void;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function Providers({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [mealPlan, setMealPlanState] = useState<GenerateMealPlanFromPromptOutput | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem('cycleChefProfile');
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
      }

      const storedMealPlan = localStorage.getItem('cycleChefMealPlan');
      if (storedMealPlan) {
        setMealPlanState(JSON.parse(storedMealPlan));
      }
      
      const storedRecipes = localStorage.getItem('cycleChefRecipes');
      if (storedRecipes) {
        const userRecipes = JSON.parse(storedRecipes) as Recipe[];
        setRecipes(prev => [...prev, ...userRecipes]);
      }

    } catch (error) {
      console.error('Failed to parse data from localStorage', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback((data: UserProfile) => {
    setProfile(data);
    try {
      localStorage.setItem('cycleChefProfile', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save profile to localStorage', error);
    }
  }, []);

  const setMealPlan = useCallback((plan: GenerateMealPlanFromPromptOutput | null) => {
    setMealPlanState(plan);
    try {
      if (plan) {
        localStorage.setItem('cycleChefMealPlan', JSON.stringify(plan));
      } else {
        localStorage.removeItem('cycleChefMealPlan');
      }
    } catch (error) {
      console.error('Failed to save meal plan to localStorage', error);
    }
  }, []);

  const addRecipe = useCallback((recipe: Recipe) => {
    setRecipes(prevRecipes => {
      const newRecipes = [...prevRecipes, recipe];
      try {
        const userRecipes = newRecipes.filter(r => r.id.startsWith('user-'));
        localStorage.setItem('cycleChefRecipes', JSON.stringify(userRecipes));
      } catch (error) {
        console.error('Failed to save recipes to localStorage', error);
      }
      return newRecipes;
    });
  }, []);


  const value = { profile, updateProfile, isLoading, mealPlan, setMealPlan, recipes, addRecipe };

  return (
    <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
  );
}

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within a Providers component');
  }
  return context;
};
