// src/components/KooKpal.js
import React, { useState, useEffect } from 'react';
import { Loader, Heart, User, ChevronDown, Bookmark, X, UtensilsCrossed, Apple } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from './LoginModal';
import RecipeDisplay from './RecipeDisplay';
import RecipeDetailsModal from './RecipeDetailsModal';
import IngredientInput from './IngredientInput';
import { BACKEND_URL } from '../config';

const KooKpal = () => {
  const { user, login, logout, favorites, toggleFavorite, isFavorite } = useAuth();
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      const savedBookmarks = JSON.parse(localStorage.getItem(`bookmarks_${user.email}`) || '[]');
      setBookmarks(savedBookmarks);
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileMenu && !event.target.closest('.profile-menu')) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileMenu]);

  const searchRecipes = async (ingredientsList) => {
    if (ingredientsList.length === 0) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/recipe?ingredients=${ingredientsList.join(',')}`
      );
      if (!response.ok) throw new Error('Failed to fetch recipes');
      const data = await response.json();
      setRecipes(data);
    } catch (err) {
      setError(err.message);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const getRecipeDetails = async (recipe) => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/recipe/${recipe.id}`);
      if (!response.ok) throw new Error('Failed to fetch recipe details');
      const detailedRecipe = await response.json();
      setSelectedRecipe(detailedRecipe);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching recipe details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = (recipe) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    toggleFavorite(recipe);
  };

  const toggleBookmark = (recipe) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    const existingBookmarks = JSON.parse(localStorage.getItem(`bookmarks_${user.email}`) || '[]');
    let newBookmarks;
    
    if (existingBookmarks.some(b => b.id === recipe.id)) {
      newBookmarks = existingBookmarks.filter(b => b.id !== recipe.id);
    } else {
      newBookmarks = [...existingBookmarks, recipe];
    }
    
    setBookmarks(newBookmarks);
    localStorage.setItem(`bookmarks_${user.email}`, JSON.stringify(newBookmarks));
  };

  const removeIngredient = (index) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
    if (newIngredients.length > 0) {
      searchRecipes(newIngredients);
    } else {
      setRecipes([]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background bg-food-pattern">
      {/* Header */}
      <header className="bg-secondary text-white shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <UtensilsCrossed className="text-accent" size={28} />
            KooKpal
          </h1>
          
          <div className="flex items-center gap-6">
            {user ? (
              <>
                <button 
                  onClick={() => setShowFavorites(!showFavorites)}
                  className="hover:text-accent relative group"
                >
                  <Heart size={24} />
                  <span className="hidden group-hover:block absolute -bottom-8 whitespace-nowrap bg-secondary text-white text-xs py-1 px-2 rounded">
                    Favorites
                  </span>
                </button>

                <button 
                  onClick={() => setShowBookmarks(!showBookmarks)}
                  className="hover:text-accent relative group"
                >
                  <Bookmark size={24} />
                  <span className="hidden group-hover:block absolute -bottom-8 whitespace-nowrap bg-secondary text-white text-xs py-1 px-2 rounded">
                    Bookmarks
                  </span>
                </button>

                <div className="relative profile-menu">
                  <button 
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-2 hover:text-accent focus:outline-none"
                  >
                    <User size={24} />
                    <span>{user.name}</span>
                    <ChevronDown size={16} />
                  </button>

                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                      <div className="px-4 py-2 text-sm text-text border-b border-background-dark">
                        Signed in as<br/>
                        <span className="font-medium">{user.email}</span>
                      </div>
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-sm text-text hover:bg-background transition-colors"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <button 
                onClick={() => setShowLoginModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-600 
                  text-white rounded-lg transition-colors font-medium"
              >
                <User size={20} />
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full">
        <div className="flex flex-col md:flex-row min-h-screen relative">
          {/* Left Side - Ingredients Panel - 30% */}
          <div className="md:w-[30%] bg-white bg-opacity-90 p-6 relative">
            <div className="sticky top-6">
              <h2 className="text-2xl font-bold mb-6 text-secondary flex items-center gap-2">
                <UtensilsCrossed className="text-primary" size={24} />
                Ingredients
              </h2>
              
              <IngredientInput 
                onAddIngredient={(ingredient) => {
                  setIngredients([...ingredients, ingredient]);
                  searchRecipes([...ingredients, ingredient]);
                }}
                existingIngredients={ingredients}
              />

              <div className="mt-6 space-y-3">
                {ingredients.map((ingredient, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-background rounded-lg 
                      hover:bg-background-dark transition-all border border-background-dark"
                  >
                    <span className="text-text">{ingredient}</span>
                    <button
                      onClick={() => removeIngredient(index)}
                      className="text-primary hover:text-accent p-1 rounded-full hover:bg-background"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Vertical Divider Line */}
          <div className="hidden md:block w-[1px] bg-background-dark absolute left-[30%] top-0 bottom-0"></div>

          {/* Right Side - Recipe Results - 70% */}
          <div className="md:w-[70%] bg-background min-h-screen">
            <div className="max-w-5xl mx-auto p-8">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <Loader className="animate-spin mb-4 text-primary" size={32} />
                  <p className="text-text">Finding recipes...</p>
                </div>
              ) : error ? (
                <div className="text-center text-primary p-4">
                  {error}
                </div>
              ) : recipes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recipes.map(recipe => (
                    <RecipeDisplay
                      key={recipe.id}
                      recipe={recipe}
                      onFavorite={handleFavoriteToggle}
                      onBookmark={toggleBookmark}
                      isFavorite={user ? isFavorite(recipe.id) : false}
                      isBookmarked={user ? bookmarks.some(b => b.id === recipe.id) : false}
                      onViewDetails={getRecipeDetails}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center text-text-light p-4 flex flex-col items-center gap-3">
                  <Apple size={32} className="text-primary opacity-50" />
                  Add ingredients to find recipes!
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      {selectedRecipe && (
        <RecipeDetailsModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          onFavorite={handleFavoriteToggle}
          onBookmark={toggleBookmark}
          isFavorite={user ? isFavorite(selectedRecipe.id) : false}
          isBookmarked={user ? bookmarks.some(b => b.id === selectedRecipe.id) : false}
        />
      )}

      {showFavorites && (
        <div className="fixed inset-0 bg-secondary bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative p-6">
            <button 
              onClick={() => setShowFavorites(false)}
              className="absolute top-4 right-4 text-text-light hover:text-text"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-secondary">My Favorite Recipes</h2>
            {favorites.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {favorites.map(recipe => (
                  <RecipeDisplay
                    key={recipe.id}
                    recipe={recipe}
                    onFavorite={handleFavoriteToggle}
                    onBookmark={toggleBookmark}
                    isFavorite={true}
                    isBookmarked={bookmarks.some(b => b.id === recipe.id)}
                    onViewDetails={getRecipeDetails}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-text-light">No favorite recipes yet!</p>
            )}
          </div>
        </div>
      )}

      {showBookmarks && (
        <div className="fixed inset-0 bg-secondary bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative p-6">
            <button 
              onClick={() => setShowBookmarks(false)}
              className="absolute top-4 right-4 text-text-light hover:text-text"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-secondary">My Bookmarks</h2>
            {bookmarks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {bookmarks.map(recipe => (
                  <RecipeDisplay
                    key={recipe.id}
                    recipe={recipe}
                    onFavorite={handleFavoriteToggle}
                    onBookmark={toggleBookmark}
                    isFavorite={isFavorite(recipe.id)}
                    isBookmarked={true}
                    onViewDetails={getRecipeDetails}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-text-light">No bookmarked recipes yet!</p>
            )}
          </div>
        </div>
      )}

      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLogin={(userData) => {
            login(userData);
            setShowLoginModal(false);
          }}
        />
      )}
    </div>
  );
};

export default KooKpal;