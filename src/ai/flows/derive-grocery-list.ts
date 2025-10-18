'use server';

/**
 * @fileOverview Derives a grocery list from a meal plan and estimates prices.
 *
 * - deriveGroceryList - A function that derives a grocery list from a meal plan.
 * - DeriveGroceryListInput - The input type for the deriveGroceryList function.
 * - DeriveGroceryListOutput - The return type for the deriveGroceryList function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DeriveGroceryListInputSchema = z.object({
  mealPlan: z.string().describe('The meal plan to derive the grocery list from.'),
  budget: z.number().optional().describe('The user\u2019s weekly or monthly budget for the meal plan'),
});

export type DeriveGroceryListInput = z.infer<typeof DeriveGroceryListInputSchema>;

const DeriveGroceryListOutputSchema = z.object({
  groceryList: z.string().describe('A list of grocery items with estimated prices, grouped by store section.'),
});

export type DeriveGroceryListOutput = z.infer<typeof DeriveGroceryListOutputSchema>;

export async function deriveGroceryList(
  input: DeriveGroceryListInput
): Promise<DeriveGroceryListOutput> {
  return deriveGroceryListFlow(input);
}

const prompt = ai.definePrompt({
  name: 'deriveGroceryListPrompt',
  input: {schema: DeriveGroceryListInputSchema},
  output: {schema: DeriveGroceryListOutputSchema},
  prompt: `You are an AI assistant specialized in generating grocery lists from meal plans.

  Generate a grocery list based on the following meal plan:
  {{mealPlan}}

  {% if budget %}
  Consider the user's budget of {{budget}} when generating the grocery list. Provide options that allow the user to stay within their budget.
  {% endif %}

  The grocery list should:
  - Include all ingredients necessary for the meal plan.
  - Estimate prices for each item.
  - Group items by store section (e.g., Produce, Dairy, Meat, Pantry).
  - Format the output using Markdown. Use headings for sections (e.g., \