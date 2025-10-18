
'use client';

import { useState, useEffect } from 'react';
import { Printer, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { useApp } from '@/components/providers';
import { deriveGroceryList, DeriveGroceryListOutput } from '@/ai/flows/derive-grocery-list';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { InteractiveGroceryList } from '@/components/interactive-grocery-list';

export default function GroceryListPage() {
  const { mealPlan, profile } = useApp();
  const [groceryList, setGroceryList] = useState<DeriveGroceryListOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (mealPlan) {
      const generateList = async () => {
        setIsLoading(true);
        setGroceryList(null);
        try {
          const output = await deriveGroceryList({
            mealPlan: mealPlan.mealPlan,
            budget: profile?.budget,
          });
          setGroceryList(output);
        } catch (error) {
          console.error(error);
          toast({
            title: 'An error occurred',
            description: 'Failed to generate grocery list. Please try again.',
            variant: 'destructive',
          });
        } finally {
          setIsLoading(false);
        }
      };
      generateList();
    }
  }, [mealPlan, profile?.budget, toast]);
  
  const handlePrint = () => {
    window.print();
  };

  const renderContent = () => {
    if (isLoading) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-1/4" />
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-6 w-2/3" />
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-8 w-1/3 mt-4" />
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-6 w-2/3" />
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (!mealPlan) {
      return (
        <div className="flex flex-col items-center justify-center h-full border-2 border-dashed rounded-lg p-12 text-center">
            <div className='p-4 bg-primary/10 rounded-full mb-4'>
                <ShoppingCart className='size-12 text-primary' />
            </div>
            <h3 className="text-xl font-semibold font-headline">Your grocery list is empty</h3>
            <p className="text-muted-foreground mt-2 max-w-md">
                Generate a meal plan first, and your personalized grocery list will appear here.
            </p>
            <Button asChild className='mt-6'>
                <Link href="/meal-planner">Go to Meal Planner</Link>
            </Button>
        </div>
      );
    }
    
    if (groceryList) {
        return (
            <div id="grocery-list-area" className="print-area">
                <Card>
                    <CardContent className="p-6">
                        <InteractiveGroceryList markdownContent={groceryList.groceryList} />
                    </CardContent>
                </Card>
             </div>
        );
    }

    return null;
  }

  return (
    <div className="container relative">
      <PageHeader className="pb-8 no-print">
        <div className="flex w-full items-center justify-between">
          <div>
            <PageHeaderHeading className="font-headline">Your Grocery List</PageHeaderHeading>
            <PageHeaderDescription>
              Automatically generated from your meal plan. Ready for your shopping trip.
            </PageHeaderDescription>
          </div>
          {groceryList && (
            <Button onClick={handlePrint} variant="outline" size="icon" className="hidden md:inline-flex">
              <Printer className="size-4" />
              <span className="sr-only">Print List</span>
            </Button>
          )}
        </div>
      </PageHeader>
      
      {renderContent()}

      {groceryList && (
       <Button onClick={handlePrint} variant="default" className="w-full mt-6 md:hidden no-print">
            <Printer className="size-4 mr-2" />
            Print List
        </Button>
      )}
    </div>
  );
}
