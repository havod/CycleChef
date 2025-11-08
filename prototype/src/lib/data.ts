import type { Recipe, BlogPost, ImagePlaceholder } from './types';

export const placeholderImages: ImagePlaceholder[] = [
    {
      "id": "meal-planner-card",
      "description": "A vibrant flat lay of healthy food ingredients on a table.",
      "imageUrl": "https://picsum.photos/seed/1/600/400",
      "imageHint": "healthy food"
    },
    {
      "id": "recipes-card",
      "description": "A close-up shot of a colorful salad in a bowl.",
      "imageUrl": "https://picsum.photos/seed/2/600/400",
      "imageHint": "colorful salad"
    },
    {
      "id": "cycle-health-card",
      "description": "A serene image of a woman meditating outdoors.",
      "imageUrl": "https://picsum.photos/seed/3/600/400",
      "imageHint": "woman meditating"
    },
    {
      "id": "recipe-1",
      "description": "Lentil soup in a rustic bowl.",
      "imageUrl": "https://picsum.photos/seed/101/600/400",
      "imageHint": "lentil soup"
    },
    {
      "id": "recipe-2",
      "description": "Quinoa salad with avocado and roasted vegetables.",
      "imageUrl": "https://picsum.photos/seed/102/600/400",
      "imageHint": "quinoa salad"
    },
    {
      "id": "recipe-3",
      "description": "Grilled salmon with a side of asparagus.",
      "imageUrl": "https://picsum.photos/seed/103/600/400",
      "imageHint": "grilled salmon"
    },
    {
      "id": "recipe-4",
      "description": "Dark chocolate avocado mousse.",
      "imageUrl": "https://picsum.photos/seed/104/600/400",
      "imageHint": "chocolate mousse"
    },
    {
      "id": "blog-post-1",
      "description": "Abstract illustration of the four phases of the menstrual cycle.",
      "imageUrl": "https://picsum.photos/seed/201/1200/630",
      "imageHint": "abstract cycle"
    },
    {
      "id": "blog-post-2",
      "description": "A variety of seeds and nuts in small bowls.",
      "imageUrl": "https://picsum.photos/seed/202/1200/630",
      "imageHint": "seeds nuts"
    }
];

