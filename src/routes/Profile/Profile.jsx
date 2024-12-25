import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../Profile/profileSlice";
import s from "./Profile.module.css";
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";
import avatar from '../../assets/avatar.png';
import { useNavigate } from "react-router-dom";

export function Profile() {
  let select = useSelector((state) => state.profile);
  let dispatch = useDispatch();
  let nav = useNavigate();

  if (!select.isAuth || !select.loggedInUser) {
    return <h2 className={s.message}>Вы не авторизованы. Пожалуйста, войдите в систему.</h2>;
  }

  let handleLogout = () => {
    dispatch(logout());
    nav('/');
  };
  let paidItems = select.loggedInUser.paidItems || [];

  return (
    <>
      <Header />
      <main className={s.container}>
        <div className={s.user}>
          <img
            src={avatar}
            alt="Аватар пользователя"
            className={s.avatar}
          />
          <button className={s.logoutButton} onClick={handleLogout}>
            Выйти
          </button>
        </div>
        <div className={s.info}>
          <div className={s.personalInfo}>
            <div>
              <p>Имя</p>
              <div className={s.mainInfo}>
                <p className={s.name}>{select.loggedInUser.name}</p>
              </div>
            </div>
            <div>
              <p>Фамилия</p>
              <div className={s.mainInfo}>
                <p className={s.surname}>{select.loggedInUser.surname}</p>
              </div>
            </div>
          </div>
          <div>
            <p>Email</p>
            <div className={s.mainInfo}>
              <p className={s.email}>{select.loggedInUser.email}</p>
            </div>
          </div>
          <div>
            <p>Описание профиля</p>
            <div className={s.mainInfo}>
              <p className={s.description}>{select.loggedInUser.description}</p>
            </div>
          </div>
          <div >
            <p>Телефон</p>
            <div className={s.mainInfo}>
              <p className={s.phone}>{select.loggedInUser.phone}</p>
            </div>
          </div>
        </div>
        <div className={s.orders}>
          {paidItems.length === 0 ? (
            <p className={s.empty}>Здесь будет отображаться информация о ваших заказах.</p>
          ) : (
            <ul className={s.list}>
              {paidItems.map((item, index) => (
                <li key={index} className={s.item}>
                  <div>
                    <p>заказ-{item.id}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
