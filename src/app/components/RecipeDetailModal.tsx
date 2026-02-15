import { X, Clock, Users, ChefHat, PlayCircle, Plus, Minus } from 'lucide-react';
import { Recipe } from '../types/kitchen';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface RecipeDetailModalProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
}

export function RecipeDetailModal({ recipe, isOpen, onClose }: RecipeDetailModalProps) {
  const { t } = useTranslation();
  const [servings, setServings] = useState(recipe?.servings || 1);

  useEffect(() => {
    if (recipe) {
      setServings(recipe.servings || 1);
    }
  }, [recipe]);

  if (!isOpen || !recipe) return null;

  const increaseServings = () => {
    setServings(prev => prev + 1);
  };

  const decreaseServings = () => {
    if (servings > 1) {
      setServings(prev => prev - 1);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[32px] max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors z-10 shadow-sm"
        >
          <X className="w-5 h-5 text-gray-900" />
        </button>

        {/* Header Image */}
        <div className="relative h-64 sm:h-80 rounded-t-[32px] overflow-hidden">
          <ImageWithFallback
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <h2 className="text-white text-2xl sm:text-3xl mb-3">{recipe.title}</h2>
            <div className="flex flex-wrap gap-3">
              {recipe.cookTime && (
                <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-full px-4 py-2">
                  <Clock className="w-4 h-4 text-white" />
                  <span className="text-white text-sm">{recipe.cookTime}</span>
                </div>
              )}
              {recipe.category && (
                <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-full px-4 py-2">
                  <span className="text-white text-sm capitalize">{recipe.category}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {/* Servings Section */}
          <div className="mb-8 p-6 rounded-[24px] bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10 flex flex-wrap items-center justify-between gap-6">
            {/* Servings Selector */}
            <div>
              <label className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <Users className="w-4 h-4" />
                {t('recipes.servings_label')}
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={decreaseServings}
                  className="w-10 h-10 rounded-full bg-white border-2 border-primary/20 hover:border-primary hover:bg-primary/5 flex items-center justify-center transition-all"
                  disabled={servings <= 1}
                >
                  <Minus className="w-4 h-4 text-primary" />
                </button>
                <div className="flex-1 text-center min-w-[60px]">
                  <div className="text-3xl text-primary">{servings}</div>
                  <div className="text-xs text-gray-600">{t('recipes.servings')}</div>
                </div>
                <button
                  onClick={increaseServings}
                  className="w-10 h-10 rounded-full bg-white border-2 border-primary/20 hover:border-primary hover:bg-primary/5 flex items-center justify-center transition-all"
                >
                  <Plus className="w-4 h-4 text-primary" />
                </button>
              </div>
            </div>

            {/* Watch Video Button */}
            {recipe.youtubeUrl && (
              <a
                href={recipe.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-[#FF0000] text-white rounded-full hover:bg-[#CC0000] transition-colors shadow-lg shadow-red-500/20"
              >
                <PlayCircle className="w-5 h-5" />
                <span>Watch Video</span>
              </a>
            )}
          </div>

          {/* Ingredients */}
          <div className="mb-8">
            <h3 className="flex items-center gap-2 text-xl text-gray-900 mb-4">
              <ChefHat className="w-5 h-5 text-primary" />
              {t('recipes.key_ingredients')}
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {(recipe.ingredients || []).map((ingredient, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 rounded-[20px] bg-white border border-primary/10"
                >
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-gray-900">{ingredient}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div>
            <h3 className="text-xl text-gray-900 mb-4">{t('recipes.instructions')}</h3>
            <div className="space-y-4">
              {(recipe.instructions || []).map((instruction, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/70 text-white flex items-center justify-center text-sm">
                    {index + 1}
                  </div>
                  <p className="flex-1 text-gray-700 pt-1">{instruction}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