export const recipes: Recipe[] = [
  {
    id: '1',
    title: 'Warm Lentil & Root Vegetable Soup',
    description: 'A comforting and iron-rich soup, perfect for replenishing energy.',
    ingredients: [
      '1 tbsp olive oil', '1 onion, chopped', '2 carrots, diced', '2 celery stalks, diced', '2 cloves garlic, minced', '1 cup brown or green lentils, rinsed', '6 cups vegetable broth', '1 tsp dried thyme', 'Salt and pepper to taste'
    ],
    instructions: [
      'Heat olive oil in a large pot or Dutch oven over medium heat. Add onion, carrots, and celery and cook until softened, about 5-7 minutes.',
      'Add garlic and cook for another minute until fragrant.',
      'Stir in the lentils, vegetable broth, and thyme. Bring to a boil, then reduce heat and let simmer for 25-30 minutes, or until lentils are tender.',
      'Season with salt and pepper to taste. Serve warm.'
    ],
    cyclePhase: ['Menstrual'],
    image: placeholderImages.find(p => p.id === 'recipe-1'),
    notes: 'Great for a cozy evening.'
  },
  {
    id: '2',
    title: 'Vibrant Quinoa & Avocado Salad',
    description: 'A light, energizing salad packed with phytoestrogens and healthy fats.',
    ingredients: [
      '1 cup quinoa, cooked', '1 avocado, diced', '1 cup cherry tomatoes, halved', '1/2 cucumber, diced', '1/4 red onion, thinly sliced', 'Juice of 1 lime', '2 tbsp olive oil', 'Handful of fresh cilantro, chopped'
    ],
    instructions: [
      'In a large bowl, combine the cooked quinoa, avocado, cherry tomatoes, cucumber, and red onion.',
      'In a small bowl, whisk together the lime juice and olive oil. Pour over the salad.',
      'Gently toss to combine. Stir in the fresh cilantro.',
      'Serve immediately or chilled.'
    ],
    cyclePhase: ['Follicular', 'Ovulatory'],
    image: placeholderImages.find(p => p.id === 'recipe-2'),
    notes: ''
  },
  {
    id: '3',
    title: 'Omega-Rich Grilled Salmon',
    description: 'Supports brain health and reduces inflammation with a high dose of omega-3s.',
    ingredients: [
      '2 (6 oz) salmon fillets', '1 tbsp olive oil', '1 lemon, sliced', '1 bunch asparagus, trimmed', 'Salt, pepper, and dill to taste'
    ],
    instructions: [
      'Preheat grill or oven to 400°F (200°C).',
      'Toss asparagus with olive oil, salt, and pepper.',
      'Season salmon fillets with salt, pepper, and dill. Top with lemon slices.',
      'Grill or bake salmon for 12-15 minutes and asparagus for 10-12 minutes, or until cooked through.',
      'Serve the salmon with the grilled asparagus on the side.'
    ],
    cyclePhase: ['Ovulatory', 'Luteal'],
    image: placeholderImages.find(p => p.id === 'recipe-3'),
    notes: 'A quick and healthy dinner.'
  },
  {
    id: '4',
    title: 'Magnesium-Rich Chocolate Avocado Mousse',
    description: 'A guilt-free dessert to satisfy cravings and ease cramps.',
    ingredients: [
      '2 ripe avocados', '1/2 cup unsweetened cocoa powder', '1/2 cup maple syrup or honey', '1/4 cup almond milk', '1 tsp vanilla extract', 'Pinch of sea salt'
    ],
    instructions: [
      'Combine all ingredients in a high-speed blender or food processor.',
      'Blend until completely smooth and creamy, scraping down the sides as needed.',
      'Divide the mousse into serving dishes and chill in the refrigerator for at least 30 minutes.',
      'Serve chilled, optionally with fresh berries.'
    ],
    cyclePhase: ['Luteal', 'Menstrual'],
    image: placeholderImages.find(p => p.id === 'recipe-4'),
    notes: 'Surprisingly delicious and healthy!'
  },
];

