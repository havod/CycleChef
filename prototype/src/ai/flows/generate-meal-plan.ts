
'use server';
/**
 * @fileOverview Generates a personalized meal plan based on a user-provided prompt, taking into account the user's profile and budget.
 *
 * - generateMealPlan - A function that generates a meal plan based on user input.
 * - GenerateMealPlanInput - The input type for the generateMealPlan function.
 * - GenerateMealPlanOutput - The return type for the generateMealPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMealPlanInputSchema = z.object({
  userProfile: z.object({
    name: z.string().optional(),
    age: z.number().optional(),
    gender: z.enum(['F', 'M', 'Non defined']).optional(),
    country: z.string().optional(),
    dietaryPreferences: z
      .array(z.string())
      .describe('Dietary preferences like vegetarian, gluten-free, allergies')
      .optional(),
    otherDietaryPreference: z.string().describe('Other dietary preference or allergy specified by the user.').optional(),
    menstrualCycle: z.enum(['regular', 'irregular']).optional(),
    healthConditions: z.array(z.string()).describe('Health conditions like Endometriosis, PCOS, acne, etc.').optional(),
    weight: z.number().optional(),
    weightUnit: z.enum(['kg', 'lbs']).optional(),
    height: z.union([z.string(), z.number()]).optional(),
    heightUnit: z.enum(['cm', 'ft']).optional(),
    nutritionalGoals: z.array(z.string()).describe('Nutritional goals like weight loss, staying fit, weight gain').optional(),
    activityLevel: z.enum(['very', 'not', 'medium']).optional(),
    budget: z.number().optional().describe('Budget for meal plan'),
    budgetFrequency: z.enum(['weekly', 'bi-weekly', 'monthly']).optional().describe('Frequency of the budget (weekly, bi-weekly, or monthly)'),
    preferences: z.string().optional().describe('User-specified preferences for the meal plan'),
  }).optional(),
});

export type GenerateMealPlanInput = z.infer<typeof GenerateMealPlanInputSchema>;

const GenerateMealPlanOutputSchema = z.object({
  mealPlan: z.string().describe('The generated meal plan based on the user profile and budget.'),
  totalCalories: z.number().optional().describe('Total calories for the generated meal plan.'),
  estimatedPrice: z.number().optional().describe('Estimated price for the generated meal plan.'),
});

export type GenerateMealPlanOutput = z.infer<typeof GenerateMealPlanOutputSchema>;

export async function generateMealPlan(input: GenerateMealPlanInput): Promise<GenerateMealPlanOutput> {
  return generateMealPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMealPlanPrompt',
  input: {schema: GenerateMealPlanInputSchema},
  output: {schema: GenerateMealPlanOutputSchema},
  prompt: `You are an AI assistant specialized in generating personalized meal plans based on user profiles and budgets.

  Generate a meal plan based on the following user profile:
  {{#if userProfile}}
  Name: {{userProfile.name}}
  Age: {{userProfile.age}}
  Gender: {{userProfile.gender}}
  Country: {{userProfile.country}}
  Dietary Preferences: {{#each userProfile.dietaryPreferences}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  {{#if userProfile.otherDietaryPreference}}Other Dietary Preference: {{userProfile.otherDietaryPreference}}{{/if}}
  Menstrual Cycle: {{userProfile.menstrualCycle}}
  Health Conditions: {{#each userProfile.healthConditions}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  Weight: {{userProfile.weight}} {{userProfile.weightUnit}}
  Height: {{userProfile.height}} {{userProfile.heightUnit}}
  Nutritional Goals: {{#each userProfile.nutritionalGoals}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  Activity Level: {{userProfile.activityLevel}}
  Budget: {{userProfile.budget}} ({{userProfile.budgetFrequency}})
  {{#if userProfile.preferences}}Preferences: {{userProfile.preferences}}{{/if}}
  {{else}}
  No user profile provided.
  {{/if}}

  The meal plan should include a variety of meals and consider the user's preferences, health conditions, and goals, and respect the user's budget. Also include total calories and estimated price for the meal plan.
  Make sure to adjust the recommendations based on caloric needs.
  `,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const generateMealPlanFlow = ai.defineFlow(
  {
    name: 'generateMealPlanFlow',
    inputSchema: GenerateMealPlanInputSchema,
    outputSchema: GenerateMealPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
