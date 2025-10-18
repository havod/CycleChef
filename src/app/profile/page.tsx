'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '@/components/page-header';
import { useApp } from '@/components/providers';
import { useToast } from '@/hooks/use-toast';
import { userProfileData } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const profileFormSchema = z.object({
  name: z.string().optional(),
  age: z.coerce.number().min(1).optional(),
  gender: z.enum(['F', 'M', 'Non defined']).optional(),
  country: z.string().optional(),
  dietaryPreferences: z.array(z.string()).optional(),
  otherDietaryPreference: z.string().optional(),
  menstrualCycle: z.enum(['regular', 'irregular']).optional(),
  healthConditions: z.array(z.string()).optional(),
  weight: z.coerce.number().min(1).optional(),
  height: z.coerce.number().min(1).optional(),
  nutritionalGoals: z.array(z.string()).optional(),
  activityLevel: z.enum(['very', 'not', 'medium']).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const { profile, updateProfile, isLoading } = useApp();
  const { toast } = useToast();
  const [showOtherDietaryPreference, setShowOtherDietaryPreference] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      dietaryPreferences: [],
      healthConditions: [],
      nutritionalGoals: [],
      otherDietaryPreference: '',
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset(profile);
      if (profile.dietaryPreferences?.includes('Other')) {
        setShowOtherDietaryPreference(true);
      }
    }
  }, [profile, form]);
  
  useEffect(() => {
      const subscription = form.watch((value, { name }) => {
          if (name === 'dietaryPreferences') {
              const otherSelected = value.dietaryPreferences?.includes('Other');
              setShowOtherDietaryPreference(Boolean(otherSelected));
              if (!otherSelected) {
                  form.setValue('otherDietaryPreference', '');
              }
          }
      });
      return () => subscription.unsubscribe();
  }, [form]);

  function onSubmit(data: ProfileFormValues) {
    updateProfile(data);
    toast({
      title: 'Profile Updated',
      description: 'Your information has been saved successfully.',
    });
  }

  if (isLoading) {
    return <div className="container"><Skeleton className="h-screen w-full" /></div>
  }

  return (
    <div className="container relative">
      <PageHeader>
        <PageHeaderHeading className="font-headline">Your Profile</PageHeaderHeading>
        <PageHeaderDescription>
          This information helps us personalize your meal plans and recipes.
        </PageHeaderDescription>
      </PageHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-8">
          <Card>
            <CardHeader>
                <CardTitle className='font-headline'>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
                <div className="grid md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl><Input placeholder="Your Name" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="age" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Age</FormLabel>
                            <FormControl><Input type="number" placeholder="28" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="gender" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Gender</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="F">Female</SelectItem>
                                    <SelectItem value="M">Male</SelectItem>
                                    <SelectItem value="Non defined">Prefer not to say</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="country" render={({ field }) => (
                         <FormItem>
                            <FormLabel>Country of Residence</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger></FormControl>
                                <SelectContent>
                                    {userProfileData.countries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
                <CardTitle className='font-headline'>Health & Nutrition</CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
                <div className="grid md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="weight" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Weight (kg)</FormLabel>
                            <FormControl><Input type="number" placeholder="65" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="height" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Height (cm)</FormLabel>
                            <FormControl><Input type="number" placeholder="170" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>
                 <FormField control={form.control} name="activityLevel" render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel>Activity Level</FormLabel>
                        <FormControl>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl><RadioGroupItem value="not" /></FormControl>
                                    <FormLabel className="font-normal">Not very active</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl><RadioGroupItem value="medium" /></FormControl>
                                    <FormLabel className="font-normal">Moderately active</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl><RadioGroupItem value="very" /></FormControl>
                                    <FormLabel className="font-normal">Very active</FormLabel>
                                </FormItem>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                 )} />

                <Separator />
                
                <FormField control={form.control} name="menstrualCycle" render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel>Menstrual Cycle</FormLabel>
                        <FormControl>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-row space-x-4">
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl><RadioGroupItem value="regular" /></FormControl>
                                    <FormLabel className="font-normal">Regular</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                    <FormControl><RadioGroupItem value="irregular" /></FormControl>
                                    <FormLabel className="font-normal">Irregular</FormLabel>
                                </FormItem>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                 )} />
                 
                <FormField
                    control={form.control} name="healthConditions" render={() => (
                    <FormItem>
                        <div className="mb-4">
                            <FormLabel className="text-base">Health Conditions</FormLabel>
                            <FormDescription>Select any that apply to you.</FormDescription>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {userProfileData.healthConditions.map((item) => (
                            <FormField key={item} control={form.control} name="healthConditions" render={({ field }) => (
                                <FormItem key={item} className="flex flex-row items-start space-x-3 space-y-0">
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

                <Separator />
                <div className="grid md:grid-cols-2 gap-8">
                    <FormField control={form.control} name="dietaryPreferences" render={() => (
                        <FormItem>
                            <div className="mb-4"><FormLabel>Dietary Preferences</FormLabel></div>
                             {userProfileData.dietaryPreferences.map((item) => (
                                <FormField key={item} control={form.control} name="dietaryPreferences" render={({ field }) => (
                                    <FormItem key={item} className="flex flex-row items-start space-x-3 space-y-0 mb-2">
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
                            {showOtherDietaryPreference && (
                                <FormField control={form.control} name="otherDietaryPreference" render={({ field }) => (
                                    <FormItem className="mt-2">
                                        <FormControl><Input placeholder="Please specify" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            )}
                            <FormMessage />
                        </FormItem>
                    )} />

                     <FormField control={form.control} name="nutritionalGoals" render={() => (
                        <FormItem>
                            <div className="mb-4"><FormLabel>Nutritional Goals</FormLabel></div>
                             {userProfileData.nutritionalGoals.map((item) => (
                                <FormField key={item} control={form.control} name="nutritionalGoals" render={({ field }) => (
                                    <FormItem key={item} className="flex flex-row items-start space-x-3 space-y-0 mb-2">
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
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>
            </CardContent>
          </Card>
          
          <Button type="submit">Save Changes</Button>
        </form>
      </Form>
    </div>
  );
}
