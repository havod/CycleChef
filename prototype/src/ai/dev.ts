import { config } from 'dotenv';
config();

import '@/ai/flows/adjust-budget-and-regenerate.ts';
import '@/ai/flows/derive-grocery-list.ts';
import '@/ai/flows/generate-meal-plan-from-prompt.ts';
import '@/ai/flows/generate-meal-plan.ts';
import '@/ai/flows/summarize-nutrition-article.ts';