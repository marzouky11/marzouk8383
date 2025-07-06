'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting relevant job categories based on a job description.
 *
 * - suggestJobCategories - A function that takes a job description and returns suggested job categories.
 * - SuggestJobCategoriesInput - The input type for the suggestJobCategories function.
 * - SuggestJobCategoriesOutput - The return type for the suggestJobCategories function.
 */

import { defineFlow } from 'genkit/flow';
import { geminiPro } from '@genkit-ai/googleai';
import * as z from 'zod';

const SuggestJobCategoriesInputSchema = z.object({
  jobDescription: z
    .string()
    .describe('The description of the job posting.'),
});
export type SuggestJobCategoriesInput = z.infer<
  typeof SuggestJobCategoriesInputSchema
>;

const SuggestJobCategoriesOutputSchema = z.object({
  categories: z
    .array(z.string())
    .describe('An array of suggested job categories.'),
});
export type SuggestJobCategoriesOutput = z.infer<
  typeof SuggestJobCategoriesOutputSchema
>;

const suggestJobCategoriesFlow = defineFlow(
  {
    name: 'suggestJobCategoriesFlow',
    inputSchema: SuggestJobCategoriesInputSchema,
    outputSchema: SuggestJobCategoriesOutputSchema,
  },
  async (input) => {
    const llmResponse = await geminiPro.generate({
      prompt: `You are a helpful assistant that suggests job categories based on a job description.

      Given the following job description, suggest up to 5 relevant job categories.
      Return ONLY a valid JSON object with a key "categories" which contains an array of strings. Do not include any other text or markdown formatting.
    
      Job Description: ${input.jobDescription}`,
    });

    const responseText = llmResponse.text();
    try {
        const parsedOutput = JSON.parse(responseText);
        return SuggestJobCategoriesOutputSchema.parse(parsedOutput);
    } catch (e) {
        console.error("Failed to parse LLM response as JSON:", responseText, e);
        throw new Error("Failed to get a valid JSON response from the AI model.");
    }
  }
);

export async function suggestJobCategories(
  input: SuggestJobCategoriesInput
): Promise<SuggestJobCategoriesOutput> {
  return await suggestJobCategoriesFlow(input);
}
