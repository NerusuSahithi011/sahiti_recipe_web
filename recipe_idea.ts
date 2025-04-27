'use server';

/**
 * @fileOverview Generates recipe ideas based on a list of ingredients.
 *
 * - generateRecipeIdeas - A function that generates recipe ideas.
 * - GenerateRecipeIdeasInput - The input type for the generateRecipeIdeas function.
 * - GenerateRecipeIdeasOutput - The return type for the generateRecipeIdeas function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateRecipeIdeasInputSchema = z.object({
  ingredients: z
    .string()
    .describe('A comma-separated list of 3-5 ingredients to use in the recipe.'),
});
export type GenerateRecipeIdeasInput = z.infer<typeof GenerateRecipeIdeasInputSchema>;

const GenerateRecipeIdeasOutputSchema = z.object({
  recipes: z
    .array(z.string())
    .describe('An array of recipe ideas based on the provided ingredients.'),
});
export type GenerateRecipeIdeasOutput = z.infer<typeof GenerateRecipeIdeasOutputSchema>;

export async function generateRecipeIdeas(input: GenerateRecipeIdeasInput): Promise<GenerateRecipeIdeasOutput> {
  return generateRecipeIdeasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRecipeIdeasPrompt',
  input: {
    schema: z.object({
      ingredients: z
        .string()
        .describe('A comma-separated list of 3-5 ingredients to use in the recipe.'),
    }),
  },
  output: {
    schema: z.object({
      recipes: z
        .array(z.string())
        .describe('An array of recipe ideas based on the provided ingredients.'),
    }),
  },
  prompt: `You are a recipe idea generator. Given a list of ingredients, you will generate creative recipe ideas.

  Ingredients: {{{ingredients}}}

  Please provide at least 3 recipe ideas that creatively utilize the given ingredients.
  Format each recipe idea as a concise sentence.
  Output should be an array of strings.`,
});

const generateRecipeIdeasFlow = ai.defineFlow<
  typeof GenerateRecipeIdeasInputSchema,
  typeof GenerateRecipeIdeasOutputSchema
>(
  {
    name: 'generateRecipeIdeasFlow',
    inputSchema: GenerateRecipeIdeasInputSchema,
    outputSchema: GenerateRecipeIdeasOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
