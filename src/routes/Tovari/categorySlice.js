import { createSlice, createSelector } from '@reduxjs/toolkit';
import { StorageService } from '../../services/StorageService';

const storage = new StorageService();

const initialState = {
  selectedCategory: null,
  categories: {
    'Техника': [],
    'Инструменты': [],
    'Материалы': [],
    'Люди': []
  },
  isLoading: false,
  error: null,
  filters: {
    sortBy: null,
    priceRange: { min: 0, max: Infinity },
    searchTerm: ''
  }
};

export const selectFilteredCategoryItems = createSelector(
  [
    state => state.categories.categories,
    state => state.categories.selectedCategory,
    state => state.categories.filters
  ],
  (categories, selectedCategory, filters) => {
    if (!selectedCategory) return categories;
    
    let items = categories[selectedCategory];
    
    if (filters.searchTerm) {
      items = items.filter(item => 
        item.text.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }
    
    if (filters.sortBy === 'price') {
      items = [...items].sort((a, b) => a.price - b.price);
    }
    
    return items.filter(item => 
      item.price >= filters.priceRange.min && 
      item.price <= filters.priceRange.max
    );
  }
);

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
      storage.setItem('selectedCategory', action.payload);
    },
    setCategoryItems: (state, action) => {
      const { category, items } = action.payload;
      state.categories[category] = items;
      storage.setItem('categoryItems', state.categories);
    },
    clearSelectedCategory: (state) => {
      state.selectedCategory = null;
      storage.removeItem('selectedCategory');
    },
    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { 
  setSelectedCategory, 
  setCategoryItems, 
  clearSelectedCategory,
  setFilter,
  clearFilters,
  setLoading,
  setError
} = categorySlice.actions;

export default categorySlice.reducer; 