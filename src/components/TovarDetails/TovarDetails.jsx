import React, { useEffect, useState, useCallback, memo, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from 'prop-types';
import { addToCart, CartItemType } from "../../routes/Cart/cartSlice.js";
import { addToFavorites } from "../../routes/Favorites/favoritesSlice";
import { Header } from '../Header/Header';
import { Footer } from '../Footer/Footer';
import s from "./TovarDetails.module.css";
import { ProductType } from '../../routes/Tovari/TovariSlice';
import { createSelector } from '@reduxjs/toolkit';

const ReviewStars = memo(({ rating, onRatingChange }) => (
  <div className={s.ratingStars}>
    {[5, 4, 3, 2, 1].map((star) => (
      <span
        key={star}
        className={star <= rating ? s.starActive : s.star}
        onClick={() => onRatingChange(star)}
      >
        ★
      </span>
    ))}
  </div>
));

ReviewStars.propTypes = {
  rating: PropTypes.number.isRequired,
  onRatingChange: PropTypes.func.isRequired
};

ReviewStars.displayName = 'ReviewStars';

const ReviewForm = memo(({ rating, review, onRatingChange, onReviewChange, onSubmit }) => (
  <form className={s.reviewForm} onSubmit={onSubmit}>
    <ReviewStars rating={rating} onRatingChange={onRatingChange} />
    <textarea
      value={review}
      onChange={(e) => onReviewChange(e.target.value)}
      placeholder="Напишите ваш отзыв..."
      className={s.reviewTextarea}
    />
    <button type="submit" className={s.submitButton}>
      Отправить
    </button>
  </form>
));

ReviewForm.propTypes = {
  rating: PropTypes.number.isRequired,
  review: PropTypes.string.isRequired,
  onRatingChange: PropTypes.func.isRequired,
  onReviewChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

ReviewForm.displayName = 'ReviewForm';

const PRICE_CONSTRAINTS = {
  MIN: 0,
  MAX: 1000000
};

const validatePrice = (price) => {
  if (typeof price !== 'number') return false;
  if (isNaN(price)) return false;
  if (price < PRICE_CONSTRAINTS.MIN) return false;
  if (price > PRICE_CONSTRAINTS.MAX) return false;
  return Number.isFinite(price);
};

const normalizePrice = (price) => {
  const normalized = Number(price);
  return validatePrice(normalized) ? normalized : null;
};

const TovarType = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  text: PropTypes.string.isRequired,
  img: PropTypes.string.isRequired,
  price: PropTypes.number,
  detailImg: PropTypes.string,
  description: PropTypes.string,
  specifications: PropTypes.object
});

const selectTovari = state => state.tovari;
const selectUsers = state => state.profile.users;
const selectPrices = state => state.cart.prices;
const selectFavorites = state => state.favorites?.items || [];
const selectIsAuth = state => state.profile.isAuth;

const selectAllItems = createSelector(
  [selectTovari, selectUsers],
  (tovari, users) => {
    const publishedItems = users.reduce((acc, user) => {
      if (user?.publishedItems) {
        return [...acc, ...user.publishedItems];
      }
      return acc;
    }, []);
    return [...tovari, ...publishedItems];
  }
);

