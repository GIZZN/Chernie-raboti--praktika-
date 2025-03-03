import React, { memo, useState, useCallback } from 'react';
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import s from "./Footer.module.css";

const ChatIcon = memo(() => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    className={s.chatIcon}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z"
      fill="currentColor"
    />
    <path 
      d="M7 9H17M7 12H13" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round"
    />
  </svg>
));

const SupportForm = memo(({ onSubmit, name, email, message, onNameChange, onEmailChange, onMessageChange }) => (
  <form onSubmit={onSubmit} className={s.supportForm}>
    <div className={s.inputGroup}>
      <input
        type="text"
        placeholder="Ваше имя"
        value={name}
        onChange={onNameChange}
        required
        className={s.input}
      />
    </div>
    <div className={s.inputGroup}>
      <input
        type="email"
        placeholder="Ваш email"
        value={email}
        onChange={onEmailChange}
        required
        className={s.input}
      />
    </div>
    <div className={s.inputGroup}>
      <textarea
        placeholder="Опишите вашу проблему"
        value={message}
        onChange={onMessageChange}
        required
        className={s.textarea}
      />
    </div>
    <button type="submit" className={s.submitButton}>
      Отправить
    </button>
  </form>
));

SupportForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  onNameChange: PropTypes.func.isRequired,
  onEmailChange: PropTypes.func.isRequired,
  onMessageChange: PropTypes.func.isRequired
};

const ProductIcon = memo(() => (
  <svg 
    className={s.productIcon} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M4 7V17C4 19.2091 5.79086 21 8 21H16C18.2091 21 20 19.2091 20 17V7M4 7H20M4 7L6 3H18L20 7" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M9 11H15M9 15H13" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round"
    />
  </svg>
));

export const Footer = memo(() => {
  const [isSupportOpen, setSupportOpen] = useState(false);
  const [supportMessage, setSupportMessage] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          message: supportMessage,
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        alert('Сообщение успешно отправлено!');
      } else {
        throw new Error('Ошибка отправки');
      }
    } catch (error) {
      console.error('Error:', error);
      const requests = JSON.parse(localStorage.getItem('supportRequests') || '[]');
      requests.push({
        name,
        email,
        message: supportMessage,
        timestamp: new Date().toISOString(),
        status: 'pending'
      });
      localStorage.setItem('supportRequests', JSON.stringify(requests));
      alert('Сообщение сохранено локально. Мы обработаем его позже.');
    } finally {
      setIsSubmitting(false);
      setSupportMessage("");
      setEmail("");
      setName("");
      setSupportOpen(false);
    }
  }, [name, email, supportMessage]);

  return (
    <footer className={s.footer}>
      <Link to="/tovari" className={s.productButton}>
        <ProductIcon />
        <span className={s.buttonText}>Товары</span>
        <div className={s.buttonGlow} />
      </Link>
      
      <div className={s.phone}>
        <p className={s.phoneText}>Телефон: +7 (999) 999-99-99</p>
        <button 
          className={s.chatButton}
          onClick={() => setSupportOpen(true)}
          aria-label="Открыть чат поддержки"
        >
          <ChatIcon />
          <div className={s.chatButtonGlow} />
        </button>
      </div>

      {isSupportOpen && (
        <div className={s.chatOverlay} onClick={() => setSupportOpen(false)}>
          <div className={s.chatPopup} onClick={e => e.stopPropagation()}>
            <button 
              className={s.closeButton}
              onClick={() => setSupportOpen(false)}
              aria-label="Закрыть чат"
            >
              <span className={s.closeIcon} />
            </button>
            
            <h3 className={s.chatTitle}>
              <ChatIcon /> Чат поддержки
            </h3>
            
            <SupportForm
              onSubmit={handleSubmit}
              name={name}
              email={email}
              message={supportMessage}
              onNameChange={(e) => setName(e.target.value)}
              onEmailChange={(e) => setEmail(e.target.value)}
              onMessageChange={(e) => setSupportMessage(e.target.value)}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      )}
    </footer>
  );
});

Footer.displayName = 'Footer';