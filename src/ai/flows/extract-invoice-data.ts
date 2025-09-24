"use server";

/**
 * @fileOverview Extracts structured data from an invoice image.
 *
 * - extractInvoiceData - A function that extracts product data from an invoice image.
 * - ExtractInvoiceDataInput - The input type for the extractInvoiceData function.
 * - ExtractInvoiceDataOutput - The return type for the extractInvoiceData function.
 */

import { ai } from "@/ai/genkit";
import { z } from "genkit";

const ExtractInvoiceDataInputSchema = z.object({
  invoiceImage: z
    .string()
    .describe(
      "An image of a product invoice, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractInvoiceDataInput = z.infer<
  typeof ExtractInvoiceDataInputSchema
>;

const ProductSchema = z.object({
    name: z.string().describe('The name of the product.'),
    quantity: z.number().describe('The quantity of the product.'),
    purchasePrice: z.number().describe('The unit price of the product.'),
    barcode: z.string().optional().describe('The barcode of the product, if available.'),
});

const ExtractInvoiceDataOutputSchema = z.object({
  products: z.array(ProductSchema).describe('An array of products found in the invoice.'),
  supplier: z.string().optional().describe('The name of the supplier/vendor from the invoice.'),
  invoiceDate: z.string().optional().describe('The date of the invoice in YYYY-MM-DD format.'),
});

export type ExtractedProduct = z.infer<typeof ProductSchema>;
export type ExtractInvoiceDataOutput = z.infer<
  typeof ExtractInvoiceDataOutputSchema
>;

export async function extractInvoiceData(
  input: ExtractInvoiceDataInput
): Promise<ExtractInvoiceDataOutput> {
  return extractInvoiceDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractInvoiceDataPrompt',
  input: {schema: ExtractInvoiceDataInputSchema},
  output: {schema: ExtractInvoiceDataOutputSchema},
  prompt: `You are an expert at extracting structured data from images of invoices. Analyze the provided invoice image and extract the following information:
1. A list of all products, including their name, quantity, and unit purchase price.
2. The name of the supplier or store.
3. The date of the invoice.

Return the data in the specified JSON format. If a piece of information (like supplier or date) is not found, omit it.

Invoice Image:
{{media url=invoiceImage}}`,
});

const extractInvoiceDataFlow = ai.defineFlow(
  {
    name: 'extractInvoiceDataFlow',
    inputSchema: ExtractInvoiceDataInputSchema,
    outputSchema: ExtractInvoiceDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
