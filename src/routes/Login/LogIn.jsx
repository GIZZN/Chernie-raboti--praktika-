import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../Profile/profileSlice";
import s from "./LogIn.module.css";
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";
import { Navigate } from "react-router-dom";
import Logo from "../../assets/Logo.png";

export function LogIn() {
  let [credentials, setCredentials] = useState({ email: "", password: "" });
  let dispatch = useDispatch();
  let { isAuth } = useSelector((state) => state.profile);

  let handleInputChange = (e) => {
    let { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  let handleFormSubmit = (e) => {
    e.preventDefault();
    dispatch(login(credentials));
  };

  if (isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <Header />
      <main className={s.container}>
        <form className={s.form} onSubmit={handleFormSubmit} aria-label="Login form">
          <img src={Logo} alt="Company Logo" className={s.logo} />
          <h2 className={s.title}>Вход на сайт</h2>
          <input
            name="email"
            value={credentials.email}
            onChange={handleInputChange}
            placeholder="Email"
            aria-label="Введите ваш email"
            aria-describedby="emailHelp"
            className={s.input}
          />
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleInputChange}
            placeholder="Пароль"
            aria-label="Введите ваш пароль"
            className={s.input}
          />
          <button type="submit" className={s.button}>
            Войти
          </button>
        </form>
      </main>
      <Footer />
    </>
  );
}
