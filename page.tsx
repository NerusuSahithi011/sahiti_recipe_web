'use client';

import {useState} from 'react';
import {generateRecipeIdeas} from '@/ai/flows/generate-recipe-ideas';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {useToast} from '@/hooks/use-toast';
import {ChefHat} from 'lucide-react';
import {Label} from '@/components/ui/label';

export default function Home() {
  const [ingredients, setIngredients] = useState('');
  const [recipeIdeas, setRecipeIdeas] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const {toast} = useToast();

  const handleGenerateRecipes = async () => {
    if (!ingredients) {
      toast({
        title: 'Error',
        description: 'Please enter ingredients.',
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await generateRecipeIdeas({ingredients});
      setRecipeIdeas(result.recipes);
    } catch (error: any) {
      console.error('Error generating recipes:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate recipes. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-12 px-6 md:px-24">
      <header className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary">
          <span className="inline-flex items-center">
            <ChefHat className="mr-2 h-8 w-8 md:h-10 md:w-10" />
            RecipeMuse
          </span>
        </h1>
        <p className="text-md md:text-lg text-muted-foreground mt-2">
          Enter 3-5 ingredients and get AI-generated recipe ideas.
        </p>
      </header>

      <section className="mb-8 w-full max-w-md">
        <div className="flex flex-col gap-4">
          <Label htmlFor="ingredients">Ingredients</Label>
          <Input
            type="text"
            id="ingredients"
            placeholder="e.g., chicken, rice, broccoli"
            value={ingredients}
            onChange={e => setIngredients(e.target.value)}
            aria-label="Ingredients"
          />
          <Button onClick={handleGenerateRecipes} disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate Recipes'}
          </Button>
        </div>
      </section>

      {recipeIdeas.length > 0 && (
        <section className="w-full max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>Recipe Ideas</CardTitle>
              <CardDescription>Here are some recipe ideas based on your ingredients:</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-none pl-0">
                {recipeIdeas.map((recipe, index) => (
                  <li key={index} className="mb-2">
                    {recipe}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
}
