import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  header: {
    isFixed: false,
    height: 0
  },
  modal: {
    isOpen: false,
    type: null,
    data: null
  },
  grid: {
    columns: window.innerWidth > 768 ? 4 : 2,
    gap: 20
  },
  theme: localStorage.getItem('theme') || 'dark'
};

const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    setHeaderFixed: (state, action) => {
      state.header.isFixed = action.payload;
    },
    setHeaderHeight: (state, action) => {
      state.header.height = action.payload;
    },
    openModal: (state, action) => {
      state.modal = { ...state.modal, isOpen: true, ...action.payload };
    },
    closeModal: (state) => {
      state.modal = { ...initialState.modal };
    },
    updateGridLayout: (state, action) => {
      state.grid = { ...state.grid, ...action.payload };
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', state.theme);
    }
  }
});

export const {
  setHeaderFixed,
  setHeaderHeight,
  openModal,
  closeModal,
  updateGridLayout,
  toggleTheme
} = layoutSlice.actions;

export default layoutSlice.reducer; 