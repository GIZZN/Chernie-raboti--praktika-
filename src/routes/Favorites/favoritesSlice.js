import { createSlice } from '@reduxjs/toolkit';
import PropTypes from 'prop-types';

export const FavoriteItemType = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  text: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  img: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  addedAt: PropTypes.string.isRequired
});

const STORAGE_KEYS = Object.freeze({
  FAVORITES: 'favorites'
});

const getFromStorage = (key, defaultValue = []) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Ошибка чтения из localStorage: ${error}`);
    return defaultValue;
  }
};

const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Ошибка сохранения в localStorage: ${error}`);
  }
};

const initialState = {
  items: getFromStorage(STORAGE_KEYS.FAVORITES, [])
};

// я хуй знат как она работает 
const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addToFavorites: (state, action) => {
      const item = action.payload;
      const id = typeof item === 'string' ? item : item.id;
      
      if (!state.items.includes(id)) {
        state.items.push(id);
        if (typeof item === 'object') {
          const publishedItems = JSON.parse(localStorage.getItem('publishedItems') || '[]');
          if (!publishedItems.find(i => i.id === id)) {
            publishedItems.push(item);
            localStorage.setItem('publishedItems', JSON.stringify(publishedItems));
          }
        }
        saveToStorage(STORAGE_KEYS.FAVORITES, state.items);
      }
    },
    
    removeFromFavorites: (state, action) => {
      state.items = state.items.filter(id => id !== action.payload);
      saveToStorage(STORAGE_KEYS.FAVORITES, state.items);
    },
    
    clearFavorites: (state) => {
      state.items = [];
      saveToStorage(STORAGE_KEYS.FAVORITES, []);
    }
  }
});

export const { 
  addToFavorites, 
  removeFromFavorites, 
  clearFavorites 
} = favoritesSlice.actions;

export default favoritesSlice.reducer; 