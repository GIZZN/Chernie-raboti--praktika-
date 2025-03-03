import { memo, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Header } from '../../components/Header/Header';
import { Footer } from '../../components/Footer/Footer';
import { removeFromFavorites } from './favoritesSlice';
import { addToCart } from '../Cart/cartSlice';
import { FavoriteItemType } from './favoritesSlice';
import styles from './Favorites.module.css';

const EmptyState = memo(() => (
  <div className={styles.emptyState}>
    <div className={styles.emptyIcon}>♥</div>
    <p className={styles.emptyText}>В избранном пока ничего нет</p>
    <Link to="/tovari" className={styles.shopButton}>
      Перейти к товарам
    </Link>
  </div>
));

const FavoriteCard = memo(({ item, onRemove, onAddToCart, isAuth }) => (
  <div className={styles.card}>
    <button 
      className={styles.removeButton}
      onClick={() => onRemove(item.id)}
      aria-label="Удалить из избранного"
    >
      ×
    </button>
    <Link to={`/tovar/${item.id}`} className={styles.imageLink}>
      <img src={item.img} alt={item.text} className={styles.image} />
    </Link>
    <div className={styles.content}>
      <Link to={`/tovar/${item.id}`} className={styles.itemTitle}>
        {item.text}
      </Link>
      <div className={styles.price}>{item.price} ₽</div>
      {isAuth && (
        <button 
          className={styles.addToCartButton}
          onClick={() => onAddToCart(item)}
        >
          В корзину
        </button>
      )}
    </div>
  </div>
));

FavoriteCard.propTypes = {
  item: FavoriteItemType.isRequired,
  onRemove: PropTypes.func.isRequired,
  onAddToCart: PropTypes.func.isRequired,
  isAuth: PropTypes.bool.isRequired
};

export const Favorites = memo(() => {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites?.items || []);
  const allItems = useSelector((state) => state.tovari || []);
  const prices = useSelector((state) => state.cart?.prices || {});
  const isAuth = useSelector((state) => state.profile?.isAuth || false);

  const favoriteItems = useMemo(() => {
    if (!Array.isArray(favorites) || !Array.isArray(allItems)) {
      return [];
    }
    const publishedItems = JSON.parse(localStorage.getItem('publishedItems') || '[]');
    const allAvailableItems = [...allItems, ...publishedItems];
    return favorites
      .map(id => {
        const item = allAvailableItems.find(item => item.id === id);
        if (!item) return null;
        
        return {
          ...item,
          price: prices[item.text] || item.price
        };
      })
      .filter(Boolean);
  }, [favorites, allItems, prices]);

  const handleRemoveFromFavorites = useCallback((id) => {
    try {
      dispatch(removeFromFavorites(id));
    } catch (error) {
      console.error('Ошибка при удалении из избранного:', error);
    }
  }, [dispatch]);

  const handleAddToCart = useCallback((item) => {
    try {
      if (!item || !item.id) return;
      
      dispatch(addToCart({ 
        id: item.id, 
        text: item.text, 
        img: item.img,
        price: item.price,
        quantity: 1
      }));
    } catch (error) {
      console.error('Ошибка при добавлении в корзину:', error);
    }
  }, [dispatch]);

  return (
    <>
      <Header />
      <main className={styles.container}>
        <h1 className={styles.title}>Избранное</h1>
        {favoriteItems.length === 0 ? (
          <EmptyState />
        ) : (
          <div className={styles.grid}>
            {favoriteItems.map((item) => (
              item && (
                <FavoriteCard
                  key={item.id}
                  item={item}
                  onRemove={handleRemoveFromFavorites}
                  onAddToCart={handleAddToCart}
                  isAuth={isAuth}
                />
              )
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
});

Favorites.displayName = 'Favorites'; 