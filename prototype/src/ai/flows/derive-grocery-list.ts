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
  budget: z.number().optional().describe('The user’s weekly or monthly budget for the meal plan'),
  groceryStore: z.string().optional().describe("The user's preferred grocery store (e.g., 'Trader Joe's', 'Whole Foods', 'Any')."),
  country: z.string().optional().describe("The user's country of residence."),
  currency: z.string().optional().describe("The currency for price estimations (e.g., USD, EUR)."),
});

export type DeriveGroceryListInput = z.infer<typeof DeriveGroceryListInputSchema>;

const DeriveGroceryListOutputSchema = z.object({
  groceryList: z.string().describe('A list of grocery items with estimated prices, grouped by store section.'),
  estimatedPrice: z.number().optional().describe('The estimated total price for the grocery list in the specified currency.'),
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
  prompt: `You are an AI assistant specialized in generating grocery lists from meal plans, tailored to a user's location and preferred store.

  Generate a grocery list based on the following meal plan:
  {{mealPlan}}

  The user is located in {{country}}. All price estimates should be in {{currency}}.

  {{#if groceryStore}}
  The user prefers to shop at {{groceryStore}}. Tailor the item suggestions and estimated prices to this store. If the store is "Any Store", provide general estimates relevant to the user's country.
  {{/if}}

  {{#if budget}}
  Consider the user's budget of {{budget}} {{currency}} when generating the grocery list. Provide options that allow the user to stay within their budget.
  {{/if}}

  The grocery list should:
  - Include all ingredients necessary for the meal plan.
  - Estimate prices for each item in {{currency}}, based on the specified country and grocery store.
  - The format for each item must be: \`* [Item Name] - [Price]\`. For example: \`* Milk (1 gallon) - 3.50\`
  - Group items by store section (e.g., Produce, Dairy, Meat, Pantry) using Markdown headings.
  - At the end of the generation, provide a total estimated price for all items in the list.
  `,
});

const deriveGroceryListFlow = ai.defineFlow(
  {
    name: 'deriveGroceryListFlow',
    inputSchema: DeriveGroceryListInputSchema,
    outputSchema: DeriveGroceryListOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
