import { memo, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { clearCart, incrementQuantity, decrementQuantity, removeItem, setCartItems, addToCart } from './cartSlice';
import { addPaidItems } from '../Profile/profileSlice';
import { Header } from '../../components/Header/Header';
import { Footer } from '../../components/Footer/Footer';
import s from './Cart.module.css';
import { nanoid } from 'nanoid';

const CartIcon = memo(() => (
  <svg 
    width="25" 
    height="24" 
    viewBox="0 0 25 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M2.11133 2.39307H3.88315C4.9829 2.39307 5.84844 3.28196 5.7568 4.30466L4.91162 13.8244C4.76906 15.3823 6.08264 16.7205 7.75263 16.7205H18.5974C20.0637 16.7205 21.3468 15.5926 21.4588 14.2258L22.0086 7.05736C22.1308 5.47074 20.8478 4.1804 19.1473 4.1804H6.00119" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeMiterlimit="10" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M16.6225 21.5089C17.3254 21.5089 17.8953 20.974 17.8953 20.3141C17.8953 19.6543 17.3254 19.1194 16.6225 19.1194C15.9195 19.1194 15.3496 19.6543 15.3496 20.3141C15.3496 20.974 15.9195 21.5089 16.6225 21.5089Z" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeMiterlimit="10" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M8.47598 21.5089C9.17896 21.5089 9.74885 20.974 9.74885 20.3141C9.74885 19.6543 9.17896 19.1194 8.47598 19.1194C7.773 19.1194 7.20312 19.6543 7.20312 20.3141C7.20312 20.974 7.773 21.5089 8.47598 21.5089Z" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeMiterlimit="10" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
));

CartIcon.displayName = 'CartIcon';

const EmptyCart = memo(() => (
  <div className={s.emptyCart}>
    <div className={s.emptyCartIcon}>
      <CartIcon />
    </div>
    <p className={s.emptyText}>Корзина пуста</p>
    <Link to="/tovari" className={s.continueShopping}>
      Продолжить покупки
    </Link>
  </div>
));

EmptyCart.displayName = 'EmptyCart';

const CartItem = memo(({ item, onIncrement, onDecrement, onRemove }) => {
  const prices = useSelector((state) => state.cart?.prices || {});
  const itemPrice = prices[item.text] !== undefined ? prices[item.text] : item.price;

  return (
    <div className={s.item}>
      <div className={s.itemImageWrapper}>
        <img src={item.img} alt={item.text} className={s.image} />
      </div>
      <div className={s.itemInfo}>
        <h3 className={s.itemTitle}>{item.text}</h3>
        <div className={s.itemDetails}>
          <p className={s.price}>{itemPrice} ₽</p>
          <div className={s.quantityWrapper}>
            <button 
              className={s.quantityBtn}
              onClick={() => onDecrement(item.id)}
              aria-label="Уменьшить количество"
            >
              -
            </button>
            <span className={s.quantity}>{item.quantity || 1}</span>
            <button 
              className={s.quantityBtn}
              onClick={() => onIncrement(item.id)}
              aria-label="Увеличить количество"
            >
              +
            </button>
          </div>
        </div>
      </div>
      <button 
        className={s.removeItem}
        onClick={() => onRemove(item.id)}
        aria-label="Удалить товар"
      >
        ×
      </button>
    </div>
  );
});

CartItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    img: PropTypes.string.isRequired,
    price: PropTypes.number,
    quantity: PropTypes.number
  }).isRequired,
  onIncrement: PropTypes.func.isRequired,
  onDecrement: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired
};

CartItem.displayName = 'CartItem';

const CartSummary = memo(({ total, onClear, onPayment }) => (
  <div className={s.cartSummary}>
    <div className={s.summaryDetails}>
      <div className={s.summaryRow}>
        <span>Подытог:</span>
        <span>{total} ₽</span>
      </div>
      <div className={s.summaryRow}>
        <span>Доставка:</span>
        <span>Бесплатно</span>
      </div>
      <div className={`${s.summaryRow} ${s.total}`}>
        <span>Итого:</span>
        <span>{total} ₽</span>
      </div>
    </div>
    
    <div className={s.cartActions}>
      <button 
        className={s.clearButton} 
        onClick={onClear}
        aria-label="Очистить корзину"
      >
        Очистить корзину
      </button>
      <button 
        className={s.payButton} 
        onClick={onPayment}
        aria-label="Оплатить заказ"
      >
        Оплатить
      </button>
    </div>
  </div>
));

CartSummary.propTypes = {
  total: PropTypes.number.isRequired,
  onClear: PropTypes.func.isRequired,
  onPayment: PropTypes.func.isRequired
};

CartSummary.displayName = 'CartSummary';

const Cart = memo(() => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.cart);
  const { currentUser } = useSelector((state) => state.profile);
  const prices = useSelector(state => state.cart?.prices || {});

  useEffect(() => {
    if (currentUser) {
        fetch(`/api/cart`)
        .then(res => res.json())
        .then(data => {
          dispatch(setCartItems(data));
        })
        .catch(console.error);
    }
  }, [currentUser, dispatch]);

  const calculateTotal = useCallback(() => {
    return items.reduce((total, item) => {
      const itemPrice = prices[item.text] !== undefined ? prices[item.text] : item.price;
      return total + (itemPrice * (item.quantity || 1));
    }, 0);
  }, [items, prices]);

  const handlePayment = useCallback(async () => {
    if (!currentUser) {
      alert("Для оплаты необходимо авторизоваться");
      navigate("/login");
      return;
    }
// удалить кол спасибо за покупку в будующем 
    try {
      const purchasedItems = items.map(item => ({
        ...item,
        purchaseDate: new Date().toISOString(),
        orderId: nanoid(),
        quantity: item.quantity || 1,
        price: prices[item.text] !== undefined ? prices[item.text] : item.price || 0
      }));

      await dispatch(addPaidItems(purchasedItems));
      dispatch(clearCart());
      
      alert("Спасибо за покупку! Заказ оформлен.");
      navigate("/profile");
    } catch (error) {
      console.error("Ошибка при оплате:", error);
      alert("Произошла ошибка при оформлении заказа");
    }
  }, [dispatch, navigate, items, currentUser, prices]);

  const handleIncrement = useCallback((id) => {
    dispatch(incrementQuantity(id));
  }, [dispatch]);

  const handleDecrement = useCallback((id) => {
    dispatch(decrementQuantity(id));
  }, [dispatch]);

  const handleRemove = useCallback((id) => {
    dispatch(removeItem(id));
  }, [dispatch]);

  const handleClear = useCallback(() => {
    dispatch(clearCart());
  }, [dispatch]);

  const handleAddToCart = async (productId, quantity = 1) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity }),
      });

      if (response.ok) {
        const item = await response.json();
        dispatch(addToCart(item));
      }
    } catch (error) {
      console.error('Ошибка добавления в корзину:', error);
    }
  };

  return (
    <>
      <Header />
      <div className={s.container}>
        <h2 className={s.title}>Корзина</h2>
        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className={s.cartContent}>
            <div className={s.list}>
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onIncrement={handleIncrement}
                  onDecrement={handleDecrement}
                  onRemove={handleRemove}
                />
              ))}
            </div>
            
            <CartSummary
              total={calculateTotal()}
              onClear={handleClear}
              onPayment={handlePayment}
            />
          </div>
        )}
      </div>
      <Footer />
    </>
  );
});

Cart.displayName = 'Cart';

export { Cart };