const TovarDetailsComponent = memo(({ tovar, isModal = false, onClose }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  
  const [quantity, setQuantity] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [animate, setAnimate] = useState(false);

  const allItems = useSelector(selectAllItems);
  const prices = useSelector(selectPrices);
  const favorites = useSelector(selectFavorites);
  const isAuth = useSelector(selectIsAuth);
  
  const currentTovar = useMemo(() => {
    if (tovar) return tovar;
    if (id && allItems) {
      return allItems.find(item => item.id === id) || null;
    }
    return null;
  }, [tovar, id, allItems]);
  
  const actualPrice = useMemo(() => {
    if (!currentTovar) return null;
    
    const priceFromStore = normalizePrice(prices[currentTovar.text]);
    const priceFromTovar = normalizePrice(currentTovar.price);
    
    return priceFromStore || priceFromTovar || null;
  }, [currentTovar, prices]);

  useEffect(() => {
    setAnimate(true);
  }, []);

  const handleQuantityChange = useCallback((delta) => {
    setQuantity(q => Math.max(1, q + delta));
  }, []);

  const handleAddToCart = useCallback(() => {
    if (!currentTovar) {
      console.error('Товар не найден');
      return;
    }
    
    if (!actualPrice) {
      console.error('Некорректная цена товара');
      alert('Ошибка: некорректная цена товара');
      return;
    }

    try {
      const cartItem = {
        id: currentTovar.id,
        text: currentTovar.text || currentTovar.title,
        img: currentTovar.img,
        quantity: quantity,
        price: actualPrice,
        addedAt: new Date().toISOString()
      };

      dispatch(addToCart(cartItem));
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Произошла ошибка при добавлении товара в корзину');
    }
  }, [dispatch, currentTovar, quantity, actualPrice]);

  const handleAddToFavorites = useCallback(() => {
    if (!isAuth) {
      alert("Для добавления в избранное необходимо авторизоваться");
      return;
    }
    if (currentTovar) {
      dispatch(addToFavorites(currentTovar));
    }
  }, [dispatch, isAuth, currentTovar]);

  const handleSubmitReview = useCallback((e) => {
    e.preventDefault();
    if (rating > 0) {
      setShowReviewForm(false);
      setRating(0);
      setReview("");
    }
  }, [rating]);

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  const renderSpecifications = useCallback(() => {
    if (!currentTovar?.specifications) return null;

    const specs = currentTovar.specifications;
    
    let specEntries = [];
    
    // Если спецификации - массив объектов с name и value
    if (Array.isArray(specs)) {
      specEntries = specs
        .filter(spec => spec.name && spec.value)
        .map(spec => [spec.name, spec.value]);
    } else {
      // Если спецификации - объект
      specEntries = Object.entries(specs).reduce((acc, [key, value]) => {
        if (typeof value === 'object') {
          Object.entries(value).forEach(([subKey, subValue]) => {
            if (subValue !== "") {
              acc.push([`${key} (${subKey})`, subValue]);
            }
          });
        } else if (value !== "") {
          // Пропускаем поля id, name, value
          if (!['id', 'name', 'value'].includes(key)) {
            acc.push([key, value]);
          }
        }
        return acc;
      }, []);
    }
    
    if (specEntries.length === 0) return null;

    return (
      <div className={`${s.specifications} ${animate ? s.animate : ''}`}>
        <h2>Характеристики</h2>
        <ul className={s.specsList}>
          {specEntries.map(([key, value]) => (
            <li key={key} className={s.specItem}>
              <span className={s.specName}>{key}</span>
              <span className={s.specValue}>{value}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }, [currentTovar, animate]);

  if (!currentTovar) {
    return null;
  }

  return (
    <div className={s.modalOverlay} onClick={handleClose}>
      <div className={s.modalContent} onClick={e => e.stopPropagation()}>
        <Header />
        <main className={s.container}>
          <div className={s.productGrid}>
            <div className={s.imageSection}>
              <img 
                src={currentTovar.detailImg || currentTovar.img} 
                alt={currentTovar.text} 
                className={s.image}
              />
            </div>

            <div className={s.infoSection}>
              <h1 className={s.title}>{currentTovar.text}</h1>
              
              <div className={s.priceSection}>
                <div className={s.price}>
                  {actualPrice ? `${actualPrice} ₽` : 'Цена по запросу'}
                </div>
                {currentTovar.oldPrice && (
                  <div className={s.oldPrice}>{currentTovar.oldPrice} ₽</div>
                )}
              </div>

              {isAuth && (
                <div className={s.controls}>
                  <div className={s.quantityControl}>
                    <button 
                      onClick={() => handleQuantityChange(-1)}
                      className={s.quantityBtn}
                    >
                      -
                    </button>
                    <span className={s.quantity}>{quantity}</span>
                    <button 
                      onClick={() => handleQuantityChange(1)}
                      className={s.quantityBtn}
                    >
                      +
                    </button>
                  </div>

                  <div className={s.actionButtons}>
                    <button 
                      className={s.addButton} 
                      onClick={handleAddToCart}
                    >
                      В корзину
                    </button>
                    <button 
                      className={`${s.favoriteButton} ${favorites.includes(currentTovar.id) ? s.favoriteActive : ''}`} 
                      onClick={handleAddToFavorites}
                      aria-label={favorites.includes(currentTovar.id) ? "Удалить из избранного" : "Добавить в избранное"}
                    >
                      ♥
                    </button>
                  </div>
                </div>
              )}

              <div className={`${s.description} ${animate ? s.animate : ''}`}>
                <h2>Описание</h2>
                <p>{currentTovar.description || 'Описание отсутствует'}</p>
              </div>

              {renderSpecifications()}

              <div className={s.reviewSection}>
                <button 
                  className={s.reviewButton}
                  onClick={() => setShowReviewForm(!showReviewForm)}
                >
                  Оставить отзыв
                </button>

                {showReviewForm && (
                  <ReviewForm
                    rating={rating}
                    review={review}
                    onRatingChange={setRating}
                    onReviewChange={setReview}
                    onSubmit={handleSubmitReview}
                  />
                )}
              </div>
            </div>
          </div>

          <Link to="/tovari" className={s.backButton}>
            Вернуться к товарам
          </Link>
        </main>
        <Footer />
      </div>
    </div>
  );
});

TovarDetailsComponent.propTypes = {
  tovar: PropTypes.oneOfType([
    ProductType,
    PropTypes.object
  ]),
  isModal: PropTypes.bool,
  onClose: PropTypes.func
};

TovarDetailsComponent.displayName = 'TovarDetails';

export const TovarDetails = TovarDetailsComponent;
export default TovarDetails;
