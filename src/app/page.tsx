"use client";

import { useState, useEffect, useRef } from "react";
import { generateRecipes } from "@/ai/flows/generate-recipes";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SpeechInput } from "@/components/ui/speech-input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { DietaryRestriction, getDietaryRestrictions } from "@/services/dietary-filter";
import { Checkbox } from "@/components/ui/checkbox";
import { FridgeChefLogo } from "@/components/fridge-chef-logo";
import { ExpirationTracker } from "@/components/expiration-tracker";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { hasExpiringOrExpiredItems } from "@/services/food-items";

export default function Home() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [newIngredient, setNewIngredient] = useState<string>("");
  const [recipes, setRecipes] = useState<any[]>([]);
  const [dietaryRestrictions, setDietaryRestrictions] = useState<DietaryRestriction[]>([]);
  const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>([]);
  const [isFridgeOpen, setIsFridgeOpen] = useState(false);
  const fridgeRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadRestrictions = async () => {
      const restrictions = await getDietaryRestrictions();
      setDietaryRestrictions(restrictions);
    };
    loadRestrictions();

    // Initially show the fridge and start the opening animation
    setTimeout(() => {
      setIsFridgeOpen(true);
    }, 500); // Delay to ensure smooth transition

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

  // Check for expiring items to show indicator
  const [hasExpiringItems, setHasExpiringItems] = useState(false);
  
  useEffect(() => {
    // Check if there are any expiring or expired items
    setHasExpiringItems(hasExpiringOrExpiredItems());
  }, []);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-6 relative">
      {/* Futuristic background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-30 pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-32 h-32 rounded-full bg-primary/20 filter blur-3xl"></div>
        <div className="absolute bottom-[20%] right-[10%] w-40 h-40 rounded-full bg-secondary/20 filter blur-3xl"></div>
        <div className="absolute top-[40%] right-[20%] w-24 h-24 rounded-full bg-accent/20 filter blur-3xl"></div>
      </div>
      {/* Fridge Section */}
      {!isFridgeOpen ? (
        <div
          ref={fridgeRef}
          className="relative w-96 h-128 bg-gradient-to-b from-white to-gray-100 border border-gray-200 rounded-xl shadow-md overflow-hidden transition-transform duration-1000 ease-in-out"
          style={{
            transformOrigin: "top center",
            transform: isFridgeOpen ? "rotateX(-60deg)" : "rotateX(0deg)",
            perspective: "800px",
          }}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-700 text-xl font-bold">
            <div className="w-full flex justify-between items-center mb-6">
              <FridgeChefLogo className="text-3xl font-bold neon-text" />
            </div>
            <p>Opening Fridge...</p>
          </div>
        </div>
      ) : (
        <div ref={contentRef} className="w-full max-w-md flex flex-col items-center">
          <div className="w-full flex flex-col items-center mb-6">
            <FridgeChefLogo className="text-3xl font-bold neon-text mb-4 mx-auto" />
            {hasExpiringItems && (
              <Badge className="bg-red-500/20 border-red-500/50 text-red-500 mb-2">
                Items expiring soon!
              </Badge>
            )}
          </div>

          {/* Tabs for Recipe Generator and Expiration Tracker */}
          <Tabs defaultValue="recipes" className="w-full max-w-md mb-6 z-10">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="recipes">Recipe Generator</TabsTrigger>
              <TabsTrigger value="expiration" className="relative">
                Expiration Tracker
                {hasExpiringItems && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                )}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="recipes" className="w-full">
              {/* Ingredient Input Section */}
              <div className="flex flex-col md:flex-row gap-3 w-full max-w-md mb-6 z-10">
                <SpeechInput
                  type="text"
                  placeholder="Enter an ingredient or click microphone to speak"
                  value={newIngredient}
                  onChange={(e) => setNewIngredient(e.target.value)}
                  onValueChange={setNewIngredient}
                  onSubmit={addIngredient}
                  className="md:w-3/4 rounded-md shadow-sm backdrop-blur-md border-primary/20 focus:border-primary/50 focus:ring-primary/30 focus:shadow-[0_0_10px_rgba(80,160,255,0.4)]"
                />
                <Button onClick={addIngredient} className="md:w-1/4 rounded-md shadow-sm border-glow" variant="gradient">Add Ingredient</Button>
              </div>

              {/* Display Available Ingredients */}
              {ingredients.length > 0 && (
                <div className="w-full max-w-md mb-6 glass-effect p-4 rounded-lg z-10">
                  <ScrollArea className="h-32 w-full rounded-md border border-white/10 shadow-[0_0_10px_rgba(80,160,255,0.3)] backdrop-blur-sm">
                    <div className="flex flex-wrap p-3">
                      {ingredients.map((ingredient) => (
                        <Badge key={ingredient} className="mr-2 mb-1 px-3 py-1.5 rounded-full text-sm flex items-center gap-1 bg-gradient-to-r from-primary/80 to-secondary/80 border border-white/10 shadow-[0_0_8px_rgba(80,160,255,0.4)] transition-all duration-300 hover:shadow-[0_0_12px_rgba(80,160,255,0.6)]">
                          {ingredient}
                          <Button variant="ghost" size="icon" onClick={() => removeIngredient(ingredient)} className="h-4 w-4 p-0 rounded-full hover:bg-white/10 transition-colors">
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

              <Separator className="w-full max-w-md mb-6 bg-gradient-to-r from-primary/50 via-secondary/50 to-primary/50 h-[2px] rounded-full shadow-[0_0_8px_rgba(80,160,255,0.4)]" />

              {/* Dietary Restrictions */}
              <div className="w-full max-w-md mb-6 z-10 relative flex justify-center">
                <Card className="rounded-md shadow-sm glass-effect w-full">
                  <CardHeader className="text-center">
                    <CardTitle>Dietary Restrictions</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-2 items-center">
                      {dietaryRestrictions.map((restriction) => (
                        <div key={restriction.name} className="flex items-center space-x-2 relative z-20 pointer-events-auto">
                          <Checkbox
                            id={restriction.name}
                            checked={selectedRestrictions.includes(restriction.name)}
                            onCheckedChange={() => toggleRestriction(restriction.name)}
                            className="rounded-sm shadow-sm border-primary/50 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-primary data-[state=checked]:to-secondary cursor-pointer"
                          />
                          <label
                            htmlFor={restriction.name}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
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
              <Button onClick={generateRecipeSuggestions} className="w-full max-w-md rounded-md mb-6 border-glow" variant="gradient">Generate Recipes</Button>

              {/* Display Generated Recipes */}
              {recipes.length > 0 && (
                <div className="w-full max-w-md z-10">
                  {recipes.map((recipe, index) => (
                    <Card key={index} className="mb-4 rounded-md shadow-sm glass-effect hover:shadow-[0_0_15px_rgba(80,160,255,0.5)] transition-all duration-300">
                      <CardHeader>
                        <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">{recipe.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <h3 className="text-md font-semibold mb-2 text-primary">Ingredients:</h3>
                        <ul className="list-disc pl-5 mb-2">
                          {recipe.ingredients.map((ingredient, i) => (
                            <li key={i}>{ingredient}</li>
                          ))}
                        </ul>
                        <h3 className="text-md font-semibold mb-2 text-primary">Instructions:</h3>
                        <p className="text-sm">{recipe.instructions}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="expiration" className="w-full">
              <ExpirationTracker />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
