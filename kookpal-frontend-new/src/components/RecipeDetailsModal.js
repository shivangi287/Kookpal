// src/components/RecipeDetailsModal.js
import React from 'react';
import { X, Heart, Clock, Users, DollarSign, Bookmark } from 'lucide-react';

const RecipeDetailsModal = ({ recipe, onClose, onFavorite, onBookmark, isFavorite, isBookmarked }) => {
  if (!recipe) return null;

  return (
    <div className="fixed inset-0 bg-secondary bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-text-light hover:text-text z-10 bg-white rounded-full p-1"
        >
          <X size={24} />
        </button>

        {/* Recipe Content */}
        <div className="p-6">
          {/* Header Section */}
          <div className="relative mb-6">
            <img 
              src={recipe.image} 
              alt={recipe.title}
              className="w-full h-64 object-cover rounded-lg"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
              }}
            />
            <div className="absolute top-4 right-14 flex gap-2">
              <button
                onClick={() => onBookmark(recipe)}
                className="p-2 rounded-full bg-white shadow-md hover:bg-background transition-colors"
              >
                <Bookmark 
                  size={20} 
                  className={isBookmarked ? 'text-primary' : 'text-text-lighter'}
                  fill={isBookmarked ? '#a53860' : 'none'}
                />
              </button>
              <button
                onClick={() => onFavorite(recipe)}
                className="p-2 rounded-full bg-white shadow-md hover:bg-background transition-colors"
              >
                <Heart 
                  size={20} 
                  className={isFavorite ? 'text-accent' : 'text-text-lighter'}
                  fill={isFavorite ? '#da627d' : 'none'}
                />
              </button>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-4 text-secondary">{recipe.title}</h2>

          {/* Recipe Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-background p-3 rounded-lg flex items-center gap-2">
              <Clock size={20} className="text-accent" />
              <div>
                <p className="text-sm text-text-light">Cooking Time</p>
                <p className="font-semibold text-text">{recipe.readyInMinutes} min</p>
              </div>
            </div>
            <div className="bg-background p-3 rounded-lg flex items-center gap-2">
              <Users size={20} className="text-accent" />
              <div>
                <p className="text-sm text-text-light">Servings</p>
                <p className="font-semibold text-text">{recipe.servings}</p>
              </div>
            </div>
            {recipe.pricePerServing && (
              <div className="bg-background p-3 rounded-lg flex items-center gap-2">
                <DollarSign size={20} className="text-accent" />
                <div>
                  <p className="text-sm text-text-light">Cost per serving</p>
                  <p className="font-semibold text-text">${(recipe.pricePerServing / 100).toFixed(2)}</p>
                </div>
              </div>
            )}
            {recipe.healthScore && (
              <div className="bg-background p-3 rounded-lg flex items-center gap-2">
                <div className="text-accent text-xl font-bold">%</div>
                <div>
                  <p className="text-sm text-text-light">Health Score</p>
                  <p className="font-semibold text-text">{recipe.healthScore}</p>
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Ingredients */}
            <div className="bg-background rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-secondary">Ingredients</h3>
              <ul className="space-y-2">
                {recipe.extendedIngredients?.map((ingredient, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    <span className="text-text">{ingredient.original}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructions */}
            <div className="bg-background rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-secondary">Instructions</h3>
              {recipe.analyzedInstructions?.[0]?.steps ? (
                <ol className="space-y-4">
                  {recipe.analyzedInstructions[0].steps.map((step, index) => (
                    <li key={index} className="flex gap-2">
                      <span className="font-bold text-primary min-w-[1.5rem]">{index + 1}.</span>
                      <span className="text-text">{step.step}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <div 
                  dangerouslySetInnerHTML={{ __html: recipe.instructions }}
                  className="prose prose-sm max-w-none text-text"
                />
              )}
            </div>
          </div>

          {/* Additional Information */}
          {recipe.sourceUrl && (
            <div className="mt-6 pt-6 border-t border-background-dark">
              <p className="text-sm text-text-light">
                Source:{' '}
                <a 
                  href={recipe.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary-600"
                >
                  Original Recipe
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailsModal;