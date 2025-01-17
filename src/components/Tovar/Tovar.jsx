import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../routes/Cart/cartSlice.js";
import { Link } from "react-router-dom";
import s from "./Tovar.module.css";

export function Tovar({ id, text, img, price }) {
  let dispatch = useDispatch();
  let select = useSelector((state) => state.profile);

  let handleAddToCart = () => {
    dispatch(addToCart({ id, text, img, price }));
  };

  return (
     <div className={s.cardContainer}>
        <div className={s.card}>
            <img className={s.image} src={img} alt={text} />
            <p className={s.text}>{text}</p>
            <p className={s.price}>₽1900{price}</p>
            {select.isAuth && (
              <button className={s.button} onClick={handleAddToCart}>
                В корзину
              </button>
            )}
            <Link to={`/tovar/${id}`} className={s.detailsButton}>
              Подробнее
            </Link>
        </div>
    </div>
  );
}