export const blogPosts: BlogPost[] = [
  {
    slug: 'the-four-phases-of-the-menstrual-cycle',
    title: 'Eating for Your Cycle: A Guide to the Four Phases',
    description: 'Did you know that what you eat can significantly impact how you feel throughout your menstrual cycle? Learn how to harness the power of nutrition to support each phase.',
    author: 'Dr. Eleanor Vance',
    date: '2024-05-15',
    image: placeholderImages.find(p => p.id === 'blog-post-1'),
    content: `
<p>The menstrual cycle is more than just your period; it's a complex, month-long dance of hormones that affects your energy, mood, and nutritional needs. By aligning your diet with its four distinct phases, you can reduce PMS, boost energy, and cultivate a deeper connection with your body.</p>

<h3 class="font-headline text-2xl mt-6 mb-2">Phase 1: Menstrual (Days 1-5, approx.)</h3>
<p>This is when your period begins. Your energy is lowest, and your body is shedding its uterine lining. Focus on foods that replenish iron and reduce inflammation.</p>
<ul>
  <li><strong>Focus Foods:</strong> Iron-rich foods like lentils, spinach, and red meat (if you eat it). Anti-inflammatory foods rich in omega-3s, like salmon and walnuts. And don't forget magnesium from dark chocolate to ease cramps.</li>
</ul>

<h3 class="font-headline text-2xl mt-6 mb-2">Phase 2: Follicular (Days 1-13, approx.)</h3>
<p>After your period, estrogen begins to rise, rebuilding the uterine lining. Your energy and mood start to lift. Focus on light, fresh foods that support estrogen production.</p>
<ul>
  <li><strong>Focus Foods:</strong> Phytoestrogen-containing foods like flax seeds and soy. Lean proteins, fresh vegetables, and fermented foods like kimchi or yogurt to support a healthy gut.</li>
</ul>

<h3 class="font-headline text-2xl mt-6 mb-2">Phase 3: Ovulatory (Day 14, approx.)</h3>
<p>This is the main event! Estrogen and testosterone peak, leading to ovulation. You'll likely feel your most energetic and social. Your body needs fiber to process the hormone surge.</p>
<ul>
  <li><strong>Focus Foods:</strong> Fiber-rich fruits and vegetables like berries and leafy greens. Antioxidant-rich foods to combat inflammation. Light grains like quinoa are also excellent.</li>
</ul>

<h3 class="font-headline text-2xl mt-6 mb-2">Phase 4: Luteal (Days 15-28, approx.)</h3>
<p>After ovulation, progesterone rises. This is often when PMS symptoms appear as both estrogen and progesterone levels fall before your period. Focus on mood-boosting and blood-sugar-stabilizing foods.</p>
<ul>
  <li><strong>Focus Foods:</strong> Complex carbohydrates like sweet potatoes and brown rice to stabilize mood and energy. Foods rich in B vitamins, like eggs and legumes, can help with energy production. And again, magnesium is your friend for cravings and mood.</li>
</ul>
<p class="mt-4">By tuning into these phases, you're not just eating; you're collaborating with your body's natural rhythm.</p>
`
  },
  {
    slug: 'the-magic-of-seed-cycling',
    title: 'The Magic of Seed Cycling for Hormonal Balance',
    description: 'An introductory guide to seed cycling, a gentle and natural way to support your hormones and regulate your menstrual cycle.',
    author: 'Chloe Bennet',
    date: '2024-05-10',
    image: placeholderImages.find(p => p.id === 'blog-post-2'),
    content: `<p>Seed cycling is a growing wellness trend that involves eating specific seeds during the two main phases of your menstrual cycle (follicular and luteal) to help balance hormone levels.</p><p>It's a simple, gentle, and effective way to support your body's natural rhythms.</p>`
  }
];

export const userProfileData = {
  countries: ["USA", "Canada", "UK", "Germany", "France", "Australia", "Other"],
  dietaryPreferences: ["Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "Nut-Allergy", "Other"],
  healthConditions: ["Endometriosis", "PCOS", "Acne", "Irregular Periods", "None"],
  nutritionalGoals: ["Weight Loss", "Weight Gain", "Improve Nutrition", "Stay Fit", "Build Muscle"],
};

export const countryData: Record<string, { currency: string; currencySymbol: string; stores: string[] }> = {
    "USA": {
        currency: "USD",
        currencySymbol: "$",
        stores: ["Any Store", "Trader Joe's", "Whole Foods", "Costco", "Walmart", "Safeway", "Kroger"],
    },
    "Canada": {
        currency: "CAD",
        currencySymbol: "$",
        stores: ["Any Store", "Loblaws", "Sobeys", "Metro", "Costco", "Walmart", "Maxi"],
    },
    "UK": {
        currency: "GBP",
        currencySymbol: "£",
        stores: ["Any Store", "Tesco", "Sainsbury's", "Asda", "Morrisons", "Lidl", "Aldi"],
    },
    "Germany": {
        currency: "EUR",
        currencySymbol: "€",
        stores: ["Any Store", "Edeka", "Rewe", "Lidl", "Aldi", "Kaufland"],
    },
    "France": {
        currency: "EUR",
        currencySymbol: "€",
        stores: ["Any Store", "Carrefour", "E.Leclerc", "Intermarché", "Auchan", "Lidl"],
    },
    "Australia": {
        currency: "AUD",
        currencySymbol: "$",
        stores: ["Any Store", "Woolworths", "Coles", "Aldi", "IGA"],
    },
     "Other": {
        currency: "USD",
        currencySymbol: "$",
        stores: ["Any Store"],
    }
};
