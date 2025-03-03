import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../Profile/profileSlice";
import s from "./LogIn.module.css";
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";
import Logo from "../../assets/Logo.png";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const result = dispatch(login({ email, password }));
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
        navigate("/profile");
      } else {
        setError("Неверный email или пароль");
      }
    } catch (error) {
      console.error("Ошибка входа:", error);
      setError("Произошла ошибка при входе");
    }
  };

  return (
    <>
      <Header />
      <main className={s.container}>
        <form className={s.form} onSubmit={handleSubmit}>
          <img src={Logo} alt="Company Logo" className={s.logo} />
          <h1 className={s.title}>Вход</h1>
          {error && <p className={s.error}>{error}</p>}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className={s.input}
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль"
            className={s.input}
            required
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