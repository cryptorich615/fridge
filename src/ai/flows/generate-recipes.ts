'use server';
/**
 * @fileOverview Generates recipe suggestions based on a list of ingredients.
 *
 * - generateRecipes - A function that generates recipe suggestions.
 * - GenerateRecipesInput - The input type for the generateRecipes function.
 * - GenerateRecipesOutput - The return type for the generateRecipes function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import {getDietaryRestrictions} from '@/services/dietary-filter';

const GenerateRecipesInputSchema = z.object({
  ingredients: z.array(z.string()).describe('A list of ingredients available.'),
  dietaryRestrictions: z.array(z.string()).optional().describe('Dietary restrictions to consider when generating recipes.'),
});
export type GenerateRecipesInput = z.infer<typeof GenerateRecipesInputSchema>;

const GenerateRecipesOutputSchema = z.object({
  recipes: z.array(
    z.object({
      name: z.string().describe('The name of the recipe.'),
      ingredients: z.array(z.string()).describe('A list of ingredients required for the recipe.'),
      instructions: z.string().describe('The instructions for preparing the recipe.'),
    })
  ).describe('A list of recipe suggestions.'),
});
export type GenerateRecipesOutput = z.infer<typeof GenerateRecipesOutputSchema>;

export async function generateRecipes(input: GenerateRecipesInput): Promise<GenerateRecipesOutput> {
  return generateRecipesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRecipesPrompt',
  input: {
    schema: z.object({
      ingredients: z.array(z.string()).describe('A list of ingredients available.'),
      dietaryRestrictions: z.array(z.string()).optional().describe('Dietary restrictions to consider when generating recipes.'),
    }),
  },
  output: {
    schema: z.object({
      recipes: z.array(
        z.object({
          name: z.string().describe('The name of the recipe.'),
          ingredients: z.array(z.string()).describe('A list of ingredients required for the recipe.'),
          instructions: z.string().describe('The instructions for preparing the recipe.'),
        })
      ).describe('A list of recipe suggestions.'),
    }),
  },
  prompt: `You are a recipe assistant that generates recipe suggestions based on the ingredients provided.

  Ingredients:
  {{#each ingredients}}
  - {{{this}}}
  {{/each}}

  {{#if dietaryRestrictions}}
  Dietary Restrictions:
  {{#each dietaryRestrictions}}
  - {{{this}}}
  {{/each}}
  {{/if}}

  Generate a list of recipe suggestions using the ingredients above. Each recipe suggestion should include the recipe name, a list of ingredients required for the recipe, and the instructions for preparing the recipe.
  Recipes should adhere to provided dietary restrictions.
  `, 
});

const generateRecipesFlow = ai.defineFlow<
  typeof GenerateRecipesInputSchema,
  typeof GenerateRecipesOutputSchema
>({
  name: 'generateRecipesFlow',
  inputSchema: GenerateRecipesInputSchema,
  outputSchema: GenerateRecipesOutputSchema,
}, async input => {
  const {output} = await prompt(input);
  return output!;
});
