import { useEffect, useRef, memo, useCallback, useMemo, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import PropTypes from 'prop-types';
import { add, updateTovari, setProducts, CATEGORIES } from "./TovariSlice";
import s from "./Tovari.module.css";
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";
import { Tovar } from "../../components/Tovar/Tovar";
import { createSelector } from 'reselect';
import { ApiService } from '../../services/ApiService';
import { StorageService } from '../../services/StorageService';
import { setSelectedCategory, clearSelectedCategory } from './categorySlice';

const api = new ApiService();
const storage = new StorageService();

const TovarItemType = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  text: PropTypes.string.isRequired,
  img: PropTypes.string.isRequired,
  price: PropTypes.number,
  category: PropTypes.string
});

const ProductList = memo(({ items }) => (
  <div className={s.items}>
    {items.map((item) => (
      <div className={s.item} key={item.id}>
        <Tovar
          id={item.id}
          text={item.text}
          img={item.img}
          price={item.price}
        />
      </div>
    ))}
  </div>
));

ProductList.propTypes = {
  items: PropTypes.arrayOf(TovarItemType).isRequired
};

const Section = memo(({ title, children, lineRef }) => (
  <>
    <div className={s.line} ref={lineRef} />
    <h2 className={s.title}>{title}</h2>
    {children}
  </>
));

const CategoryIcon = memo(({ category }) => {
  switch (category) {
    case 'Техника':
      return (
        <svg className={s.categoryIcon} viewBox="0 0 24 24" fill="none">
          <path d="M21 16V8C21 6.89543 20.1046 6 19 6H5C3.89543 6 3 6.89543 3 8V16C3 17.1046 3.89543 18 5 18H19C20.1046 18 21 17.1046 21 16Z" 
            stroke="currentColor" strokeWidth="2"/>
          <path d="M7 10H17M7 14H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      );
    case 'Инструменты':
      return (
        <svg className={s.categoryIcon} viewBox="0 0 24 24" fill="none">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" 
            stroke="currentColor" strokeWidth="2"/>
        </svg>
      );
    case 'Материалы':
      return (
        <svg className={s.categoryIcon} viewBox="0 0 24 24" fill="none">
          <path d="M4 7V17C4 19.2091 5.79086 21 8 21H16C18.2091 21 20 19.2091 20 17V7M4 7H20M4 7L6 3H18L20 7" 
            stroke="currentColor" strokeWidth="2"/>
        </svg>
      );
    case 'Люди':
      return (
        <svg className={s.categoryIcon} viewBox="0 0 24 24" fill="none">
          <path d="M12 4a4 4 0 100 8 4 4 0 000-8zM6 20v-2a4 4 0 014-4h4a4 4 0 014 4v2" 
            stroke="currentColor" strokeWidth="2"/>
          <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
        </svg>
      );
    default:
      return null;
  }
});

const CategoryCard = memo(({ category, items, onSelect, isExpanded }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showContent, setShowContent] = useState(false);
  
  useEffect(() => {
    if (isExpanded) {
      setIsAnimating(true);
      
      setTimeout(() => {
        setShowContent(true);
        
        setTimeout(() => {
          setIsAnimating(false);
        }, 900);
      }, 300);
    } else {
      setShowContent(false);
      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
    }
  }, [isExpanded]);

  const handleClick = useCallback(() => {
    if (!isAnimating) {
      onSelect(category);
    }
  }, [category, onSelect, isAnimating]);

  return (
    <>
      <div 
        className={`${s.categoryCard} ${isExpanded ? s.expanded : ''}`}
        onClick={handleClick}
      >
        <div className={s.categoryBackground}>
          <div className={s.categoryOverlay} />
          <CategoryIcon category={category} />
        </div>
        <div className={s.categoryContent}>
          <h3 className={s.categoryTitle}>{category}</h3>
          <span className={s.itemCount}>{items.length} товаров</span>
        </div>
      </div>
      {isExpanded && (
        <div className={`${s.expandedItems} ${showContent ? s.visible : ''}`}>
          {items.map((item, index) => (
            <div key={item.id} className={s.item}>
              <Tovar {...item} />
            </div>
          ))}
        </div>
      )}
    </>
  );
});

const selectTovari = state => state.tovari;
const selectPrices = state => state.cart.prices;
const selectUsers = state => state.profile.users;

const selectPublishedItems = createSelector(
  [selectUsers],
  users => users.reduce((acc, user) => {
    if (user?.publishedItems) {
      return [...acc, ...user.publishedItems];
    }
    return acc;
  }, [])
);

const selectCategorizedItems = createSelector(
  [selectPublishedItems, selectPrices],
  (items, prices) => {
    const categories = {
      [CATEGORIES.TECH]: [],
      [CATEGORIES.TOOLS]: [],
      [CATEGORIES.MATERIALS]: [],
      [CATEGORIES.PEOPLE]: []
    };
    
    items.forEach(item => {
      if (item.isPublished && categories.hasOwnProperty(item.category)) {
        categories[item.category].push({
          ...item,
          price: prices[item.text] || item.price
        });
      }
    });
    
    return categories;
  }
);

export const Tovari = memo(() => {
  const dispatch = useDispatch();
  const allItems = useSelector(selectTovari);
  const categorizedItems = useSelector(selectCategorizedItems);
  const lineRefs = useRef([]);
  const mountedRef = useRef(false);
  const selectedCategory = useSelector(state => state.categories.selectedCategory);

  const handleCategorySelect = useCallback((category) => {
    if (selectedCategory === category) {
      dispatch(clearSelectedCategory());
    } else {
      dispatch(setSelectedCategory(category));
    }
  }, [selectedCategory, dispatch]);

  const setLineRef = useCallback((index) => (el) => {
    lineRefs.current[index] = el;
  }, []);

  useEffect(() => {
    if (!mountedRef.current) {
      dispatch(add());
      mountedRef.current = true;
    }
  }, [dispatch]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('line-animate');
        }
      }),
      { threshold: 0.1, rootMargin: '50px' }
    );

    lineRefs.current.forEach(line => line && observer.observe(line));
    return () => observer.disconnect();
  }, []);

  const { regularItems, wholesaleItems } = useMemo(() => {
    const available = allItems.filter(item => !item.isPublished);
    return {
      regularItems: available.filter(item => !item.isWholesale),
      wholesaleItems: available.filter(item => item.isWholesale)
    };
  }, [allItems]);

  return (
    <>
      <Header />
      <main className={s.main}>
        <Section title="Мини маркет плейс" lineRef={setLineRef(3)}>
          <div className={s.categoriesGrid}>
            {Object.entries(categorizedItems).map(([category, items]) => (
              <div 
                key={category} 
                className={`${s.categoryWrapper} ${selectedCategory === category ? s.expanded : ''}`}
              >  
                <CategoryCard
                  category={category}
                  items={items}
                  onSelect={handleCategorySelect}
                  isExpanded={selectedCategory === category}
                />
              </div>
            ))}
          </div>
        </Section>
        <Section title="Наши товары" lineRef={setLineRef(0)}>
          <ProductList items={regularItems} />
        </Section>
        <Section title="Товары оптом" lineRef={setLineRef(1)}>
          <ProductList items={wholesaleItems} />
        </Section>
        <div className={s.line} ref={setLineRef(2)} />
      </main>
      <Footer />
    </>
  );
});

Tovari.displayName = 'Tovari';