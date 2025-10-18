'use server';
/**
 * @fileOverview Generates a personalized meal plan based on a user-provided prompt, taking into account the user's profile.
 *
 * - generateMealPlanFromPrompt - A function that generates a meal plan based on a prompt.
 * - GenerateMealPlanFromPromptInput - The input type for the generateMealPlanFromPrompt function.
 * - GenerateMealPlanFromPromptOutput - The return type for the generateMealPlanFromPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMealPlanFromPromptInputSchema = z.object({
  prompt: z
    .string()
    .describe("A prompt describing the desired meal plan (e.g., 'high protein, low carb meals for weight loss')."),
  userProfile: z.object({
    name: z.string().optional(),
    age: z.number().optional(),
    gender: z.enum(['F', 'M', 'Non defined']).optional(),
    country: z.string().optional(),
    dietaryPreferences: z
      .array(z.string())
      .describe('Dietary preferences like vegetarian, gluten-free, allergies')
      .optional(),
    menstrualCycle: z.enum(['regular', 'irregular']).optional(),
    healthConditions: z.array(z.string()).describe('Health conditions like Endometriosis, PCOS, acne, etc.').optional(),
    weight: z.number().optional(),
    height: z.number().optional(),
    nutritionalGoals: z.array(z.string()).describe('Nutritional goals like weight loss, staying fit, weight gain').optional(),
    activityLevel: z.enum(['very', 'not', 'medium']).optional(),
    budget: z.number().optional().describe('Weekly or monthly budget for meal plan'),
  }).optional(),
});

export type GenerateMealPlanFromPromptInput = z.infer<typeof GenerateMealPlanFromPromptInputSchema>;

const GenerateMealPlanFromPromptOutputSchema = z.object({
  mealPlan: z.string().describe('The generated meal plan based on the prompt and user profile.'),
  totalCalories: z.number().optional().describe('Total calories for the generated meal plan.'),
});

export type GenerateMealPlanFromPromptOutput = z.infer<typeof GenerateMealPlanFromPromptOutputSchema>;

export async function generateMealPlanFromPrompt(input: GenerateMealPlanFromPromptInput): Promise<GenerateMealPlanFromPromptOutput> {
  return generateMealPlanFromPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMealPlanFromPromptPrompt',
  input: {schema: GenerateMealPlanFromPromptInputSchema},
  output: {schema: GenerateMealPlanFromPromptOutputSchema},
  prompt: `You are an AI assistant specialized in generating personalized meal plans based on user prompts and profiles.

  Generate a meal plan based on the following prompt:
  {{prompt}}

  Consider the following user profile when generating the meal plan:
  {{#if userProfile}}
  Name: {{userProfile.name}}
  Age: {{userProfile.age}}
  Gender: {{userProfile.gender}}
  Country: {{userProfile.country}}
  Dietary Preferences: {{#each userProfile.dietaryPreferences}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  Menstrual Cycle: {{userProfile.menstrualCycle}}
  Health Conditions: {{#each userProfile.healthConditions}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  Weight: {{userProfile.weight}}
  Height: {{userProfile.height}}
  Nutritional Goals: {{#each userProfile.nutritionalGoals}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  Activity Level: {{userProfile.activityLevel}}
  Budget: {{userProfile.budget}}
  {{else}}
  No user profile provided.
  {{/if}}

  The meal plan should include a variety of meals and consider the user's preferences, health conditions, and goals. Also include total calories in the meal plan.
  Make sure to adjust the recommendations based on caloric needs.
  `,config: {
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

const generateMealPlanFromPromptFlow = ai.defineFlow(
  {
    name: 'generateMealPlanFromPromptFlow',
    inputSchema: GenerateMealPlanFromPromptInputSchema,
    outputSchema: GenerateMealPlanFromPromptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

