// src/components/IngredientInput.js
import React, { useState, useRef, useEffect } from 'react';
import { X, Plus, Search } from 'lucide-react';
import { COMMON_INGREDIENTS, findSimilarIngredients } from '../utils/ingredientsUtils';

const IngredientInput = ({ onAddIngredient, existingIngredients }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [similarIngredients, setSimilarIngredients] = useState([]);
  const [showSimilar, setShowSimilar] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  const handleInputChange = (e) => {
    const value = e.target.value.toLowerCase();
    setInputValue(value);
    setShowSimilar(false);

    if (value.trim()) {
      // Get regular suggestions
      const filtered = COMMON_INGREDIENTS.filter(
        ingredient => ingredient.toLowerCase().includes(value)
      ).slice(0, 5);

      // If no exact matches, find similar ingredients
      if (filtered.length === 0) {
        const similar = findSimilarIngredients(value);
        if (similar.length > 0) {
          setSimilarIngredients(similar);
          setShowSimilar(true);
        }
      }

      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectIngredient = (ingredient) => {
    if (!existingIngredients.includes(ingredient)) {
      onAddIngredient(ingredient);
      setInputValue('');
      setSuggestions([]);
      setShowSuggestions(false);
      setShowSimilar(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setShowSimilar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={suggestionsRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          className="w-full p-3 pr-10 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-red-400 focus:border-transparent"
          placeholder="Type an ingredient..."
          value={inputValue}
          onChange={handleInputChange}
        />
        <Search className="absolute right-3 top-3 text-gray-400" size={20} />
      </div>

      {/* Suggestions Dropdown */}
      {(showSuggestions && suggestions.length > 0) && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="px-4 py-2 hover:bg-red-50 cursor-pointer flex items-center justify-between"
              onClick={() => handleSelectIngredient(suggestion)}
            >
              <span>{suggestion}</span>
              <Plus size={16} className="text-red-400" />
            </div>
          ))}
        </div>
      )}

      {/* Similar Ingredients Suggestion */}
      {(showSimilar && similarIngredients.length > 0) && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <p className="text-sm text-gray-600 mb-2">Did you mean:</p>
          <div className="space-y-2">
            {similarIngredients.map((ingredient, index) => (
              <button
                key={index}
                className="block w-full text-left px-3 py-2 rounded-md hover:bg-red-50 text-sm"
                onClick={() => handleSelectIngredient(ingredient)}
              >
                {ingredient}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default IngredientInput;