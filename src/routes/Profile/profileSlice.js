import { createSlice } from "@reduxjs/toolkit";
import PropTypes from 'prop-types';
import { nanoid } from 'nanoid';

export const AchievementType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  description: PropTypes.string
});

export const PaidItemType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  img: PropTypes.string.isRequired,
  orderId: PropTypes.string.isRequired,
  quantity: PropTypes.number.isRequired,
  purchaseDate: PropTypes.string.isRequired
});

export const UserType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  email: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  surname: PropTypes.string.isRequired,
  phone: PropTypes.string,
  description: PropTypes.string,
  role: PropTypes.oneOf(['user', 'admin']).isRequired,
  paidItems: PropTypes.arrayOf(PaidItemType),
  achievements: PropTypes.arrayOf(AchievementType),
  createdAt: PropTypes.string,
  lastLoginAt: PropTypes.string,
  publishedItems: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    description: PropTypes.string
  }))
});

const STORAGE_KEYS = {
  USERS: 'users',
  CURRENT_USER: 'currentUser',
  IS_AUTH: 'isAuth',
  THEME: 'theme',
  PUBLISHED_ITEMS: 'publishedItems'
};

const getFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage: ${error}`);
    return defaultValue;
  }
};

const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to localStorage: ${error}`);
  }
};

const defaultUser = {
  id: 1,
  email: 'admin@admin.com',
  password: 'admin',
  name: 'Администратор',
  surname: 'Админов',
  role: 'admin',
  publishedItems: [],
  paidItems: [],
  achievements: []
};

const initialState = {
  currentUser: null,
  users: getFromStorage(STORAGE_KEYS.USERS, []),
  isAuth: false,
  theme: 'dark',
  publishedItems: getFromStorage(STORAGE_KEYS.PUBLISHED_ITEMS, [])
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    register: (state, action) => {
      const newUser = {
        ...action.payload,
        id: nanoid(),
        role: 'user',
        paidItems: [],
        achievements: [],
        publishedItems: [],
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };

      state.users.push(newUser);
      state.currentUser = newUser;
      state.isAuth = true;

      saveToStorage(STORAGE_KEYS.USERS, state.users);
      saveToStorage(STORAGE_KEYS.CURRENT_USER, newUser);
      saveToStorage(STORAGE_KEYS.IS_AUTH, true);
    },

    login: (state, action) => {
      const { email, password } = action.payload;
      const user = state.users.find(u => u.email === email && u.password === password);

      if (user) {
        state.currentUser = {
          ...user,
          lastLoginAt: new Date().toISOString()
        };
        state.isAuth = true;

        saveToStorage(STORAGE_KEYS.CURRENT_USER, state.currentUser);
        saveToStorage(STORAGE_KEYS.IS_AUTH, true);
      }
    },

    logout: (state) => {
      state.isAuth = false;
      state.currentUser = null;
      
      saveToStorage(STORAGE_KEYS.CURRENT_USER, null);
      saveToStorage(STORAGE_KEYS.IS_AUTH, false);
    },

    toggleTheme: (state) => {
      state.theme = state.theme === "dark" ? "light" : "dark";
      saveToStorage(STORAGE_KEYS.THEME, state.theme);
    },

    updateProfile: (state, action) => {
      try {
        if (!state.users) {
          state.users = [];
        }

        const updatedUser = {
          ...state.currentUser,
          ...action.payload,
          updatedAt: new Date().toISOString()
        };

        state.currentUser = updatedUser;

        const userIndex = state.users.findIndex(u => u?.id === updatedUser.id);
        
        if (userIndex !== -1) {
          state.users[userIndex] = updatedUser;
        } else {
          state.users.push(updatedUser);
        }

        saveToStorage(STORAGE_KEYS.USERS, state.users);
        saveToStorage(STORAGE_KEYS.CURRENT_USER, state.currentUser);

      } catch (error) {
        console.error('Error in updateProfile reducer:', error);
      }
    },

    addPaidItems: (state, action) => {
      if (!state.currentUser) return;

      try {
        if (!state.currentUser.paidItems) {
          state.currentUser.paidItems = [];
        }

        const newPaidItems = action.payload.map(item => ({
          id: item.id,
          text: item.text,
          img: item.img,
          price: Number(item.price),
          quantity: Number(item.quantity) || 1,
          orderId: item.orderId || nanoid(),
          purchaseDate: item.purchaseDate || new Date().toISOString()
        }));

        state.currentUser.paidItems.unshift(...newPaidItems);

        if (!state.users) {
          state.users = [];
        }

        const userIndex = state.users.findIndex(u => u?.id === state.currentUser.id);
        
        if (userIndex !== -1) {
          state.users[userIndex] = {
            ...state.users[userIndex],
            paidItems: state.currentUser.paidItems
          };
        }

        saveToStorage(STORAGE_KEYS.USERS, state.users);
        saveToStorage(STORAGE_KEYS.CURRENT_USER, state.currentUser);

      } catch (error) {
        console.error('Error in addPaidItems reducer:', error);
        throw error;
      }
    },

    addAchievement: (state, action) => {
      if (!state.currentUser.achievements) {
        state.currentUser.achievements = [];
      }
      state.currentUser.achievements.push(action.payload);
      localStorage.setItem("profileState", JSON.stringify(state));
    },

    publishItem: (state, action) => {
      if (!state.currentUser) return;

      try {
        const newItem = {
          ...action.payload,
          isPublished: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        if (!state.currentUser.publishedItems) {
          state.currentUser.publishedItems = [];
        }

        state.currentUser.publishedItems.unshift(newItem);

        const userIndex = state.users.findIndex(u => u.id === state.currentUser.id);
        if (userIndex !== -1) {
          if (!state.users[userIndex].publishedItems) {
            state.users[userIndex].publishedItems = [];
          }
          state.users[userIndex].publishedItems = [...state.currentUser.publishedItems];
        }

        saveToStorage(STORAGE_KEYS.USERS, state.users);
        saveToStorage(STORAGE_KEYS.CURRENT_USER, state.currentUser);
        saveToStorage(STORAGE_KEYS.PUBLISHED_ITEMS, state.currentUser.publishedItems);

      } catch (error) {
        console.error('Error in publishItem reducer:', error);
        throw error;
      }
    },

    removePublishedItem: (state, action) => {
      if (!state.currentUser) return;

      const itemId = action.payload;
      state.currentUser.publishedItems = state.currentUser.publishedItems.filter(
        item => item.id !== itemId
      );

      const userIndex = state.users.findIndex(u => u.id === state.currentUser.id);
      if (userIndex !== -1) {
        state.users[userIndex] = {
          ...state.users[userIndex],
          publishedItems: state.currentUser.publishedItems
        };
      }

      saveToStorage(STORAGE_KEYS.USERS, state.users);
      saveToStorage(STORAGE_KEYS.CURRENT_USER, state.currentUser);
      saveToStorage(STORAGE_KEYS.PUBLISHED_ITEMS, state.currentUser.publishedItems);
    }
  }
});

export const { 
  register, 
  login, 
  logout, 
  toggleTheme, 
  updateProfile,
  addPaidItems,
  addAchievement,
  publishItem,
  removePublishedItem
} = profileSlice.actions;

export default profileSlice.reducer;