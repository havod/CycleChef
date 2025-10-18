'use server';
/**
 * @fileOverview Adjusts the weekly budget and regenerates the meal plan accordingly.
 *
 * - adjustBudgetAndRegenerate - A function that adjusts the budget and regenerates the meal plan.
 * - AdjustBudgetAndRegenerateInput - The input type for the adjustBudgetAndRegenerate function.
 * - AdjustBudgetAndRegenerateOutput - The return type for the adjustBudgetAndRegenerate function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdjustBudgetAndRegenerateInputSchema = z.object({
  prompt: z
    .string()
    .describe("A prompt describing the desired meal plan (e.g., 'high protein, low carb meals for weight loss')."),
  weeklyBudget: z.number().describe('The weekly budget for the meal plan.'),
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
    height: z.number().optional(),
    nutritionalGoals: z.array(z.string()).describe('Nutritional goals like weight loss, staying fit, weight gain').optional(),
    activityLevel: z.enum(['very', 'not', 'medium']).optional(),
  }).optional(),
});

export type AdjustBudgetAndRegenerateInput = z.infer<typeof AdjustBudgetAndRegenerateInputSchema>;

const AdjustBudgetAndRegenerateOutputSchema = z.object({
  mealPlan: z.string().describe('The generated meal plan based on the prompt, user profile and adjusted budget.'),
  totalCalories: z.number().optional().describe('Total calories for the generated meal plan.'),
});

export type AdjustBudgetAndRegenerateOutput = z.infer<typeof AdjustBudgetAndRegenerateOutputSchema>;

export async function adjustBudgetAndRegenerate(
  input: AdjustBudgetAndRegenerateInput
): Promise<AdjustBudgetAndRegenerateOutput> {
  return adjustBudgetAndRegenerateFlow(input);
}

const prompt = ai.definePrompt({
  name: 'adjustBudgetAndRegeneratePrompt',
  input: {schema: AdjustBudgetAndRegenerateInputSchema},
  output: {schema: AdjustBudgetAndRegenerateOutputSchema},
  prompt: `You are an AI assistant specialized in generating personalized meal plans based on user prompts, profiles, and budget constraints.

  Generate a meal plan based on the following prompt:
  {{prompt}}

  Consider the following user profile when generating the meal plan:
  {{#if userProfile}}
  Name: {{userProfile.name}}
  Age: {{userProfile.age}}
  Gender: {{userProfile.gender}}
  Country: {{userProfile.country}}
  Dietary Preferences: {{#each userProfile.dietaryPreferences}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  {{#if userProfile.otherDietaryPreference}}Other Dietary Preference: {{userProfile.otherDietaryPreference}}{{/if}}
  Menstrual Cycle: {{userProfile.menstrualCycle}}
  Health Conditions: {{#each userProfile.healthConditions}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  Weight: {{userProfile.weight}}
  Height: {{userProfile.height}}
  Nutritional Goals: {{#each userProfile.nutritionalGoals}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  Activity Level: {{userProfile.activityLevel}}
  {{else}}
  No user profile provided.
  {{/if}}

  The meal plan should adhere to a weekly budget of {{weeklyBudget}}.
  The meal plan should include a variety of meals and consider the user's preferences, health conditions, and goals. Also include total calories in the meal plan.
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

const adjustBudgetAndRegenerateFlow = ai.defineFlow(
  {
    name: 'adjustBudgetAndRegenerateFlow',
    inputSchema: AdjustBudgetAndRegenerateInputSchema,
    outputSchema: AdjustBudgetAndRegenerateOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
