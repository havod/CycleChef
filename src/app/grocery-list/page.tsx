
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { ShoppingCart, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { useApp } from '@/components/providers';
import { deriveGroceryList } from '@/ai/flows/derive-grocery-list';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { InteractiveGroceryList, type GroceryListMode } from '@/components/interactive-grocery-list';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { countryData } from '@/lib/data';
import { Switch } from '@/components/ui/switch';

const defaultStore = 'Any Store';

export default function GroceryListPage() {
  const { mealPlan, profile, groceryList, setGroceryList } = useApp();
  
  const userCountry = profile?.country || 'USA';
  const countryInfo = useMemo(() => countryData[userCountry] || countryData['Other'], [userCountry]);
  const availableStores = useMemo(() => countryInfo.stores, [countryInfo]);
  
  const [selectedStore, setSelectedStore] = useState<string>(defaultStore);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<GroceryListMode>('pre-shop');
  const [finalPrice, setFinalPrice] = useState<number | null>(null);

  const { toast } = useToast();

  const generateList = useCallback(async (store: string) => {
    if (!mealPlan) return;

    setIsLoading(true);
    // Don't clear grocery list from context here, to avoid flash of empty content
    try {
      const output = await deriveGroceryList({
        mealPlan: mealPlan.mealPlan,
        budget: profile?.budget,
        groceryStore: store,
        country: profile?.country,
        currency: countryInfo.currency,
      });
      setGroceryList(output);
      setFinalPrice(output.estimatedPrice || 0);
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
  }, [mealPlan, profile, toast, countryInfo, setGroceryList]);

  useEffect(() => {
    // If there's a meal plan but no grocery list, generate one.
    if (mealPlan && !groceryList) {
      generateList(selectedStore);
    } else if (groceryList) {
      setFinalPrice(groceryList.estimatedPrice || 0);
    }
  }, [mealPlan, groceryList, selectedStore, generateList]);

  // Reset selected store if it's not in the new list of available stores
  useEffect(() => {
    if (!availableStores.includes(selectedStore)) {
        setSelectedStore(defaultStore);
    }
  }, [availableStores, selectedStore]);
  
  const renderContent = () => {
    if (isLoading && !groceryList) { // Only show skeleton on initial load
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
                        {isLoading && <p className='text-sm text-muted-foreground mb-4'>Updating list...</p>}
                        <InteractiveGroceryList 
                            markdownContent={groceryList.groceryList}
                            mode={mode}
                            initialPrice={groceryList.estimatedPrice || 0}
                            onPriceChange={setFinalPrice}
                        />
                         {finalPrice !== null && (
                          <div className="mt-6 border-t pt-4 text-right">
                              <p className="text-lg font-semibold">
                                  Estimated Total: <span className='font-bold'>{countryInfo.currencySymbol}{finalPrice.toFixed(2)}</span>
                              </p>
                          </div>
                        )}
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
        <div className="flex w-full flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <PageHeaderHeading className="font-headline">Your Grocery List</PageHeaderHeading>
            <PageHeaderDescription>
              Automatically generated from your meal plan. Ready for your shopping trip.
            </PageHeaderDescription>
          </div>
           {groceryList && (
            <div className="flex items-center gap-4 ml-auto">
               <div className="flex items-center space-x-2 self-end">
                <Label htmlFor="mode-switch">{mode === 'pre-shop' ? 'Pre-Shop' : 'Shopping'}</Label>
                <Switch 
                  id="mode-switch" 
                  checked={mode === 'shopping'} 
                  onCheckedChange={(checked) => setMode(checked ? 'shopping' : 'pre-shop')} 
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="grocery-store">Store</Label>
                 <Select onValueChange={(value) => {
                    setSelectedStore(value);
                    generateList(value);
                 }} value={selectedStore}>
                  <SelectTrigger id="grocery-store" className="w-48">
                    <SelectValue placeholder="Select a store" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableStores.map(store => (
                      <SelectItem key={store} value={store}>{store}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      </PageHeader>
      
      {renderContent()}

    </div>
  );
}
