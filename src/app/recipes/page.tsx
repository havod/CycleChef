'use client';

import Image from "next/image";
import { useApp } from "@/components/providers";
import type { Recipe } from "@/lib/types";
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, CookingPot } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

const cyclePhases = ['Menstrual', 'Follicular', 'Ovulatory', 'Luteal'] as const;

const recipeFormSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters long."),
    description: z.string().min(10, "Description must be at least 10 characters long."),
    ingredients: z.string().min(10, "Please list at least one ingredient."),
    instructions: z.string().min(20, "Instructions must be at least 20 characters long."),
    cyclePhase: z.array(z.string()).min(1, "Please select at least one cycle phase."),
});

type RecipeFormValues = z.infer<typeof recipeFormSchema>;

function RecipeCard({ recipe }: { recipe: Recipe }) {
    return (
        <Card className="flex flex-col overflow-hidden">
            {recipe.image ? (
            <div className="relative h-48 w-full">
                <Image
                src={recipe.image.imageUrl}
                alt={recipe.image.description}
                fill
                className="object-cover"
                data-ai-hint={recipe.image.imageHint}
                />
            </div>
            ) : (
              <div className="relative h-48 w-full bg-secondary flex items-center justify-center">
                <CookingPot className="size-12 text-muted-foreground" />
              </div>
            )}
            <CardHeader>
                <CardTitle className="font-headline">{recipe.title}</CardTitle>
                <CardDescription className="line-clamp-2">{recipe.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col justify-end mt-auto">
                <div className="flex flex-wrap gap-2">
                    {recipe.cyclePhase.map(phase => (
                        <Badge key={phase} variant="secondary">{phase}</Badge>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

function UploadRecipeDialog() {
    const [open, setOpen] = useState(false);
    const { addRecipe } = useApp();
    const { toast } = useToast();

    const form = useForm<RecipeFormValues>({
        resolver: zodResolver(recipeFormSchema),
        defaultValues: {
            title: "",
            description: "",
            ingredients: "",
            instructions: "",
            cyclePhase: [],
        },
    });

    function onSubmit(data: RecipeFormValues) {
        const newRecipe: Recipe = {
            id: `user-${Date.now()}`,
            title: data.title,
            description: data.description,
            ingredients: data.ingredients.split('\n'),
            instructions: data.instructions.split('\n'),
            cyclePhase: data.cyclePhase as typeof cyclePhases[number][],
        };
        addRecipe(newRecipe);
        toast({
            title: "Recipe Uploaded!",
            description: `${data.title} has been added to your recipe bank.`,
        });
        form.reset();
        setOpen(false);
    }


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Upload className="mr-2 size-4" />
                    Upload Recipe
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="font-headline">Upload Your Recipe</DialogTitle>
                    <DialogDescription>
                        Share your favorite recipes with the community. Fill in the details below.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <FormField control={form.control} name="title" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl><Input placeholder="e.g., Grandma's Chicken Soup" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl><Textarea placeholder="A short and sweet description of your recipe." {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="ingredients" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ingredients</FormLabel>
                                <FormControl><Textarea placeholder="List each ingredient on a new line." {...field} rows={5} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                         <FormField control={form.control} name="instructions" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Instructions</FormLabel>
                                <FormControl><Textarea placeholder="Step 1..." {...field} rows={5} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="cyclePhase" render={() => (
                            <FormItem>
                                <FormLabel>Recommended Cycle Phase(s)</FormLabel>
                                <div className="grid grid-cols-2 gap-2">
                                {cyclePhases.map((item) => (
                                    <FormField key={item} control={form.control} name="cyclePhase" render={({ field }) => (
                                        <FormItem key={item} className="flex flex-row items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value?.includes(item)}
                                                    onCheckedChange={(checked) => {
                                                        return checked
                                                        ? field.onChange([...(field.value || []), item])
                                                        : field.onChange(field.value?.filter((value) => value !== item));
                                                    }}
                                                />
                                            </FormControl>
                                            <FormLabel className="font-normal">{item}</FormLabel>
                                        </FormItem>
                                    )} />
                                ))}
                                </div>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="secondary">Cancel</Button>
                            </DialogClose>
                            <Button type="submit">Upload Recipe</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default function RecipesPage() {
  const { recipes } = useApp();

  return (
    <div className="container relative">
      <PageHeader className="pb-8">
        <div className="flex w-full flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <PageHeaderHeading className="font-headline">Personalized Recipe Bank</PageHeaderHeading>
                <PageHeaderDescription>
                    Explore recipes tailored to your cycle, save your favorites, and add your own.
                </PageHeaderDescription>
            </div>
            <UploadRecipeDialog />
        </div>
      </PageHeader>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
