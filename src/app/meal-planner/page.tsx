'use client';

import { useState } from 'react';
import { useApp } from '@/components/providers';
import { generateMealPlan, GenerateMealPlanOutput } from '@/ai/flows/generate-meal-plan';
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Bot, Sparkles } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { FormItem } from '@/components/ui/form';

type BudgetFrequency = 'weekly' | 'bi-weekly' | 'monthly';

export default function MealPlannerPage() {
  const { profile, isLoading: isProfileLoading, setMealPlan, mealPlan } = useApp();
  const [preferences, setPreferences] = useState('');
  const [budgetAmount, setBudgetAmount] = useState(profile?.budget || 100);
  const [budgetFrequency, setBudgetFrequency] = useState<BudgetFrequency>('weekly');

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateMealPlanOutput | null>(mealPlan);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!profile) {
      toast({
        title: "Profile not found",
        description: "Please complete your profile before generating a meal plan.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    setResult(null);
    try {
      const output = await generateMealPlan({
        userProfile: { 
          ...profile, 
          budget: budgetAmount,
          budgetFrequency: budgetFrequency,
          preferences: preferences,
        },
      });
      setResult(output);
      setMealPlan(output);
    } catch (error) {
      console.error(error);
      toast({
        title: 'An error occurred',
        description: 'Failed to generate meal plan. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isProfileLoading) {
    return <div className='container'><Skeleton className='w-full h-96' /></div>;
  }
  
  if (!profile) {
    return (
        <div className="container text-center">
            <PageHeader className="items-center">
                <PageHeaderHeading className="font-headline">Complete Your Profile</PageHeaderHeading>
                <PageHeaderDescription>
                    To generate a personalized meal plan, we need to know a little bit about you.
                </PageHeaderDescription>
            </PageHeader>
            <Button asChild>
                <Link href="/profile">Go to Profile</Link>
            </Button>
        </div>
    )
  }

  return (
    <div className="container relative grid md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <PageHeader>
          <PageHeaderHeading className="font-headline">AI Meal Planner</PageHeaderHeading>
          <PageHeaderDescription>
            Describe your ideal meal plan, set your budget, and let our AI create it for you.
          </PageHeaderDescription>
        </PageHeader>
        <div className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label htmlFor="preferences">Do you have any preference?</Label>
            <Textarea
              id="preferences"
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              placeholder="e.g., 'I prefer quick meals', 'I don't like fish'"
              rows={4}
            />
          </div>
          <div className="space-y-4">
            <Label>Budget</Label>
            <div className='flex items-center gap-2'>
                <span className='text-muted-foreground'>$</span>
                <Input
                    id="budget"
                    type='number'
                    value={budgetAmount}
                    onChange={(e) => setBudgetAmount(Number(e.target.value))}
                    className='w-24'
                />
            </div>
            <RadioGroup onValueChange={(value: BudgetFrequency) => setBudgetFrequency(value)} defaultValue={budgetFrequency} className="flex space-x-4">
                <FormItem className="flex items-center space-x-2 space-y-0">
                    <RadioGroupItem value="weekly" id="weekly" />
                    <Label htmlFor='weekly' className="font-normal">Weekly</Label>
                </FormItem>
                <FormItem className="flex items-center space-x-2 space-y-0">
                    <RadioGroupItem value="bi-weekly" id="bi-weekly" />
                    <Label htmlFor='bi-weekly' className="font-normal">Bi-weekly</Label>
                </FormItem>
                 <FormItem className="flex items-center space-x-2 space-y-0">
                    <RadioGroupItem value="monthly" id="monthly" />
                    <Label htmlFor='monthly' className="font-normal">Monthly</Label>
                </FormItem>
            </RadioGroup>
          </div>
          <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
            {isLoading ? (
              'Generating...'
            ) : (
              <>
                <Sparkles className="mr-2 size-4" /> Generate Plan
              </>
            )}
          </Button>
        </div>
      </div>
      <div className="md:col-span-2">
        {isLoading && (
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className='space-y-4'>
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                </CardContent>
            </Card>
        )}
        {result ? (
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl flex items-center gap-2">
                <Bot /> Your Personalized Meal Plan
              </CardTitle>
              {result.totalCalories && (
                 <CardDescription>
                    Estimated Total Calories: <strong>{result.totalCalories} kcal</strong>
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="prose prose-neutral dark:prose-invert max-w-none whitespace-pre-wrap">
                {result.mealPlan}
              </div>
            </CardContent>
             <CardFooter>
              <Button variant="outline" asChild>
                <Link href="/grocery-list">
                  Generate Grocery List
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ) : !isLoading && (
            <div className="flex flex-col items-center justify-center h-full border-2 border-dashed rounded-lg p-12 text-center">
                <div className='p-4 bg-primary/10 rounded-full mb-4'>
                    <Bot className='size-12 text-primary' />
                </div>
                <h3 className="text-xl font-semibold">Your plan will appear here</h3>
                <p className="text-muted-foreground mt-2">
                    Fill in your preferences on the left and click 'Generate Plan' to start.
                </p>
            </div>
        )}
      </div>
    </div>
  );
}
