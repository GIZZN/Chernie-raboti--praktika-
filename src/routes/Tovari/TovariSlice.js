import { createSlice } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";
import PropTypes from 'prop-types';
import screwdriver from "../../assets/screwdriver.png";
import Hammer from "../../assets/Hammer.png";
import bolgarka from "../../assets/bolgarka.png";
import Drill from "../../assets/Drill.png";
import ceMENT from "../../assets/ceMENT.png";
import Kirpichi from "../../assets/Kirpichi.png";
import PaletBlockovRoblox from "../../assets/PaletBlockovRoblox.png";
import pasxalka52 from "../../assets/pasxalka52.png";
import Plitka from "../../assets/Plitka.png";
import PlitkaItalian from "../../assets/PlitkaItalian.png";

import info1 from "../../assets/info1.png";
import info2 from "../../assets/info2.png";
import info3 from "../../assets/info3.png";
import info4 from "../../assets/info4.png";
import info5 from "../../assets/info5.png";
import info6 from "../../assets/info6.png";
import info7 from "../../assets/info7.png";
import info8 from "../../assets/info8.png";
import info9 from "../../assets/info9.png";
import info10 from "../../assets/info10.png";

export const ReviewType = PropTypes.shape({
  rating: PropTypes.number.isRequired,
  comment: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  userId: PropTypes.number.isRequired
});

export const SpecificationType = PropTypes.shape({
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired
});

export const ProductType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  img: PropTypes.string.isRequired,
  detailImg: PropTypes.string,
  isWholesale: PropTypes.bool,
  description: PropTypes.string,
  specifications: PropTypes.arrayOf(SpecificationType),
  reviews: PropTypes.arrayOf(ReviewType),
  averageRating: PropTypes.number,
  isFavorite: PropTypes.bool,
  inCart: PropTypes.bool,
  category: PropTypes.string,
  createdAt: PropTypes.string,
  updatedAt: PropTypes.string,
  isPublished: PropTypes.bool,
  publishedBy: PropTypes.string
});

