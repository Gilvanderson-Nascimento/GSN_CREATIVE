'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-optimal-price.ts';
import '@/ai/flows/generate-sales-report-insights.ts';
import '@/ai/flows/extract-invoice-data.ts';
