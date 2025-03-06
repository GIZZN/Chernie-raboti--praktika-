import { memo, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Header } from '../../components/Header/Header';
import { Footer } from '../../components/Footer/Footer';
import { removeFromFavorites } from './favoritesSlice';
import { addToCart } from '../Cart/cartSlice';
import { FavoriteItemType } from './favoritesSlice';
import s from './Favorites.module.css';

// Компонент для отображения пустого состояния
const EmptyState = memo(() => (
  <div className={s.emptyState}>
    <div className={s.emptyIcon} aria-hidden="true">♥</div>
    <p className={s.emptyText}>В избранном пока ничего нет</p>
    <Link to="/tovari" className={s.shopButton}>
      Перейти к товарам
    </Link>
  </div>
));

EmptyState.displayName = 'EmptyState';

// Компонент карточки избранного товара
const FavoriteCard = memo(({ 
  item, 
  onRemove, 
  onAddToCart, 
  isAuth 
}) => (
  <div className={s.card}>
    <RemoveButton onRemove={() => onRemove(item.id)} />
    <ProductImage item={item} />
    <ProductContent 
      item={item} 
      isAuth={isAuth} 
      onAddToCart={() => onAddToCart(item)} 
    />
  </div>
));

FavoriteCard.propTypes = {
  item: FavoriteItemType.isRequired,
  onRemove: PropTypes.func.isRequired,
  onAddToCart: PropTypes.func.isRequired,
  isAuth: PropTypes.bool.isRequired
};

FavoriteCard.displayName = 'FavoriteCard';

// Компонент кнопки удаления
const RemoveButton = memo(({ onRemove }) => (
  <button 
    className={s.removeButton}
    onClick={onRemove}
    aria-label="Удалить из избранного"
  >
    ×
  </button>
));

RemoveButton.propTypes = {
  onRemove: PropTypes.func.isRequired
};

// Компонент изображения товара
const ProductImage = memo(({ item }) => (
  <Link to={`/tovar/${item.id}`} className={s.imageLink}>
    <img src={item.img} alt={item.text} className={s.image} />
  </Link>
));

ProductImage.propTypes = {
  item: FavoriteItemType.isRequired
};

// Компонент контента товара
const ProductContent = memo(({ item, isAuth, onAddToCart }) => (
  <div className={s.content}>
    <Link to={`/tovar/${item.id}`} className={s.itemTitle}>
      {item.text}
      {item.isPublished && (
        <span className={s.publishedBadge} title="Опубликованный товар">
        </span>
      )}
    </Link>
    <div className={s.price}>{item.price} ₽</div>
    {isAuth && (
      <button 
        className={s.addToCartButton}
        onClick={onAddToCart}
        aria-label={`Добавить ${item.text} в корзину`}
      >
        В корзину
      </button>
    )}
  </div>
));

ProductContent.propTypes = {
  item: FavoriteItemType.isRequired,
  isAuth: PropTypes.bool.isRequired,
  onAddToCart: PropTypes.func.isRequired
};

// Основной компонент избранного
export const Favorites = memo(() => {
  const dispatch = useDispatch();
  
  // Селекторы
  const favorites = useSelector(state => state.favorites?.items || []);
  const allItems = useSelector(state => state.tovari || []);
  const prices = useSelector(state => state.cart?.prices || {});
  const isAuth = useSelector(state => state.profile?.isAuth || false);
  const users = useSelector(state => state.profile?.users || []);

  // Получение списка избранных товаров
  const favoriteItems = useMemo(() => {
    if (!Array.isArray(favorites)) {
      return [];
    }

    // Собираем все опубликованные товары пользователей
    const publishedItems = users.reduce((acc, user) => {
      if (user?.publishedItems) {
        return [...acc, ...user.publishedItems];
      }
      return acc;
    }, []);

    // Объединяем все доступные товары
    const allAvailableItems = [...allItems, ...publishedItems];

    return favorites
      .map(id => {
        // Ищем товар среди всех доступных товаров
        const item = allAvailableItems.find(item => item.id === id);
        if (!item) return null;
        
        return {
          ...item,
          price: prices[item.text] || item.price,
          isPublished: !!publishedItems.find(p => p.id === item.id)
        };
      })
      .filter(Boolean);
  }, [favorites, allItems, prices, users]);

  // Обработчики действий
  const handleRemoveFromFavorites = useCallback((id) => {
    try {
      dispatch(removeFromFavorites(id));
    } catch (error) {
      console.error('Ошибка при удалении из избранного:', error);
    }
  }, [dispatch]);

  const handleAddToCart = useCallback((item) => {
    try {
      if (!item?.id) return;
      
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
      <main className={s.container}>
        <h1 className={s.title}>Избранное</h1>
        {favoriteItems.length === 0 ? (
          <EmptyState />
        ) : (
          <div className={s.grid}>
            {favoriteItems.map(item => (
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