import { createSlice } from '@reduxjs/toolkit';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';

export const PageType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  keywords: PropTypes.arrayOf(PropTypes.string).isRequired,
  createdAt: PropTypes.string,
  updatedAt: PropTypes.string
});

const STORAGE_KEYS = Object.freeze({
  PAGES: 'pages',
  SEARCH_HISTORY: 'searchHistory'
});


const validateData = (data) => {
  if (!data || typeof data !== 'object') return false;
  const allowedFields = ['id', 'title', 'content', 'path', 'keywords'];
  return Object.keys(data).every(key => allowedFields.includes(key));
};

const getFromStorage = (key, defaultValue = []) => {
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

const initialState = getFromStorage(STORAGE_KEYS.PAGES, [
  { 
    id: 1, 
    title: 'О нас', 
    content: 'Информация о компании',
    path: '/about',
    keywords: ['компания', 'информация', 'о нас']
  },
  { 
    id: 2, 
    title: 'Контакты', 
    content: 'Как с нами связаться',
    path: '/contacts',
    keywords: ['контакты', 'связь', 'телефон', 'email']
  },
]);

const pagesSlice = createSlice({
  name: 'pages',
  initialState,
  reducers: {
    addPage: (state, action) => {
      const sanitizedData = {
        title: sanitizeInput(action.payload.title),
        content: sanitizeInput(action.payload.content),
        path: sanitizeInput(action.payload.path),
        keywords: Array.isArray(action.payload.keywords) 
          ? action.payload.keywords.map(sanitizeInput)
          : []
      };

      if (!validateData(sanitizedData)) return;

      const newPage = {
        id: state.length + 1,
        ...sanitizedData
      };
      
      state.push(newPage);
      saveToStorage(STORAGE_KEYS.PAGES, state);
    },

    updatePage: (state, action) => {
      const { id, ...updates } = action.payload;
      
      const sanitizedData = {
        title: updates.title ? sanitizeInput(updates.title) : undefined,
        content: updates.content ? sanitizeInput(updates.content) : undefined,
        path: updates.path ? sanitizeInput(updates.path) : undefined,
        keywords: Array.isArray(updates.keywords) 
          ? updates.keywords.map(sanitizeInput)
          : undefined
      };

      if (!validateData(sanitizedData)) return;

      const page = state.find(p => p.id === id);
      if (page) {
        Object.assign(page, sanitizedData);
        saveToStorage(STORAGE_KEYS.PAGES, state);
      }
    },

    deletePage: (state, action) => {
      const id = parseInt(sanitizeInput(action.payload.toString()), 10);
      if (isNaN(id)) return;

      const index = state.findIndex(p => p.id === id);
      if (index !== -1) {
        state.splice(index, 1);
        saveToStorage(STORAGE_KEYS.PAGES, state);
      }
    }
  }
});

export const { addPage, updatePage, deletePage } = pagesSlice.actions;
export default pagesSlice.reducer;



const validateSearchResults = (items) => {
  return Array.isArray(items) && items.every(item => 
    item && typeof item === 'object' && 
    typeof item.id !== 'undefined'
  );
};