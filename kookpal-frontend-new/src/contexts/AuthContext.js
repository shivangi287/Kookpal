// AuthContext.js
import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const login = (userData) => {
    setUser(userData);
    // Load user's favorites from localStorage
    const savedFavorites = JSON.parse(localStorage.getItem(`favorites_${userData.email}`) || '[]');
    setFavorites(savedFavorites);
  };

  const logout = () => {
    setUser(null);
    setFavorites([]);
  };

  const toggleFavorite = (recipe) => {
    let newFavorites;
    if (favorites.some(fav => fav.id === recipe.id)) {
      newFavorites = favorites.filter(fav => fav.id !== recipe.id);
    } else {
      newFavorites = [...favorites, recipe];
    }
    setFavorites(newFavorites);
    // Save to localStorage
    localStorage.setItem(`favorites_${user.email}`, JSON.stringify(newFavorites));
  };

  const isFavorite = (recipeId) => {
    return favorites.some(fav => fav.id === recipeId);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, favorites, toggleFavorite, isFavorite }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;