'use server';

/**
 * @fileOverview Generates insights from sales data to optimize inventory and sales strategies.
 *
 * - generateSalesReportInsights - A function that generates sales report insights.
 * - GenerateSalesReportInsightsInput - The input type for the generateSalesReportInsights function.
 * - GenerateSalesReportInsightsOutput - The return type for the generateSalesReportInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const GenerateSalesReportInsightsInputSchema = z.object({
  salesData: z.string().describe('Sales data in JSON format.'),
  language: z.string().describe('The language for the response (e.g., "Portuguese" or "English").'),
});

export type GenerateSalesReportInsightsInput = z.infer<
  typeof GenerateSalesReportInsightsInputSchema
>;

const GenerateSalesReportInsightsOutputSchema = z.object({
  bestSellingProducts: z.array(z.object({
    name: z.string().describe('The name of the product.'),
    quantity: z.number().describe('The total quantity sold.'),
    revenue: z.number().describe('The total revenue generated.'),
  })).describe('A list of the top 3 best-selling products.'),
  peakSalesTimes: z.object({
      trend: z.string().describe('A summary of the peak sales time trend (e.g., morning, afternoon).'),
      details: z.string().describe('More details about the sales times.'),
  }).describe('Analysis of when sales are most frequent.'),
  customerTrends: z.array(z.object({
      customer: z.string().describe("Customer's name or identifier (e.g., 'Unidentified Customer')."),
      trend: z.string().describe('A summary of the purchasing trend for this customer.'),
  })).describe('Insights into the purchasing habits of key customers.'),
  overallSummary: z.string().describe('A brief overall summary of all insights.'),
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
  prompt: `You are a sales data analyst. Analyze the following sales data and generate insights to be returned in a structured JSON format. The entire response, including all text fields in the output schema, must be in {{language}}.

Analyze the following key areas:
1.  **Best-Selling Products**: Identify the top 3 best-selling products by quantity and total revenue.
2.  **Peak Sales Times**: Observe any trends in transaction times (e.g., morning rush, afternoon lull).
3.  **Customer Purchasing Trends**: Analyze the behavior of identified customers and note any patterns for unidentified ones.
4.  **Overall Summary**: Provide a very brief, high-level summary of your most important finding.

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
