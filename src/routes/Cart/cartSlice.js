import { createSlice } from "@reduxjs/toolkit";
import PropTypes from 'prop-types';
import { nanoid } from 'nanoid';

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

const getFromStorage = (key, defaultValue = []) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error(`Ошибка при чтении ${key} из localStorage:`, error);
    return defaultValue;
  }
};

const setStorageData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Ошибка при сохранении ${key} в localStorage:`, error);
  }
};

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

const initialState = {
  items: getFromStorage(STORAGE_KEYS.CART, []),
  prices: getFromStorage(STORAGE_KEYS.PRICES, defaultPrices)
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
        setStorageData(STORAGE_KEYS.PRICES, state.prices);
      }

      const existingItem = state.items.find(item => item.id === id);
      
      if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + quantity;
        existingItem.price = Number(price);
        existingItem.updatedAt = new Date().toISOString();
      } else {
        state.items.push({ 
          id, 
          text, 
          img, 
          price: Number(price), 
          quantity,
          addedAt: new Date().toISOString()
        });
      }
      
      setStorageData(STORAGE_KEYS.CART, state.items);
    },

    clearCart: (state) => {
      state.items = [];
      setStorageData(STORAGE_KEYS.CART, []);
    },

    updatePrice: (state, action) => {
      const { itemName, newPrice } = action.payload;
      if (itemName && newPrice !== undefined) {
        state.prices[itemName] = Number(newPrice);
        
        state.items = state.items.map(item => {
          if (item.text === itemName) {
            return { ...item, price: Number(newPrice) };
          }
          return item;
        });

        setStorageData(STORAGE_KEYS.PRICES, state.prices);
        setStorageData(STORAGE_KEYS.CART, state.items);
      }
    },

    incrementQuantity: (state, action) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        item.quantity = (item.quantity || 1) + 1;
        setStorageData(STORAGE_KEYS.CART, state.items);
      }
    },

    decrementQuantity: (state, action) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        setStorageData(STORAGE_KEYS.CART, state.items);
      }
    },

    removeItem: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      setStorageData(STORAGE_KEYS.CART, state.items);
    },

    setCartItems: (state, action) => {
      state.items = action.payload;
      setStorageData(STORAGE_KEYS.CART, state.items);
    },

    restoreCart: (state) => {
      state.items = getFromStorage(STORAGE_KEYS.CART, []);
      state.prices = getFromStorage(STORAGE_KEYS.PRICES, defaultPrices);
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