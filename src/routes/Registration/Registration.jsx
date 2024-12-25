import React, { useState } from "react";
import s from "./Registration.module.css";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../Profile/profileSlice";
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";
import { Navigate, useNavigate } from "react-router-dom";
import Logo from "../../assets/Logo.png";

export function Registration() {
  let [formData, setFormData] = useState({
    name: "",
    surname: "",
    phone: "",
    description: "",
    email: "",
    password: "",
  });
  let dispatch = useDispatch();
  let isAuth = useSelector((state) => state.profile.isAuth);
  let navigate = useNavigate();

  let handleChange = (e) => {
    let { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  let handleSubmit = (e) => {
    e.preventDefault();
    dispatch(register(formData));
    setFormData({ name: "", surname: "", phone: "", description: "", email: "", password: "" });
    if (!isAuth) navigate("/");
  };

  if (isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <Header />
      <main className={s.container}>
        <form className={s.form} onSubmit={handleSubmit}>
          <img src={Logo} alt="Company Logo" className={s.logo} />
          <h1 className={s.title}>Регистрация</h1>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Имя"
            className={s.input}
          />
          <input
            type="text"
            name="surname"
            value={formData.surname}
            onChange={handleChange}
            placeholder="Фамилия"
            className={s.input}
          />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Номер телефона"
            className={s.input}
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Описание профиля"
            className={s.input}
          />
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className={s.input}
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Пароль"
            className={s.input}
          />
          <button type="submit" className={s.button}>
            Зарегистрироваться
          </button>
        </form>
      </main>
      <Footer />
    </>
  );
}
