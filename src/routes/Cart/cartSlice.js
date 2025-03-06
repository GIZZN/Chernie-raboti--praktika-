import { createSlice } from "@reduxjs/toolkit";
import PropTypes from 'prop-types';
import { nanoid } from 'nanoid';
import { StorageService } from '../../services/StorageService';

export const CartItemType = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  text: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  img: PropTypes.string.isRequired,
  quantity: PropTypes.number.isRequired,
  addedAt: PropTypes.string.isRequired,
  updatedAt: PropTypes.string
});

const STORAGE_KEYS = Object.freeze({
  CART: 'cart',
  PRICES: 'prices'
});

const DEFAULT_PRICES = Object.freeze({
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
});

const storage = new StorageService();

const normalizeCartItem = (item, quantity = 1) => ({
  id: item.id || nanoid(),
  text: item.text,
  img: item.img,
  price: Number(item.price) || 0,
  quantity: Number(quantity),
  addedAt: new Date().toISOString()
});

const updateItemQuantity = (items, id, delta) => {
  return items.map(item => {
    if (item.id === id) {
      const newQuantity = Math.max(1, (item.quantity || 1) + delta);
      return { 
        ...item, 
        quantity: newQuantity,
        updatedAt: new Date().toISOString()
      };
    }
    return item;
  });
};

const initialState = {
  items: storage.getItem(STORAGE_KEYS.CART, []),
  prices: storage.getItem(STORAGE_KEYS.PRICES, DEFAULT_PRICES)
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { id, text, img, price = 0, quantity = 1 } = action.payload;
      
      if (!Array.isArray(state.items)) {
        state.items = [];
      }

      if (price && !state.prices[text]) {
        state.prices[text] = Number(price);
        storage.setItem(STORAGE_KEYS.PRICES, state.prices);
      }

      const existingItem = state.items.find(item => item.id === id);
      
      if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + quantity;
        existingItem.price = Number(price);
        existingItem.updatedAt = new Date().toISOString();
      } else {
        state.items.push(normalizeCartItem(action.payload, quantity));
      }
      
      storage.setItem(STORAGE_KEYS.CART, state.items);
    },

    clearCart: (state) => {
      state.items = [];
      storage.setItem(STORAGE_KEYS.CART, []);
    },

    updatePrice: (state, action) => {
      const { itemName, newPrice } = action.payload;
      if (!itemName || newPrice === undefined) return;

      state.prices[itemName] = Number(newPrice);
      state.items = state.items.map(item => {
        if (item.text === itemName) {
          return { ...item, price: Number(newPrice) };
        }
        return item;
      });

      storage.setItem(STORAGE_KEYS.PRICES, state.prices);
      storage.setItem(STORAGE_KEYS.CART, state.items);
    },

    incrementQuantity: (state, action) => {
      state.items = updateItemQuantity(state.items, action.payload, 1);
      storage.setItem(STORAGE_KEYS.CART, state.items);
    },

    decrementQuantity: (state, action) => {
      state.items = updateItemQuantity(state.items, action.payload, -1);
      storage.setItem(STORAGE_KEYS.CART, state.items);
    },

    removeItem: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      storage.setItem(STORAGE_KEYS.CART, state.items);
    },

    setCartItems: (state, action) => {
      state.items = Array.isArray(action.payload) 
        ? action.payload.map(item => normalizeCartItem(item))
        : [];
      storage.setItem(STORAGE_KEYS.CART, state.items);
    },

    restoreCart: (state) => {
      state.items = storage.getItem(STORAGE_KEYS.CART, []);
      state.prices = storage.getItem(STORAGE_KEYS.PRICES, DEFAULT_PRICES);
    }
  }
});

export const { 
  addToCart, 
  clearCart, 
  updatePrice, 
  incrementQuantity,
  decrementQuantity,
  removeItem,
  setCartItems,
  restoreCart
} = cartSlice.actions;

export default cartSlice.reducer;