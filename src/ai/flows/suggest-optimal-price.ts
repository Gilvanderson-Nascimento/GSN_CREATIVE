'use server';

/**
 * @fileOverview A flow that suggests an optimal sales price for a product based on its purchase price, tax rate, and desired profit margin.
 *
 * - suggestOptimalPrice - A function that suggests the optimal sales price.
 * - SuggestOptimalPriceInput - The input type for the suggestOptimalPrice function.
 * - SuggestOptimalPriceOutput - The return type for the suggestOptimalPrice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestOptimalPriceInputSchema = z.object({
  purchasePrice: z
    .number()
    .describe('The purchase price of the product.'),
  taxRate: z
    .number()
    .describe('The tax rate as a decimal (e.g., 0.1 for 10%).'),
  profitMargin: z
    .number()
    .describe('The desired profit margin as a decimal (e.g., 0.2 for 20%).'),
});
export type SuggestOptimalPriceInput = z.infer<typeof SuggestOptimalPriceInputSchema>;

const SuggestOptimalPriceOutputSchema = z.object({
  suggestedSalesPrice: z
    .number()
    .describe('The suggested sales price of the product.'),
});
export type SuggestOptimalPriceOutput = z.infer<typeof SuggestOptimalPriceOutputSchema>;

export async function suggestOptimalPrice(input: SuggestOptimalPriceInput): Promise<SuggestOptimalPriceOutput> {
  return suggestOptimalPriceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestOptimalPricePrompt',
  input: {schema: SuggestOptimalPriceInputSchema},
  output: {schema: SuggestOptimalPriceOutputSchema},
  prompt: `Given the purchase price, tax rate, and desired profit margin, suggest an optimal sales price for the product.

Purchase Price: {{{purchasePrice}}}
Tax Rate: {{{taxRate}}}
Profit Margin: {{{profitMargin}}}

Calculate the suggested sales price based on these values. Consider that the suggested sales price should cover the purchase price, tax, and desired profit margin.
Ensure that the suggested sales price is a number.`, 
});

const suggestOptimalPriceFlow = ai.defineFlow(
  {
    name: 'suggestOptimalPriceFlow',
    inputSchema: SuggestOptimalPriceInputSchema,
    outputSchema: SuggestOptimalPriceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
