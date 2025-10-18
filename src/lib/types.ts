export type UserProfile = {
  name?: string;
  age?: number;
  gender?: 'F' | 'M' | 'Non defined';
  country?: string;
  dietaryPreferences?: string[];
  menstrualCycle?: 'regular' | 'irregular';
  healthConditions?: string[];
  weight?: number;
  height?: number;
  nutritionalGoals?: string[];
  activityLevel?: 'very' | 'not' | 'medium';
  budget?: number;
};

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

export type Recipe = {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cyclePhase: ('Menstrual' | 'Follicular' | 'Ovulatory' | 'Luteal')[];
  image?: ImagePlaceholder;
  notes?: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  author: string;
  date: string;
  image?: ImagePlaceholder;
  content: string;
};
