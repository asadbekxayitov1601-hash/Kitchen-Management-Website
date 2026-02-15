import { useState, useEffect } from 'react';
import { Search, Filter, Plus, Clock, ChefHat } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Recipe } from '../types/kitchen';
import { getRecipes, getFavorites, addFavorite, removeFavorite } from '../api/recipesApi';
import { RecipeCard } from '../components/RecipeCard';
import { RecipeDetailModal } from '../components/RecipeDetailModal';
import { SubmitRecipeModal } from '../components/SubmitRecipeModal';
import { PanLoader } from '../components/PanLoader';
import { toast } from 'sonner';
import { useAuth } from '../auth/AuthProvider';
import { motion } from 'framer-motion';

export function RecipesPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [recipesData, favoritesData] = await Promise.all([
        getRecipes(),
        user ? getFavorites() : Promise.resolve([])
      ]);
      setRecipes(recipesData);
      setFavorites(new Set(favoritesData.map(r => r.id)));
    } catch (e) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (recipe: Recipe) => {
    if (!user) {
      toast.error('Please login to save favorites');
      return;
    }

    try {
      if (favorites.has(recipe.id)) {
        await removeFavorite(recipe.id);
        const next = new Set(favorites);
        next.delete(recipe.id);
        setFavorites(next);
        toast.success(`Removed "${recipe.title}" from favorites`);
      } else {
        await addFavorite(recipe.id);
        const next = new Set(favorites);
        next.add(recipe.id);
        setFavorites(next);
        toast.success(`Added "${recipe.title}" to favorites`);
      }
    } catch (e) {
      toast.error('Failed to update favorite');
    }
  };

  const categories = ['all', ...Array.from(new Set(recipes.map((r) => r.category).filter((c): c is string => !!c)))];

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch =
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (recipe.category?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (recipe.ingredients || []).some((ing) => ing.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const recentRecipes = recipes.slice(0, 4);

  const handleViewRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsRecipeModalOpen(true);
  };

  const handleAddToShoppingList = (recipe: Recipe) => {
    // TODO: Implement adding recipe ingredients to shopping list via API
    const ingredientCount = recipe.ingredients?.length || 0;
    toast.success(`${ingredientCount} ingredients from "${recipe.title}" ready to add`, {
      description: 'Go to Shopping List to add them',
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl text-gray-900 mb-2">{t('recipes.title')}</h1>
            <p className="text-gray-600">
              {t('recipes.subtitle')}
            </p>
          </div>

          {user && (
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Plus className="w-5 h-5" />
              <span>{t('recipes.add', 'Add Recipe')}</span>
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <PanLoader />
          </div>
        ) : (
          <>
            {/* Recent Recipes Section */}
            {recentRecipes.length > 0 && searchQuery === '' && selectedCategory === 'all' && (
              <div className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                  <Clock className="w-5 h-5 text-secondary" />
                  <h2 className="text-xl font-semibold text-gray-800">New Arrivals</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {recentRecipes.map((recipe, idx) => (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      key={`recent-${recipe.id}`}
                      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 cursor-pointer"
                      onClick={() => handleViewRecipe(recipe)}
                    >
                      <div className="aspect-[4/3] overflow-hidden">
                        <img
                          src={recipe.image}
                          alt={recipe.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {recipe.category && (
                          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-medium uppercase tracking-wider text-gray-600">
                            {recipe.category}
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{recipe.title}</h3>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          {recipe.cookTime && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {recipe.cookTime}
                            </span>
                          )}
                          {recipe.servings && (
                            <span className="flex items-center gap-1">
                              <ChefHat className="w-3 h-3" /> {recipe.servings} pp
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Search and Filters */}
            <div className="mb-8 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder={t('recipes.search_placeholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-[20px] bg-white border border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <button className="flex items-center justify-center gap-2 px-5 py-3 rounded-[16px] bg-white border border-primary/20 hover:bg-primary/5 transition-colors sm:w-auto">
                  <Filter className="w-4 h-4 text-primary" />
                  <span className="text-sm text-gray-700">{t('recipes.filters')}</span>
                </button>
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-[16px] text-sm transition-all ${selectedCategory === category
                      ? 'bg-gradient-to-r from-primary to-primary/80 text-white shadow-md'
                      : 'bg-white border border-primary/20 text-gray-700 hover:bg-primary/5'
                      }`}
                  >
                    {category === 'all' ? t('recipes.all') : category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-6">
              <p className="text-sm text-gray-600">
                Showing {filteredRecipes.length} {filteredRecipes.length === 1 ? 'recipe' : 'recipes'}
              </p>
            </div>

            {/* Recipe Grid */}
            {filteredRecipes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    isFavorite={favorites.has(recipe.id)}
                    onAddToShoppingList={handleAddToShoppingList}
                    onViewRecipe={handleViewRecipe}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl text-gray-900 mb-2">No recipes found</h3>
                <p className="text-gray-600">Try adjusting your search or filters</p>
              </div>
            )}
          </>
        )}
      </div>

      <RecipeDetailModal
        recipe={selectedRecipe}
        isOpen={isRecipeModalOpen}
        onClose={() => setIsRecipeModalOpen(false)}
      />

      <SubmitRecipeModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
}
