// This file is machine-generated - edit at your own risk!

'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting relevant job categories based on a job description.
 *
 * - suggestJobCategories - A function that takes a job description and returns suggested job categories.
 * - SuggestJobCategoriesInput - The input type for the suggestJobCategories function.
 * - SuggestJobCategoriesOutput - The return type for the suggestJobCategories function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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

export async function suggestJobCategories(
  input: SuggestJobCategoriesInput
): Promise<SuggestJobCategoriesOutput> {
  return suggestJobCategoriesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestJobCategoriesPrompt',
  input: {schema: SuggestJobCategoriesInputSchema},
  output: {schema: SuggestJobCategoriesOutputSchema},
  prompt: `You are a helpful assistant that suggests job categories based on a job description.

  Given the following job description, suggest up to 5 relevant job categories.
  Return the categories as a JSON array of strings.

  Job Description: {{{jobDescription}}}`,
});

const suggestJobCategoriesFlow = ai.defineFlow(
  {
    name: 'suggestJobCategoriesFlow',
    inputSchema: SuggestJobCategoriesInputSchema,
    outputSchema: SuggestJobCategoriesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
