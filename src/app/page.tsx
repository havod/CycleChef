import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Bot, BookHeart, Salad } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { placeholderImages } from '@/lib/data';
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '@/components/page-header';

export default function DashboardPage() {
  const features = [
    {
      title: 'AI Meal Planner',
      description: 'Generate personalized meal plans that fit your body, goals, and budget.',
      href: '/meal-planner',
      icon: <Bot className="size-8 text-primary" />,
      image: placeholderImages.find(p => p.id === 'meal-planner-card'),
    },
    {
      title: 'Recipe Bank',
      description: 'Explore and save delicious, cycle-friendly recipes.',
      href: '/recipes',
      icon: <Salad className="size-8 text-primary" />,
      image: placeholderImages.find(p => p.id === 'recipes-card'),
    },
    {
      title: 'Cycle Health',
      description: 'Learn about your menstrual cycle and eat to support its phases.',
      href: '/cycle-health',
      icon: <BookHeart className="size-8 text-primary" />,
      image: placeholderImages.find(p => p.id === 'cycle-health-card'),
    },
  ];

  return (
    <div className="container relative">
      <PageHeader className="pb-8">
        <PageHeaderHeading className="font-headline">Welcome to CycleChef</PageHeaderHeading>
        <PageHeaderDescription>
          Your personal AI-powered nutrition assistant for hormonal health.
          Understand your body, eat in harmony with your cycle, and feel your best.
        </PageHeaderDescription>
      </PageHeader>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title} className="flex flex-col overflow-hidden">
            <CardHeader className="flex-row items-start gap-4 space-y-0">
              <div className="w-12 flex-shrink-0">{feature.icon}</div>
              <div>
                <CardTitle className="font-headline">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col p-0">
              {feature.image && (
                 <div className="relative h-48 w-full">
                    <Image
                      src={feature.image.imageUrl}
                      alt={feature.image.description}
                      fill
                      className="object-cover"
                      data-ai-hint={feature.image.imageHint}
                    />
                  </div>
              )}
              <div className="mt-auto p-6 pt-4">
                <Button asChild className="w-full">
                  <Link href={feature.href}>
                    {feature.title} <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
