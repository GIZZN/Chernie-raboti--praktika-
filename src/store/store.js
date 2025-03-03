import { configureStore } from '@reduxjs/toolkit';
import PropTypes from 'prop-types';
import profileReducer from '../routes/Profile/profileSlice';
import cartReducer, { CartItemType } from '../routes/Cart/cartSlice';
import TovariReducer, { ProductType } from '../routes/Tovari/TovariSlice';
import favoritesReducer from '../routes/Favorites/favoritesSlice';
import pagesReducer, { PageType } from '../routes/poisk/pagesSlice';
import { api } from '../api/apiSlice';
import categoryReducer from '../routes/Tovari/categorySlice';
import uiReducer from './slices/uiSlice';
import layoutReducer from './slices/layoutSlice';

const defaultPrices = {
  "Отвертка": 1900,
  "Молоток": 2500,
  "Болгарка": 5900,
  "Дрель": 4500,
  "Цемент": 8900,
  "Цемент 52": 9900,
  "Палет Кирпичей": 15000,
  "Кирпичи": 7500,
  "Плитка": 3900,
  "Плитка Итальянская": 6900
};

const defaultUser = {
  id: '1',
  email: 'admin@admin.com',
  password: 'admin',
  name: 'Администратор',
  surname: 'Админов',
  role: 'admin',
  publishedItems: [],
  paidItems: [],
  achievements: []
};

export const StoreType = PropTypes.shape({
  profile: PropTypes.object.isRequired,
  cart: PropTypes.shape({
    items: PropTypes.arrayOf(CartItemType).isRequired,
    prices: PropTypes.objectOf(PropTypes.number).isRequired
  }).isRequired,
  tovari: PropTypes.arrayOf(ProductType).isRequired,
  pages: PropTypes.arrayOf(PageType).isRequired,
  favorites: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.string).isRequired
  }).isRequired
});

const users = JSON.parse(localStorage.getItem('users') || '[]');
if (users.length === 0) {
  localStorage.setItem('users', JSON.stringify([defaultUser]));
}

const preloadedState = {
  tovari: [
    ...JSON.parse(localStorage.getItem('tovari') || '[]'),
    ...JSON.parse(localStorage.getItem('publishedItems') || '[]')
  ],
  cart: {
    items: JSON.parse(localStorage.getItem('cart')) || [],
    prices: JSON.parse(localStorage.getItem('prices')) || defaultPrices,
  },
  favorites: {
    items: JSON.parse(localStorage.getItem('favorites')) || []
  },
  profile: {
    currentUser: JSON.parse(localStorage.getItem('currentUser')) || null,
    users: JSON.parse(localStorage.getItem('users')) || [defaultUser],
    isAuth: !!localStorage.getItem('currentUser'),
    theme: localStorage.getItem('theme') || 'light'
  }
};

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    cart: cartReducer,
    tovari: TovariReducer,
    pages: pagesReducer,
    favorites: favoritesReducer,
    [api.reducerPath]: api.reducer,
    categories: categoryReducer,
    ui: uiReducer,
    layout: layoutReducer
  },
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(api.middleware)
});

store.subscribe(() => {
  const state = store.getState();
  try {
    const publishedItems = state.profile.users.reduce((acc, user) => {
      if (user?.publishedItems) {
        return [...acc, ...user.publishedItems];
      }
      return acc;
    }, []);

    const allTovari = [...state.tovari, ...publishedItems];
    
    localStorage.setItem('tovari', JSON.stringify(allTovari));
    localStorage.setItem('cart', JSON.stringify(state.cart.items));
    localStorage.setItem('prices', JSON.stringify(state.cart.prices));
    localStorage.setItem('favorites', JSON.stringify(state.favorites.items));
    localStorage.setItem('users', JSON.stringify(state.profile.users));
    localStorage.setItem('publishedItems', JSON.stringify(publishedItems));
    
    if (state.profile.currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(state.profile.currentUser));
    }
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
});

console.log('Initial store state:', store.getState());
