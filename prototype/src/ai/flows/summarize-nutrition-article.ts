'use server';

/**
 * @fileOverview Summarizes key points from a nutrition article given its URL.
 *
 * - summarizeNutritionArticle - A function that summarizes a nutrition article.
 * - SummarizeNutritionArticleInput - The input type for the summarizeNutritionArticle function.
 * - SummarizeNutritionArticleOutput - The return type for the summarizeNutritionArticle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeNutritionArticleInputSchema = z.object({
  articleUrl: z.string().describe('URL of the nutrition article to summarize.'),
});
export type SummarizeNutritionArticleInput = z.infer<typeof SummarizeNutritionArticleInputSchema>;

const SummarizeNutritionArticleOutputSchema = z.object({
  summary: z.string().describe('A summary of the key points in the article.'),
});
export type SummarizeNutritionArticleOutput = z.infer<typeof SummarizeNutritionArticleOutputSchema>;

export async function summarizeNutritionArticle(
  input: SummarizeNutritionArticleInput
): Promise<SummarizeNutritionArticleOutput> {
  return summarizeNutritionArticleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeNutritionArticlePrompt',
  input: {schema: SummarizeNutritionArticleInputSchema},
  output: {schema: SummarizeNutritionArticleOutputSchema},
  prompt: `You are an expert nutritionist. Summarize the key points of the nutrition article found at the following URL:\n\n{{{articleUrl}}}`,
});

const summarizeNutritionArticleFlow = ai.defineFlow(
  {
    name: 'summarizeNutritionArticleFlow',
    inputSchema: SummarizeNutritionArticleInputSchema,
    outputSchema: SummarizeNutritionArticleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
