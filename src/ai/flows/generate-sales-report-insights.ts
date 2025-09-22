'use server';

/**
 * @fileOverview Generates insights from sales data to optimize inventory and sales strategies.
 *
 * - generateSalesReportInsights - A function that generates sales report insights.
 * - GenerateSalesReportInsightsInput - The input type for the generateSalesReportInsights function.
 * - GenerateSalesReportInsightsOutput - The return type for the generateSalesReportInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSalesReportInsightsInputSchema = z.object({
  salesData: z.string().describe('Sales data in JSON format.'),
});

export type GenerateSalesReportInsightsInput = z.infer<
  typeof GenerateSalesReportInsightsInputSchema
>;

const GenerateSalesReportInsightsOutputSchema = z.object({
  insights: z.string().describe('Generated insights from the sales data.'),
});

export type GenerateSalesReportInsightsOutput = z.infer<
  typeof GenerateSalesReportInsightsOutputSchema
>;

export async function generateSalesReportInsights(
  input: GenerateSalesReportInsightsInput
): Promise<GenerateSalesReportInsightsOutput> {
  return generateSalesReportInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSalesReportInsightsPrompt',
  input: {schema: GenerateSalesReportInsightsInputSchema},
  output: {schema: GenerateSalesReportInsightsOutputSchema},
  prompt: `You are a sales data analyst. Analyze the following sales data and generate insights, such as identifying best-selling products, peak sales times, and customer purchasing trends. Provide a summary of your findings.

Sales Data:
{{salesData}}`,
});

const generateSalesReportInsightsFlow = ai.defineFlow(
  {
    name: 'generateSalesReportInsightsFlow',
    inputSchema: GenerateSalesReportInsightsInputSchema,
    outputSchema: GenerateSalesReportInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
