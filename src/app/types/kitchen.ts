export type IngredientStatus = 'in-stock' | 'low' | 'out';

export interface PantryItem {
  id: string;
  name: string;
  status: IngredientStatus;
  category: string;
  quantity?: string;
}

export interface Recipe {
  id: string;
  title: string;
  image: string;
  cookTime?: string;
  servings?: number;
  ingredients?: string[];
  instructions?: string[];
  category?: string;
  youtubeUrl?: string;
  status?: 'pending' | 'approved' | 'rejected';
  userId?: number;
  createdAt?: string;
}

export interface ShoppingListItem {
  id: string;
  name: string;
  quantity: string;
  recipeId?: string;
  recipeName?: string;
  checked: boolean;
}

export interface MarketUpdate {
  id: string;
  location: string;
  item: string;
  message: string;
}
