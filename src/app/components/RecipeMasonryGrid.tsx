import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { Recipe } from '../types/kitchen';
import { RecipeCard } from './RecipeCard';

interface RecipeMasonryGridProps {
  recipes: Recipe[];
  favorites?: Set<string>;
  onAddToShoppingList: (recipe: Recipe) => void;
  onViewRecipe: (recipe: Recipe) => void;
  onToggleFavorite?: (recipe: Recipe) => void;
}

export function RecipeMasonryGrid({
  recipes,
  favorites,
  onAddToShoppingList,
  onViewRecipe,
  onToggleFavorite,
}: RecipeMasonryGridProps) {
  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Recipe Collection</h1>
          <p className="text-gray-600">
            Authentic Uzbek cuisine from Tashkent to Samarkand
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              isFavorite={favorites?.has(recipe.id)}
              onAddToShoppingList={onAddToShoppingList}
              onViewRecipe={onViewRecipe}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
