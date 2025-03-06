import { createSlice, createSelector } from '@reduxjs/toolkit';
import PropTypes from 'prop-types';
import { StorageService } from '../../services/StorageService';

// Типизация элемента избранного
export const FavoriteItemType = PropTypes.shape({
  id: PropTypes.oneOfType([
    PropTypes.string, 
    PropTypes.number
  ]).isRequired,
  text: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  img: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  addedAt: PropTypes.string.isRequired,
  isPublished: PropTypes.bool
});

// Константы
const STORAGE_KEYS = Object.freeze({
  FAVORITES: 'favorites',
  PUBLISHED_ITEMS: 'publishedItems'
});

// Сервис для работы с хранилищем
const storage = new StorageService();

// Вспомогательные функции
const validateItem = (item) => {
  if (!item || typeof item !== 'object') return false;
  return ['id', 'text', 'price', 'img'].every(key => key in item);
};

const normalizeItem = (item) => ({
  ...item,
  addedAt: new Date().toISOString(),
  isPublished: item.isPublished || false
});

// Селекторы
export const selectFavorites = state => state.favorites?.items || [];
export const selectPublishedItems = state => state.profile?.users?.reduce((acc, user) => {
  if (user?.publishedItems) {
    return [...acc, ...user.publishedItems];
  }
  return acc;
}, []) || [];

export const selectFavoriteItems = createSelector(
  [selectFavorites, selectPublishedItems, state => state.tovari || []],
  (favorites, publishedItems, allItems) => {
    const allAvailableItems = [...allItems, ...publishedItems];
    
    return favorites
      .map(id => {
        const item = allAvailableItems.find(item => item.id === id);
        if (!item) return null;
        return normalizeItem(item);
      })
      .filter(Boolean);
  }
);

// Начальное состояние
const initialState = {
  items: storage.getItem(STORAGE_KEYS.FAVORITES, []),
  loading: false,
  error: null
};

// Slice
const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    // Добавление в избранное
    addToFavorites: (state, action) => {
      const item = action.payload;
      const id = typeof item === 'string' ? item : item.id;
      
      if (!state.items.includes(id)) {
        state.items.push(id);

        // Если добавляется опубликованный товар
        if (typeof item === 'object' && item.isPublished) {
          const publishedItems = storage.getItem(STORAGE_KEYS.PUBLISHED_ITEMS, []);
          if (!publishedItems.find(i => i.id === id)) {
            publishedItems.push(normalizeItem(item));
            storage.setItem(STORAGE_KEYS.PUBLISHED_ITEMS, publishedItems);
          }
        }

        storage.setItem(STORAGE_KEYS.FAVORITES, state.items);
      }
    },
    
    // Удаление из избранного
    removeFromFavorites: (state, action) => {
      state.items = state.items.filter(id => id !== action.payload);
      storage.setItem(STORAGE_KEYS.FAVORITES, state.items);
    },
    
    // Очистка избранного
    clearFavorites: (state) => {
      state.items = [];
      storage.setItem(STORAGE_KEYS.FAVORITES, []);
    },

    // Установка состояния загрузки
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // Установка ошибки
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // Синхронизация с хранилищем
    syncWithStorage: (state) => {
      state.items = storage.getItem(STORAGE_KEYS.FAVORITES, []);
    }
  }
});

// Экспорт actions
export const { 
  addToFavorites, 
  removeFromFavorites, 
  clearFavorites,
  setLoading,
  setError,
  syncWithStorage
} = favoritesSlice.actions;

// Thunk для асинхронного добавления в избранное
export const addToFavoritesAsync = (item) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    
    if (!validateItem(item)) {
      throw new Error('Invalid item data');
    }

    dispatch(addToFavorites(item));
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export default favoritesSlice.reducer; 