const STORAGE_KEYS = {
  TOVARI: 'tovari',
  PRICES: 'prices',
  PUBLISHED_ITEMS: 'publishedItems'
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

export const CATEGORIES = {
  TECH: 'Техника',
  TOOLS: 'Инструменты',
  MATERIALS: 'Материалы',
  PEOPLE: 'Люди'
};

const DEFAULT_PRODUCTS = [
  {
    id: nanoid(),
    text: "Отвертка",
    basePrice: 1900,
    img: screwdriver,
    detailImg: info1,
    isWholesale: false,
    category: CATEGORIES.TOOLS,
    description: "Профессиональная отвертка с магнитным наконечником. Эргономичная рукоятка обеспечивает надежный захват и комфорт при работе. Идеально подходит для точных работ с мелкими винтами.",
    specifications: {
      "Тип": "Крестовая PH2",
      "Материал рукоятки": "Двухкомпонентный пластик",
      "Длина стержня": "150 мм",
      "Диаметр стержня": "6 мм",
      "Намагниченный наконечник": "Да",
      "Страна производитель": "Россия"
    },
    reviews: [],
    averageRating: 0,
    isFavorite: false,
    inCart: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: nanoid(),
    text: "Молоток",
    basePrice: 2500,
    img: Hammer,
    detailImg: info2,
    isWholesale: false,
    category: CATEGORIES.TOOLS,
    description: "Профессиональный слесарный молоток с обрезиненной рукояткой. Головка из высококачественной стали обеспечивает максимальную прочность и долговечность. Идеален для общестроительных работ.",
    specifications: {
      "Вес бойка": "500 г",
      "Материал рукоятки": "Фибергласс с резиновым покрытием",
      "Общая длина": "320 мм",
      "Материал бойка": "Углеродистая сталь",
      "Тип": "Слесарный",
      "Антивибрационная система": "Да"
    },
    reviews: [],
    averageRating: 0,
    isFavorite: false,
    inCart: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: nanoid(),
    text: "Болгарка",
    basePrice: 0,
    img: bolgarka,
    detailImg: info3,
    isWholesale: false,
    category: CATEGORIES.TECH,
    description: "Мощная угловая шлифмашина для профессионального использования. Оснащена системой плавного пуска и защитой от перегрева. Подходит для резки, шлифовки и зачистки металла, камня и других материалов.",
    specifications: {
      "Мощность": "2400 Вт",
      "Диаметр диска": "125 мм",
      "Число оборотов": "11000 об/мин",
      "Плавный пуск": "Да",
      "Защита от перегрузки": "Да",
      "Вес": "2.5 кг",
      "Гарантия": "2 года"
    },
    reviews: [],
    averageRating: 0,
    isFavorite: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: nanoid(),
    text: "Дрель",
    basePrice: 0,
    img: Drill,
    detailImg: info4,
    isWholesale: false,
    category: CATEGORIES.TOOLS,
    description: "Профессиональная ударная дрель с регулировкой скорости и реверсом. Мощный двигатель и надежный патрон обеспечивают точное сверление в различных материалах. Комплектуется дополнительной рукояткой и ограничителем глубины.",
    specifications: {
      "Мощность": "1200 Вт",
      "Тип патрона": "Быстрозажимной",
      "Диаметр патрона": "13 мм",
      "Число скоростей": "2",
      "Реверс": "Да",
      "Максимальный диаметр сверления (Металл)": "13 мм",
      "Максимальный диаметр сверления (Дерево)": "40 мм",
      "Максимальный диаметр сверления (Бетон)": "16 мм"
    },
    reviews: [],
    averageRating: 0,
    isFavorite: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: nanoid(),
    text: "Цемент",
    basePrice: 0,
    img: ceMENT,
    detailImg: info5,
    isWholesale: true,
    category: CATEGORIES.MATERIALS,
    description: "Портландцемент, применяемый в строительстве для создания прочных бетонных и строительных конструкций.",
    reviews: [],
    averageRating: 0,
    isFavorite: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: nanoid(),
    text: "Цемент 52",
    basePrice: 0,
    img: pasxalka52,
    detailImg: info6,
    isWholesale: true,
    category: CATEGORIES.MATERIALS,
    description: "Цемент марки 52,5, идеален для строительства объектов, требующих повышенной прочности и устойчивости к внешним воздействиям.",
    reviews: [],
    averageRating: 0,
    isFavorite: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: nanoid(),
    text: "Палет Кирпичей",
    basePrice: 0,
    img: PaletBlockovRoblox,
    detailImg: info7,
    isWholesale: true,
    category: CATEGORIES.MATERIALS,
    description: "Палет с кирпичами, предназначенный для крупномасштабных строительных работ, с гарантией высокого качества.",
    reviews: [],
    averageRating: 0,
    isFavorite: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: nanoid(),
    text: "Кирпичи",
    basePrice: 0,
    img: Kirpichi,
    detailImg: info8,
    isWholesale: true,
    category: CATEGORIES.MATERIALS,
    description: "Красные строительные кирпичи стандартного размера для возведения стен и других строительных объектов.",
    reviews: [],
    averageRating: 0,
    isFavorite: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: nanoid(),
    text: "Плитка",
    basePrice: 0,
    img: Plitka,
    detailImg: info9,
    isWholesale: true,
    category: CATEGORIES.MATERIALS,
    description: "Керамическая плитка для внутренней отделки, имеет высокую прочность и стойкость к загрязнениям и износу.",
    reviews: [],
    averageRating: 0,
    isFavorite: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: nanoid(),
    text: "Плитка Итальянская",
    basePrice: 0,
    img: PlitkaItalian,
    detailImg: info10,
    isWholesale: true,
    category: CATEGORIES.MATERIALS,
    description: "Итальянская керамическая плитка премиум-класса, отличающаяся элегантным дизайном и долговечностью. Идеально подходит для отделки пола и стен.",
    reviews: [],
    averageRating: 0,
    isFavorite: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
];

const normalizeProduct = (product, prices) => ({
  ...product,
  price: prices[product.text] || product.basePrice,
  inCart: false,
  isFavorite: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

const initialState = (() => {
  const storedTovari = getFromStorage(STORAGE_KEYS.TOVARI, []);
  
  const uniqueItems = new Map();
  
  storedTovari.forEach(item => {
    if (!item.isPublished) {
      uniqueItems.set(item.id, {
        ...item,
        price: Number(item.price) || 0
      });
    }
  });

  return Array.from(uniqueItems.values());
})();

const calculateAverageRating = (reviews) => {
  if (!reviews?.length) return 0;
  return reviews.reduce((acc, { rating }) => acc + rating, 0) / reviews.length;
};

const TovariSlice = createSlice({
  name: "tovari",
  initialState,
  reducers: {
    add: (state) => {
      if (state.length > 0) return state;

      const prices = getFromStorage(STORAGE_KEYS.PRICES, {});
      const products = DEFAULT_PRODUCTS.map(product => 
        normalizeProduct(product, prices)
      );
      
      saveToStorage(STORAGE_KEYS.TOVARI, products);
      return products;
    },

    setProducts: (state, action) => {
      const newProducts = action.payload.map(product => product.toJSON());
      return [...state, ...newProducts];
    },

    addToFavorites: (state, { payload: id }) => {
      const item = state.find(item => item.id === id);
      if (item) {
        item.isFavorite = !item.isFavorite;
        item.updatedAt = new Date().toISOString();
        saveToStorage(STORAGE_KEYS.TOVARI, state);
      }
    },

    updateRating: (state, { payload }) => {
      const { id, rating, comment } = payload;
      const item = state.find(item => item.id === id);
      if (item) {
        item.reviews.push({ 
          rating, 
          comment, 
          date: new Date().toISOString(),
          userId: 1
        });
        item.averageRating = calculateAverageRating(item.reviews);
        item.updatedAt = new Date().toISOString();
        saveToStorage(STORAGE_KEYS.TOVARI, state);
      }
    },

    sortByPrice: (state, { payload: direction }) => {
      return state.sort((a, b) => 
        direction === 'asc' ? a.price - b.price : b.price - a.price
      );
    },

    filterByCategory: (state, { payload: category }) => 
      state.filter(item => item.category === category),

    publishNewItem: (state, action) => {
      const { title, price, description, category, images, specifications, userId } = action.payload;
      const newItem = {
        id: nanoid(),
        text: title,
        price: Number(price),
        img: images[0],
        detailImg: images[0],
        description,
        category,
        specifications,
        isWholesale: false,
        reviews: [],
        averageRating: 0,
        isFavorite: false,
        inCart: false,
        userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      state.push(newItem);
      saveToStorage(STORAGE_KEYS.TOVARI, state);
    },

    addToCart: (state, { payload: id }) => {
      const item = state.find(item => item.id === id);
      if (item && !item.inCart) {
        item.inCart = true;
        item.updatedAt = new Date().toISOString();
        saveToStorage(STORAGE_KEYS.TOVARI, state);
      }
    },

    removeFromCart: (state, { payload: id }) => {
      const item = state.find(item => item.id === id);
      if (item) {
        item.inCart = false;
        item.updatedAt = new Date().toISOString();
        saveToStorage(STORAGE_KEYS.TOVARI, state);
      }
    },

    purchaseItems: (state) => {
      const purchasedItems = state.filter(item => item.inCart);
      state.forEach(item => {
        if (item.inCart) {
          item.inCart = false;
          item.updatedAt = new Date().toISOString();
        }
      });
      saveToStorage(STORAGE_KEYS.TOVARI, state);
      return purchasedItems;
    },

    removePublishedItem: (state, action) => {
      return state.filter(item => item.id !== action.payload);
    },

    updateTovari: (state) => {
      const storedTovari = getFromStorage(STORAGE_KEYS.TOVARI, []);
      const uniqueItems = new Map();
      
      // базовые товары сохран 
      storedTovari.forEach(item => {
        if (!item.isPublished) {
          uniqueItems.set(item.id, {
            ...item,
            price: Number(item.price) || 0
          });
        }
      });

      return Array.from(uniqueItems.values());
    },

    categorizeItems: (state, action) => {
      const categories = {
        'Техника': [],
        'Инструменты': [],
        'Материалы': [],
        'Люди': []
      };
      
      state.forEach(item => {
        if (item.isPublished && categories.hasOwnProperty(item.category)) {
          categories[item.category].push(item);
        }
      });
      
      return state;
    }
  }
});

export const { 
  add, 
  addToFavorites, 
  updateRating, 
  sortByPrice, 
  filterByCategory,
  publishNewItem,
  addToCart,
  removeFromCart,
  purchaseItems,
  removePublishedItem,
  updateTovari,
  setProducts,
  categorizeItems
} = TovariSlice.actions;

export default TovariSlice.reducer;
