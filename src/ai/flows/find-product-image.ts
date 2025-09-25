"use server";

/**
 * @fileOverview Finds a suitable image URL for a given product name.
 *
 * - findProductImage - A function that finds an image URL for a product.
 * - FindProductImageInput - The input type for the findProductImage function.
 * - FindProductImageOutput - The return type for the findProductImage function.
 */

import { ai } from "@/ai/genkit";
import { z } from "genkit";

const FindProductImageInputSchema = z.object({
  productName: z.string().describe('The name of the product to find an image for.'),
});
export type FindProductImageInput = z.infer<typeof FindProductImageInputSchema>;

const FindProductImageOutputSchema = z.object({
  imageUrl: z.string().describe('The URL of the found image.'),
});
export type FindProductImageOutput = z.infer<typeof FindProductImageOutputSchema>;

export async function findProductImage(
  input: FindProductImageInput
): Promise<FindProductImageOutput> {
  return findProductImageFlow(input);
}

const findImageTool = ai.defineTool(
    {
        name: 'findImage',
        description: 'Search Google for an image of a product and return its URL.',
        inputSchema: z.object({
            query: z.string().describe('The search query for the product image.'),
        }),
        outputSchema: z.object({
            imageUrl: z.string().describe('The URL of the found image.'),
        }),
    },
    async (input) => {
        // In a real scenario, this would call a Google Search API.
        // For this demo, we'll construct a plausible Unsplash URL.
        const query = input.query.toLowerCase().replace(/\s+/g, '-');
        // This is a placeholder. A real implementation would use an actual search API.
        // We'll use a fixed image for predictability in the example.
        return {
            imageUrl: `https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?q=80&w=880&auto=format&fit=crop`,
        };
    }
);

const prompt = ai.definePrompt({
  name: 'findProductImagePrompt',
  input: {schema: FindProductImageInputSchema},
  output: {schema: FindProductImageOutputSchema},
  tools: [findImageTool],
  prompt: `Find a high-quality, professional image URL for the product: {{{productName}}}. Use the findImage tool.`,
});

const findProductImageFlow = ai.defineFlow(
  {
    name: 'findProductImageFlow',
    inputSchema: FindProductImageInputSchema,
    outputSchema: FindProductImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
