import React, { memo, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { logout } from '../../routes/Profile/profileSlice';
import logo from '../../assets/Logo.png';
import avatar from '../../assets/avatar.png';
import Basket from '../Icons/Basket';
import s from './Header.module.css';

const SearchIcon = memo(() => (
  <svg className={s.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
));

const DropdownMenu = memo(({ onClose, favorites, onLogout, totalItems }) => (
  <div className={s.dropdownMenuContainer}>
    <button 
      className={s.closeButton}
      onClick={onClose}
      aria-label="Закрыть меню"
    >
      <span className={s.hamburgerLine}></span>
      <span className={s.hamburgerLine}></span>
    </button>
    <ul className={s.dropdownMenu}>
      <li className={s.mobileOnly}>
        <Link to="/tovari" className={s.dropdownItem}>
          <svg viewBox="0 0 24 24" fill="currentColor" className={s.menuIcon}>
            <path d="M4 7V17C4 19.2091 5.79086 21 8 21H16C18.2091 21 20 19.2091 20 17V7M4 7H20M4 7L6 3H18L20 7"/>
          </svg>
          Товары
        </Link>
      </li>
      <li className={s.mobileOnly}>
        <Link to="/cart" className={s.dropdownItem}>
          <Basket className={s.menuIcon} />
          Корзина ({totalItems()})
        </Link>
      </li>
      <li>
        <Link to="/favorites" className={s.dropdownItem}>
          <svg viewBox="0 0 24 24" fill="currentColor" className={s.favoriteIcon}>
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          Избранное
          <span className={s.favoritesCount}>
            {favorites?.length || 0}
          </span>
        </Link>
      </li>
      <li>
        <Link to="/profile" className={s.dropdownItem}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
          </svg>
          Профиль
        </Link>
      </li>
      <li>
        <Link to="/settings" className={s.dropdownItem}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
          </svg>
          Настройки
        </Link>
      </li>
      <li className={s.logoutButton}>
        <button onClick={onLogout} className={s.dropdownItem}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
          </svg>
          Выйти
        </button>
      </li>
    </ul>
  </div>
));

DropdownMenu.propTypes = {
  onClose: PropTypes.func.isRequired,
  favorites: PropTypes.array,
  onLogout: PropTypes.func.isRequired,
  totalItems: PropTypes.func.isRequired
};

const HeaderComponent = memo(() => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuth } = useSelector((state) => state.profile);
  const cartItems = useSelector((state) => state.cart?.items || []);
  const favorites = useSelector((state) => state.favorites?.items || []);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const totalItems = useCallback(() => (
    Array.isArray(cartItems) 
      ? cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0)
      : 0
  ), [cartItems]);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search/${searchQuery.trim()}`);
      setSearchQuery('');
    }
  }, [searchQuery, navigate]);

  const handleLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen(prev => !prev);
  }, []);

  return (
    <header className={s.header}>
      <div className={s.headerTop}>
        <div className={s.logoContainer}>
          <Link to={'/'}>
            <img src={logo} alt="Logo" className={s.logo} />
          </Link>
          <h2 className={s.title}>Чёрные работы</h2>
        </div>

        {/* Поиск для десктопной версии */}
        <form onSubmit={handleSearch} className={`${s.searchForm} ${s.desktopOnly}`}>
          <div className={s.searchContainer}>
            <input
              type="text"
              placeholder="Поиск товаров..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={s.searchInput}
            />
            <SearchIcon />
          </div>
        </form>

        <nav className={s.nav}>
          <NavLink to="/tovari" className={`${s.navLink} ${s.desktopOnly}`}>
            <span>Товары</span>
          </NavLink>
          {isAuth ? (
            <>
              <NavLink to="/cart" className={`${s.navLink} ${s.desktopOnly}`}>
                <Basket className={s.basket} />
                <span>({totalItems()})</span>
              </NavLink>
              <button 
                className={s.dropdownButton} 
                onClick={toggleDropdown}
                data-active={isDropdownOpen}
              >
                <span className={s.hamburgerLine}></span>
                <span className={s.hamburgerLine}></span>
                <span className={s.hamburgerLine}></span>
              </button>
              <NavLink to="/profile" className={s.avatarLink}>
                <img src={avatar} alt="avatar" className={s.avatar} />
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/login" className={s.navLink}>
                Вход
              </NavLink>
              <NavLink to="/registration" className={s.navLink}>
                Регистрация
              </NavLink>
            </>
          )}
        </nav>
      </div>

      {/* Поиск для мобильной версии */}
      <form onSubmit={handleSearch} className={`${s.searchForm} ${s.mobileOnly}`}>
        <div className={s.searchContainer}>
          <input
            type="text"
            placeholder="Поиск товаров..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={s.searchInput}
          />
          <SearchIcon />
        </div>
      </form>

      {isDropdownOpen && (
        <DropdownMenu
          onClose={toggleDropdown}
          favorites={favorites}
          onLogout={handleLogout}
          totalItems={totalItems}
        />
      )}
    </header>
  );
});

HeaderComponent.displayName = 'Header';

export const Header = HeaderComponent;