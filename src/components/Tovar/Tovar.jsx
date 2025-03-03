import { memo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../routes/Cart/cartSlice";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import s from "./Tovar.module.css";

const TovarPropTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  text: PropTypes.string.isRequired,
  img: PropTypes.string.isRequired,
  price: PropTypes.number,
  description: PropTypes.string,
  category: PropTypes.string
};

const TovarImage = memo(({ img, text }) => (
  <img className={s.image} src={img} alt={text} />
));

TovarImage.propTypes = {
  img: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired
};

const TovarInfo = memo(({ text, price }) => (
  <>
    <p className={s.text}>{text}</p>
    <p className={s.price}>{price} ₽</p>
  </>
));

TovarInfo.propTypes = {
  text: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired
};

const TovarButtons = memo(({ id, isAuth, onAddToCart }) => (
  <>
    {isAuth && (
      <button className={s.button} onClick={onAddToCart}>
        В корзину
      </button>
    )}
    <Link to={`/tovar/${id}`} className={s.detailsButton}>
      Подробнее
    </Link>
  </>
));

TovarButtons.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  isAuth: PropTypes.bool.isRequired,
  onAddToCart: PropTypes.func.isRequired
};

export const Tovar = memo(({ id, text, img, price }) => {
  const dispatch = useDispatch();
  const { isAuth } = useSelector((state) => state.profile);
  const prices = useSelector((state) => state.cart.prices);
  
  const actualPrice = prices[text] || price;

  const handleAddToCart = useCallback(() => {
    if (actualPrice) {
      dispatch(addToCart({ 
        id, 
        text, 
        img, 
        actualPrice 
      }));
    }
  }, [dispatch, id, text, img, actualPrice]);

  return (
    <div className={s.cardContainer}>
      <div className={s.card}>
        <TovarImage img={img} text={text} />
        <TovarInfo text={text} price={actualPrice} />
        <TovarButtons 
          id={id} 
          isAuth={isAuth} 
          onAddToCart={handleAddToCart} 
        />
      </div>
    </div>
  );
});

Tovar.propTypes = TovarPropTypes;
Tovar.displayName = 'Tovar';