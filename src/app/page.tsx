"use client";

import { useState } from "react";
import { generateRecipes } from "@/ai/flows/generate-recipes";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { DietaryRestriction, getDietaryRestrictions } from "@/services/dietary-filter";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect } from "react";

export default function Home() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [newIngredient, setNewIngredient] = useState<string>("");
  const [recipes, setRecipes] = useState<any[]>([]);
  const [dietaryRestrictions, setDietaryRestrictions] = useState<DietaryRestriction[]>([]);
  const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>([]);

  useEffect(() => {
    const loadRestrictions = async () => {
      const restrictions = await getDietaryRestrictions();
      setDietaryRestrictions(restrictions);
    };
    loadRestrictions();
  }, []);


  const addIngredient = () => {
    if (newIngredient.trim() !== "") {
      setIngredients([...ingredients, newIngredient.trim()]);
      setNewIngredient("");
    }
  };

  const removeIngredient = (ingredientToRemove: string) => {
    setIngredients(ingredients.filter((ingredient) => ingredient !== ingredientToRemove));
  };

  const generateRecipeSuggestions = async () => {
    const recipeData = await generateRecipes({
      ingredients: ingredients,
      dietaryRestrictions: selectedRestrictions,
    });

    setRecipes(recipeData?.recipes || []);
  };

  const toggleRestriction = (restrictionName: string) => {
    setSelectedRestrictions((prev) =>
      prev.includes(restrictionName)
        ? prev.filter((name) => name !== restrictionName)
        : [...prev, restrictionName]
    );
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-background p-4">
      <h1 className="text-2xl font-bold mb-4">FridgeChef</h1>

      {/* Ingredient Input Section */}
      <div className="flex flex-col md:flex-row gap-2 w-full md:w-3/4 mb-4">
        <Input
          type="text"
          placeholder="Enter an ingredient"
          value={newIngredient}
          onChange={(e) => setNewIngredient(e.target.value)}
          className="md:w-3/4"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addIngredient();
            }
          }}
        />
        <Button onClick={addIngredient} className="md:w-1/4">Add Ingredient</Button>
      </div>

      {/* Display Available Ingredients */}
      {ingredients.length > 0 && (
        <div className="w-full md:w-3/4 mb-4">
          <ScrollArea className="h-32 w-full rounded-md border">
            <div className="flex flex-wrap p-2">
              {ingredients.map((ingredient) => (
                <Badge key={ingredient} className="mr-2 mb-1 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                  {ingredient}
                  <Button variant="ghost" size="icon" onClick={() => removeIngredient(ingredient)} className="h-4 w-4 p-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3">
                      <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                    </svg>
                  </Button>
                </Badge>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      <Separator className="w-full md:w-3/4 mb-4" />

      {/* Dietary Restrictions */}
      <div className="w-full md:w-3/4 mb-4">
        <Card>
          <CardHeader>
            <CardTitle>Dietary Restrictions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {dietaryRestrictions.map((restriction) => (
                <div key={restriction.name} className="flex items-center space-x-2">
                  <Checkbox
                    id={restriction.name}
                    checked={selectedRestrictions.includes(restriction.name)}
                    onCheckedChange={() => toggleRestriction(restriction.name)}
                  />
                  <label
                    htmlFor={restriction.name}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {restriction.name}
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Generate Recipes Button */}
      <Button onClick={generateRecipeSuggestions} className="w-full md:w-3/4 mb-4">Generate Recipes</Button>

      {/* Display Generated Recipes */}
      {recipes.length > 0 && (
        <div className="w-full md:w-3/4">
          {recipes.map((recipe, index) => (
            <Card key={index} className="mb-4">
              <CardHeader>
                <CardTitle>{recipe.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="text-md font-semibold mb-2">Ingredients:</h3>
                <ul className="list-disc pl-5 mb-2">
                  {recipe.ingredients.map((ingredient, i) => (
                    <li key={i}>{ingredient}</li>
                  ))}
                </ul>
                <h3 className="text-md font-semibold mb-2">Instructions:</h3>
                <p className="text-sm">{recipe.instructions}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
