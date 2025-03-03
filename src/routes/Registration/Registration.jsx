import React, { useState } from "react";
import s from "./Registration.module.css";
import { useDispatch } from "react-redux";
import { register } from "../Profile/profileSlice";
import { useNavigate } from "react-router-dom";
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";
import Logo from "../../assets/Logo.png";

export function Registration() {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    phone: "",
    description: "",
    email: "",
    password: "",
    publishedItems: [],
    paidItems: [],
    achievements: []
  });
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      dispatch(register(formData));
      navigate("/profile");
    } catch (error) {
      console.error("Ошибка при регистрации:", error);
      alert("Произошла ошибка при регистрации. Попробуйте еще раз.");
    }
  };

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
            required
          />
          <input
            type="text"
            name="surname"
            value={formData.surname}
            onChange={handleChange}
            placeholder="Фамилия"
            className={s.input}
            required
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
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className={s.input}
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Пароль"
            className={s.input}
            required
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
