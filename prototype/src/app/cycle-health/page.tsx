'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '@/components/page-header';
import { blogPosts } from '@/lib/data';
import type { Recipe } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, CookingPot } from 'lucide-react';
import { useApp } from '@/components/providers';
import { Badge } from '@/components/ui/badge';

type CyclePhase = 'Menstrual' | 'Follicular' | 'Ovulatory' | 'Luteal';

export default function CycleHealthPage() {
  const { recipes } = useApp();
  const [selectedPhase, setSelectedPhase] = useState<CyclePhase>('Menstrual');

  const filteredRecipes = recipes.filter(recipe => recipe.cyclePhase.includes(selectedPhase));
  const cycleArticle = blogPosts.find(p => p.slug === 'the-four-phases-of-the-menstrual-cycle');

  return (
    <div className="container relative">
      <PageHeader className="pb-8">
        <PageHeaderHeading className="font-headline">Cycle Health Hub</PageHeaderHeading>
        <PageHeaderDescription>
          Nourish your body in harmony with its natural rhythm. Discover recipes
          and insights tailored to each phase of your menstrual cycle.
        </PageHeaderDescription>
      </PageHeader>

      <Tabs defaultValue="recipes" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-96">
          <TabsTrigger value="recipes">Cycle-Based Recipes</TabsTrigger>
          <TabsTrigger value="articles">Informative Articles</TabsTrigger>
        </TabsList>
        <TabsContent value="recipes" className="mt-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            <p className="font-medium">Showing recipes for phase:</p>
            <Select onValueChange={(value: CyclePhase) => setSelectedPhase(value)} defaultValue={selectedPhase}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Select a phase" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Menstrual">Menstrual</SelectItem>
                <SelectItem value="Follicular">Follicular</SelectItem>
                <SelectItem value="Ovulatory">Ovulatory</SelectItem>
                <SelectItem value="Luteal">Luteal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredRecipes.length > 0 ? (
              filteredRecipes.map((recipe: Recipe) => (
                <Card key={recipe.id} className="flex flex-col overflow-hidden">
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
                  <CardContent className="mt-auto flex-1 flex flex-col justify-end">
                    <div className="flex flex-wrap gap-2">
                        {recipe.cyclePhase.map(phase => (
                            <Badge key={phase} variant="secondary">{phase}</Badge>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p>No recipes found for this phase. Check our main recipe bank!</p>
            )}
          </div>
        </TabsContent>
        <TabsContent value="articles" className="mt-6">
            {cycleArticle && (
                <Link href={`/blog/${cycleArticle.slug}`} className="block group">
                    <Card className="overflow-hidden transition-shadow hover:shadow-lg">
                        <div className="grid md:grid-cols-5 gap-4">
                            {cycleArticle.image && (
                            <div className="md:col-span-2 relative h-64 md:h-auto">
                                <Image
                                src={cycleArticle.image.imageUrl}
                                alt={cycleArticle.image.description}
                                fill
                                className="object-cover"
                                data-ai-hint={cycleArticle.image.imageHint}
                                />
                            </div>
                            )}
                            <div className="md:col-span-3">
                                <CardHeader>
                                    <CardTitle className="font-headline text-2xl group-hover:text-primary transition-colors">{cycleArticle.title}</CardTitle>
                                    <CardDescription>By {cycleArticle.author} on {new Date(cycleArticle.date).toLocaleDateString()}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground mb-4">{cycleArticle.description}</p>
                                    <p className="text-primary font-semibold flex items-center">
                                        Read the full guide <ArrowRight className="ml-2 size-4" />
                                    </p>
                                </CardContent>
                            </div>
                        </div>
                    </Card>
                </Link>
            )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
