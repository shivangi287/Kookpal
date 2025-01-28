const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();  // Add this line to use environment variables

const app = express();

// Your API key should be in a .env file
const API_KEY = process.env.SPOONACULAR_API_KEY;

// Enable CORS
app.use(cors());

// Middleware to check API key
const checkApiKey = (req, res, next) => {
  if (!API_KEY) {
    return res.status(500).json({ 
      error: 'API key not configured',
      message: 'Please make sure you have set up your Spoonacular API key'
    });
  }
  next();
};

// Route to search recipes by ingredients
app.get('/api/recipes', checkApiKey, async (req, res) => {
    const { ingredients } = req.query;
    const url = `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${API_KEY}&ingredients=${ingredients}&number=10`;
    
    try {
        console.log('Fetching recipes for ingredients:', ingredients);
        const response = await fetch(url);
        
        if (response.status === 401) {
            return res.status(401).json({ 
                error: 'Invalid API key',
                message: 'Please check your Spoonacular API key'
            });
        }
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Found recipes:', data.length);
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            error: error.message,
            message: 'Failed to fetch recipes'
        });
    }
});

// Route to get recipe details
app.get('/api/recipe/:id', checkApiKey, async (req, res) => {
    const { id } = req.params;
    const url = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`;
    
    try {
        console.log('Fetching details for recipe:', id);
        const response = await fetch(url);
        
        if (response.status === 401) {
            return res.status(401).json({ 
                error: 'Invalid API key',
                message: 'Please check your Spoonacular API key'
            });
        }

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            error: error.message,
            message: 'Failed to fetch recipe details'
        });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});