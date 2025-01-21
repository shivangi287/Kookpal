// src/components/RecipeDisplay.js
import React from 'react';
import { Heart, Clock, Users, Bookmark } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const RecipeDisplay = ({ recipe, onFavorite, onBookmark, isFavorite, isBookmarked, onViewDetails }) => {
  const { user } = useAuth();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative aspect-w-16 aspect-h-9 overflow-hidden">
        <img 
          src={recipe.image} 
          alt={recipe.title}
          className="w-full h-64 object-cover transform hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
          }}
        />
        {user && (
          <div className="absolute top-2 right-2 flex gap-2">
            {/* Bookmark Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onBookmark(recipe);
              }}
              className="p-2 rounded-full bg-white shadow-md hover:bg-background transition-colors"
            >
              <Bookmark 
                size={20} 
                className={isBookmarked ? 'text-primary' : 'text-text-lighter'} 
                fill={isBookmarked ? '#a53860' : 'none'}
              />
            </button>
            {/* Favorite Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFavorite(recipe);
              }}
              className="p-2 rounded-full bg-white shadow-md hover:bg-background transition-colors"
            >
              <Heart 
                size={20} 
                className={isFavorite ? 'text-accent' : 'text-text-lighter'}
                fill={isFavorite ? '#da627d' : 'none'}
              />
            </button>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2 min-h-[3.5rem] text-secondary">
          {recipe.title}
        </h3>
        
        <div className="space-y-3">
          <div className="text-sm text-text-light flex items-center gap-1">
            <span className="font-medium">
              Uses {recipe.usedIngredientCount} of your ingredients
            </span>
            {recipe.missedIngredientCount > 0 && (
              <span className="text-text-lighter">
                (needs {recipe.missedIngredientCount} more)
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-sm text-text-light">
            {recipe.readyInMinutes && (
              <div className="flex items-center gap-1">
                <Clock size={16} className="text-accent" />
                {recipe.readyInMinutes} min
              </div>
            )}
            {recipe.servings && (
              <div className="flex items-center gap-1">
                <Users size={16} className="text-accent" />
                Serves {recipe.servings}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => onViewDetails(recipe)}
          className="mt-4 w-full px-4 py-2 bg-primary text-white rounded-lg 
            hover:bg-primary-600 transition-colors text-sm font-medium
            focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          View Recipe
        </button>
      </div>
    </div>
  );
};

export default RecipeDisplay;