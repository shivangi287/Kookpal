// src/utils/ingredientsUtils.js

export const COMMON_INGREDIENTS = [
    // Fruits
    'apple', 'banana', 'orange', 'lemon', 'lime', 'strawberry', 'blueberry', 'raspberry',
    'blackberry', 'grape', 'mango', 'pineapple', 'peach', 'pear', 'plum', 'kiwi',
    'watermelon', 'coconut', 'avocado',
  
    // Vegetables
    'carrot', 'potato', 'onion', 'garlic', 'tomato', 'lettuce', 'spinach', 'broccoli',
    'cauliflower', 'bell pepper', 'cucumber', 'zucchini', 'eggplant', 'mushroom',
    'corn', 'peas', 'celery', 'asparagus', 'green beans', 'sweet potato', 'cabbage',
    'kale', 'brussels sprouts',
  
    // Proteins
    'chicken', 'beef', 'pork', 'lamb', 'turkey', 'fish', 'salmon', 'tuna', 'shrimp',
    'tofu', 'eggs', 'bacon', 'sausage', 'ham',
  
    // Dairy
    'milk', 'cheese', 'butter', 'yogurt', 'cream', 'sour cream', 'cream cheese',
    'mozzarella', 'cheddar', 'parmesan', 'cottage cheese',
  
    // Grains
    'rice', 'pasta', 'bread', 'flour', 'oats', 'quinoa', 'couscous', 'barley',
    'cornmeal', 'breadcrumbs',
  
    // Pantry Items
    'sugar', 'salt', 'pepper', 'olive oil', 'vegetable oil', 'vinegar', 'soy sauce',
    'honey', 'maple syrup', 'mustard', 'ketchup', 'mayonnaise', 'peanut butter',
    'jam', 'chocolate', 'vanilla extract', 'baking powder', 'baking soda',
  
    // Herbs & Spices
    'basil', 'oregano', 'thyme', 'rosemary', 'sage', 'mint', 'cilantro', 'parsley',
    'cinnamon', 'nutmeg', 'cumin', 'paprika', 'chili powder', 'ginger', 'turmeric'
  ];
  
  // Function to calculate Levenshtein distance between two strings
  const getLevenshteinDistance = (str1, str2) => {
    const track = Array(str2.length + 1).fill(null).map(() =>
      Array(str1.length + 1).fill(null));
  
    for (let i = 0; i <= str1.length; i++) track[0][i] = i;
    for (let j = 0; j <= str2.length; j++) track[j][0] = j;
  
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        track[j][i] = Math.min(
          track[j][i - 1] + 1,
          track[j - 1][i] + 1,
          track[j - 1][i - 1] + indicator
        );
      }
    }
    return track[str2.length][str1.length];
  };
  
  // Function to find similar ingredients
  export const findSimilarIngredients = (input) => {
    const inputLower = input.toLowerCase();
    
    // Return empty array for very short inputs
    if (inputLower.length < 2) return [];
  
    // Find ingredients with similar spelling
    const similarIngredients = COMMON_INGREDIENTS
      .map(ingredient => ({
        ingredient,
        distance: getLevenshteinDistance(inputLower, ingredient.toLowerCase())
      }))
      .filter(({ distance }) => distance <= 3 && distance > 0)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3)
      .map(({ ingredient }) => ingredient);
  
    return similarIngredients;
  };
  
  // Function to categorize ingredients
  export const INGREDIENT_CATEGORIES = {
    Fruits: ['apple', 'banana', 'orange', /* ... */],
    Vegetables: ['carrot', 'potato', 'onion', /* ... */],
    Proteins: ['chicken', 'beef', 'pork', /* ... */],
    Dairy: ['milk', 'cheese', 'butter', /* ... */],
    'Herbs & Spices': ['basil', 'oregano', 'thyme', /* ... */]
  };