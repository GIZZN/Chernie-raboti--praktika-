import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  lineRefs: [],
  isDropdownOpen: false,
  searchQuery: '',
  animations: {
    isAnimating: false,
    showContent: false
  },
  intersectionObserver: {
    elements: [],
    options: { threshold: 0.1, rootMargin: '50px' }
  }
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLineRef: (state, action) => {
      const { index, ref } = action.payload;
      state.lineRefs[index] = ref;
    },
    toggleDropdown: (state) => {
      state.isDropdownOpen = !state.isDropdownOpen;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setAnimationState: (state, action) => {
      state.animations = { ...state.animations, ...action.payload };
    },
    addIntersectionElement: (state, action) => {
      state.intersectionObserver.elements.push(action.payload);
    },
    clearIntersectionElements: (state) => {
      state.intersectionObserver.elements = [];
    }
  }
});

export const {
  setLineRef,
  toggleDropdown,
  setSearchQuery,
  setAnimationState,
  addIntersectionElement,
  clearIntersectionElements
} = uiSlice.actions;

export default uiSlice.reducer; 