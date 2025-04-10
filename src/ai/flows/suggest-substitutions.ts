// src/ai/flows/suggest-substitutions.ts
'use server';

/**
 * @fileOverview A ingredient substitution suggestion AI agent.
 *
 * - suggestIngredientSubstitutions - A function that handles the ingredient substitution suggestion process.
 * - SuggestIngredientSubstitutionsInput - The input type for the suggestIngredientSubstitutions function.
 * - SuggestIngredientSubstitutionsOutput - The return type for the suggestIngredientSubstitutions function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SuggestIngredientSubstitutionsInputSchema = z.object({
  recipeName: z.string().describe('The name of the recipe.'),
  missingIngredient: z.string().describe('The ingredient that needs a substitution.'),
  availableIngredients: z.array(z.string()).describe('The ingredients the user has available.'),
});
export type SuggestIngredientSubstitutionsInput = z.infer<
  typeof SuggestIngredientSubstitutionsInputSchema
>;

const SuggestIngredientSubstitutionsOutputSchema = z.object({
  substitutions: z
    .array(
      z.object({
        ingredient: z.string().describe('The suggested ingredient substitution.'),
        reason: z.string().describe('The reason why this ingredient is a good substitution.'),
      })
    )
    .describe('The suggested ingredient substitutions.'),
});
export type SuggestIngredientSubstitutionsOutput = z.infer<
  typeof SuggestIngredientSubstitutionsOutputSchema
>;

export async function suggestIngredientSubstitutions(
  input: SuggestIngredientSubstitutionsInput
): Promise<SuggestIngredientSubstitutionsOutput> {
  return suggestIngredientSubstitutionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestIngredientSubstitutionsPrompt',
  input: {
    schema: z.object({
      recipeName: z.string().describe('The name of the recipe.'),
      missingIngredient: z.string().describe('The ingredient that needs a substitution.'),
      availableIngredients: z.array(z.string()).describe('The ingredients the user has available.'),
    }),
  },
  output: {
    schema: z.object({
      substitutions: z
        .array(
          z.object({
            ingredient: z.string().describe('The suggested ingredient substitution.'),
            reason: z.string().describe('The reason why this ingredient is a good substitution.'),
          })
        )
        .describe('The suggested ingredient substitutions.'),
    }),
  },
  prompt: `You are a helpful recipe assistant. A user is missing an ingredient in a recipe and wants suggestions for substitutions using the ingredients they have available.

Recipe Name: {{{recipeName}}}
Missing Ingredient: {{{missingIngredient}}}
Available Ingredients: {{#each availableIngredients}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Suggest ingredient substitutions using only the ingredients that the user has available. Give a reason why the ingredient is a good substitution.
`,
});

const suggestIngredientSubstitutionsFlow = ai.defineFlow<
  typeof SuggestIngredientSubstitutionsInputSchema,
  typeof SuggestIngredientSubstitutionsOutputSchema
>(
  {
    name: 'suggestIngredientSubstitutionsFlow',
    inputSchema: SuggestIngredientSubstitutionsInputSchema,
    outputSchema: SuggestIngredientSubstitutionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
