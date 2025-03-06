import { useEffect, useState, useRef, memo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';
import { Header } from '../../components/Header/Header';
import { Footer } from '../../components/Footer/Footer';
import { Tovar } from '../../components/Tovar/Tovar';
import { PageType } from './pagesSlice';
import styles from './SearchResults.module.css';

const sanitizeSearchQuery = (query) => {
  if (typeof query !== 'string') return '';
  return DOMPurify.sanitize(query
    .replace(/[<>]/g, '')
    .replace(/['";]/g, '')
    .replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
    .trim()
  );
};

const validateSearchResults = (items) => {
  return Array.isArray(items) && items.every(item => 
    item && typeof item === 'object' && 
    typeof item.id !== 'undefined'
  );
};

const SpecificationType = PropTypes.oneOfType([
  PropTypes.object,
  PropTypes.array
]);

// Компоненты
const SearchLoader = memo(() => (
  <div className={styles.loader}>Поиск...</div>
));

const NoResults = memo(({ onBackClick }) => (
  <div className={styles.noResults}>
    <p className={styles.error}>Ничего не найдено</p>
    <button 
      className={styles.backButton}
      onClick={onBackClick}
    >
      Вернуться к товарам
    </button>
  </div>
));

NoResults.propTypes = {
  onBackClick: PropTypes.func.isRequired
};

const PageResults = memo(({ pages, onPageClick }) => (
  <div className={styles.pages}>
    <h2>Найденные страницы:</h2>
    {pages.map(page => (
      <div key={page.id} className={styles.pageItem}>
        <button 
          className={`${styles.pageButton} ${styles.item}`}
          onClick={() => onPageClick(page)}
        >
          {page.title}
        </button>
      </div>
    ))}
  </div>
));

PageResults.propTypes = {
  pages: PropTypes.arrayOf(PageType).isRequired,
  onPageClick: PropTypes.func.isRequired
};

const ProductResults = memo(({ items }) => (
  <div className={styles.items}>
    {items.map(item => (
      <div className={styles.item} key={item.id}>
        <Tovar {...item} />
      </div>
    ))}
  </div>
));

ProductResults.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      text: PropTypes.string.isRequired,
      img: PropTypes.string.isRequired,
      price: PropTypes.number,
      specifications: SpecificationType,
      description: PropTypes.string
    })
  ).isRequired
};

const useLineAnimation = (refs, dependencies) => {
  useEffect(() => {
    refs.current.forEach((line) => {
      if (line) {
        line.classList.add('line-animate');
      }
    });
  }, dependencies);
};

export const SearchResults = memo(() => {
  const { query } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const allItems = useSelector((state) => state.tovari || []);
  const allPages = useSelector((state) => state.pages || []);
  const [foundItems, setFoundItems] = useState([]);
  const [foundPages, setFoundPages] = useState([]);
  const lineRefs = useRef([]);

  useEffect(() => {
    let isMounted = true;

    const performSearch = async () => {
      if (!query) return;

      try {
        setLoading(true);
        const searchQuery = query.toLowerCase().trim();
        const redirects = {
          'главная': '/',
          'home': '/',
          'товар': '/tovari',
          'товары': '/tovari',
          'профиль': '/profile',
          'личный кабинет': '/profile',
          'аккаунт': '/profile',
          'акк': '/profile',
          'избранное': '/favorites',
          'избранные': '/favorites',
          'закладки': '/favorites'
        };

        for (const [keyword, path] of Object.entries(redirects)) {
          if (searchQuery === keyword) {
            navigate(path);
            return;
          }
        }

        const sanitizedSearchQuery = sanitizeSearchQuery(query);
        
        if (!sanitizedSearchQuery) {
          if (isMounted) {
            setError('Недопустимый поисковый запрос');
            setLoading(false);
          }
          return;
        }

        const itemResults = allItems.filter(item => 
          item.text.toLowerCase().includes(sanitizedSearchQuery.toLowerCase()) ||
          (item.description && item.description.toLowerCase().includes(sanitizedSearchQuery.toLowerCase()))
        );

        const pageResults = allPages.filter(page => 
          page.title.toLowerCase().includes(sanitizedSearchQuery.toLowerCase()) ||
          (page.content && page.content.toLowerCase().includes(sanitizedSearchQuery.toLowerCase()))
        );

        if (!validateSearchResults(itemResults) || !validateSearchResults(pageResults)) {
          if (isMounted) {
            setError('Ошибка при обработке результатов');
            setLoading(false);
          }
          return;
        }

        if (isMounted) {
          setFoundItems(itemResults);
          setFoundPages(pageResults);
          setError(null);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError('Произошла ошибка при поиске');
          console.error('Search error:', err);
          setLoading(false);
        }
      }
    };

    performSearch();

    return () => {
      isMounted = false;
    };
  }, [query, allItems, allPages, navigate]);

  useLineAnimation(lineRefs, [foundItems, foundPages]);

  const handleBackClick = useCallback(() => {
    navigate('/tovari');
  }, [navigate]);

  const handlePageClick = useCallback((page) => {
    navigate(page.path);
  }, [navigate]);

  return (
    <main className={styles.main}>
      <Header />
      {loading ? (
        <SearchLoader />
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : (
        <>
          <h1 className={styles.title}>
            Результаты поиска: {DOMPurify.sanitize(query)}
          </h1>
          <div className={styles.line} ref={el => lineRefs.current[0] = el} />
          
          {foundPages.length > 0 && (
            <PageResults 
              pages={foundPages} 
              onPageClick={handlePageClick}
            />
          )}

          {foundItems.length > 0 && (
            <ProductResults items={foundItems} />
          )}

          {foundItems.length === 0 && foundPages.length === 0 && (
            <NoResults onBackClick={handleBackClick} />
          )}
          
          <div className={styles.line} ref={el => lineRefs.current[1] = el} />
        </>
      )}
      <Footer />
    </main>
  );
});

SearchResults.displayName = 'SearchResults';