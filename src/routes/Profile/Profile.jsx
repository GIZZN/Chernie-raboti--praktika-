import React, { useState, useEffect, memo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout, updateProfile, toggleTheme, publishItem, removePublishedItem } from "./profileSlice";
import s from "./Profile.module.css";
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";
import avatar from '../../assets/avatar.png';
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';

const UserStats = memo(({ paidItems, achievements }) => (
  <div className={s.userStats}>
    <div className={s.stat}>
      <span className={s.statNumber}>{paidItems?.length || 0}</span>
      <span className={s.statLabel}>Заказов</span>
    </div>
    <div className={s.stat}>
      <span className={s.statNumber}>{achievements?.length || 0}</span>
      <span className={s.statLabel}>Достижений</span>
    </div>
  </div>
));

UserStats.propTypes = {
  paidItems: PropTypes.array,
  achievements: PropTypes.array
};


const OrdersList = memo(({ items }) => (
  <ul className={s.list}>
    {items.map((item) => (
      <li key={item.orderId} className={s.item}>
        <div className={s.orderInfo}>
          <p className={s.orderId}>Заказ №{item.orderId}</p>
          <div className={s.orderContent}>
            <div className={s.orderImageContainer}>
              <img src={item.img} alt={item.text} className={s.orderImage} />
            </div>
            <div className={s.orderDetails}>
              <p className={s.orderItem}>{item.text}</p>
              <div className={s.priceDetails}>
                <p className={s.orderPrice}>
                  {item.price} ₽ x {item.quantity || 1} шт.
                </p>
                <p className={s.orderTotalPrice}>
                  Итого: {(item.price * (item.quantity || 1))} ₽
                </p>
              </div>
            </div>
          </div>
        </div>
      </li>
    ))}
  </ul>
));

const ProfileForm = memo(({ profile, onSubmit, onChange }) => (
  <form onSubmit={onSubmit}>
    <div className={s.infoHeader}>
      <h2>Редактирование профиля</h2>
      <button type="submit" className={s.editButton}>
        Сохранить
      </button>
    </div>
    <div className={s.personalInfo}>
      <div>
        <p>Имя</p>
        <input
          type="text"
          name="name"
          value={profile.name || ''}
          onChange={onChange}
          className={s.inputField}
        />
      </div>
      <div>
        <p>Фамилия</p>
        <input
          type="text"
          name="surname"
          value={profile.surname || ''}
          onChange={onChange}
          className={s.inputField}
        />
      </div>
    </div>
    <div>
      <p>Email</p>
      <input
        type="email"
        name="email"
        value={profile.email || ''}
        onChange={onChange}
        className={s.inputField}
      />
    </div>
    <div>
      <p>Телефон</p>
      <input
        type="tel"
        name="phone"
        value={profile.phone || ''}
        onChange={onChange}
        className={s.inputField}
      />
    </div>
    <div>
      <p>Описание профиля</p>
      <textarea
        name="description"
        value={profile.description || ''}
        onChange={onChange}
        className={s.inputField}
        rows="4"
      />
    </div>
  </form>
));


const PublishedItemImage = memo(({ img, text }) => (
  <img className={s.itemImage} src={img} alt={text} />
));

const PublishedItemInfo = memo(({ text, price }) => (
  <>
    <p className={s.text}>{text}</p>
    <p className={s.price}>{price} ₽</p>
  </>
));

const PublishedItems = memo(({ items, onRemove }) => (
  <div className={s.publishedItems}>
    <h2>Мои товары</h2>
    <div className={s.itemsGrid}>
      {items.map((item) => (
        <div key={item.id} className={s.cardContainer}>
          <div className={s.publishedItem}>
            <PublishedItemImage img={item.img} text={item.text} />
            <PublishedItemInfo text={item.text} price={item.price} />
            <button 
              className={s.removeButton}
              onClick={() => onRemove(item.id)}
            >
              Удалить
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
));

PublishedItems.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    img: PropTypes.string.isRequired
  })),
  onRemove: PropTypes.func.isRequired
};

export const Profile = memo(() => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, theme, isAuth } = useSelector((state) => state.profile);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const [showCardInfo, setShowCardInfo] = useState(false);

  useEffect(() => {
    if (!isAuth) {
      navigate('/login');
    }
  }, [isAuth, navigate]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (theme !== savedTheme) {
      dispatch(toggleTheme());
    }
  }, []);

  useEffect(() => {
    if (currentUser && !currentUser.publishedItems) {
      dispatch(updateProfile({
        ...currentUser,
        publishedItems: []
      }));
    }
  }, [currentUser, dispatch]);

  if (!currentUser) {
    return null;
  }

  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate('/login');
  }, [dispatch, navigate]);

  const handleEdit = useCallback(() => {
    setEditedProfile({
      name: currentUser.name,
      surname: currentUser.surname,
      email: currentUser.email,
      phone: currentUser.phone,
      description: currentUser.description
    });
    setIsEditing(true);
  }, [currentUser]);

  const handleSave = useCallback(() => {
    dispatch(updateProfile(editedProfile));
    setIsEditing(false);
  }, [dispatch, editedProfile]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setEditedProfile(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handlePublish = useCallback(() => {
    navigate('/publish');
  }, [navigate]);

  const handleRemoveItem = useCallback((id) => {
    dispatch(removePublishedItem(id));
  }, [dispatch]);

  const handleThemeToggle = useCallback(() => {
    dispatch(toggleTheme());
    localStorage.setItem('theme', theme === 'dark' ? 'light' : 'dark');
  }, [dispatch, theme]);

  const handleMouseMove = (e) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    btn.style.setProperty('--x', `${x}%`);
    btn.style.setProperty('--y', `${y}%`);
  };

  return (
    <>
      <Header />
      <main className={`${s.container} ${theme === 'dark' ? s.dark : s.light}`}>
        <div className={s.user}>
          <div 
            className={s.themeToggle} 
            onClick={handleThemeToggle}
          >
            <svg 
              className={s.themeIcon} 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              {theme === 'dark' ? (
                <>
                  <path d="M9 18h6" />
                  <path d="M10 22h4" />
                  <path d="M12 2v2" />
                  <path d="M12 6a6 6 0 0 1 6 6c0 2.2-1.2 4.1-3 5.2V18h-6v-0.8c-1.8-1-3-3-3-5.2a6 6 0 0 1 6-6z" />
                </>
              ) : (
                <>
                  <path d="M9 18h6" />
                  <path d="M10 22h4" />
                  <path d="M12 6a6 6 0 0 1 6 6c0 2.2-1.2 4.1-3 5.2V18h-6v-0.8c-1.8-1-3-3-3-5.2a6 6 0 0 1 6-6z" />
                </>
              )}
            </svg>
          </div>
          
          <div className={s.avatarContainer}>
            <img src={avatar} alt="Аватар пользователя" className={s.avatar} />
            <div className={s.avatarOverlay}>
              <span>Изменить фото</span>
            </div>
          </div>

          <UserStats paidItems={currentUser.paidItems} achievements={currentUser.achievements} />

          <button 
            className={s.logoutButton} 
            onClick={handleLogout}
            type="button"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className={s.logoutIcon}>
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
            </svg>
            Выйти
          </button>
          <div className={s.ordersContainer}>
            <div className={s.orders}>
              <h2>Мои заказы</h2>
              <div>
                {currentUser.paidItems?.length === 0 ? (
                  <p className={s.empty}>Здесь будет отображаться информация о ваших заказах.</p>    
                ) : (    
                  <OrdersList items={currentUser.paidItems} />    
                )}    
              </div>
            </div>
            <PublishedItems 
              items={currentUser?.publishedItems || []} 
              onRemove={handleRemoveItem}
            />
          </div>
        </div>

        <div className={s.info}>
          {isEditing ? (
            <ProfileForm profile={editedProfile} onSubmit={handleSave} onChange={handleChange} />
          ) : (
            <div className={s.infoContent}>
              <div className={s.infoHeader}>
                <h2>Профиль</h2>
                <button className={s.editButton} onClick={handleEdit}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Редактировать профиль
                </button>
              </div>
              <div className={s.personalInfo}>
                <div>
                  <p>Имя</p>
                  <div className={s.mainInfo}>
                    <p className={s.name}>{currentUser.name}</p>
                  </div>
                </div>
                <div>
                  <p>Фамилия</p>
                  <div className={s.mainInfo}>
                    <p className={s.surname}>{currentUser.surname}</p>
                  </div>
                </div>
              </div>

              <div>
                <p>Email</p>
                <div className={s.mainInfo}>
                  <p className={s.email}>{currentUser.email}</p>
                </div>
              </div>

              <div>
                <p>Описание профиля</p>
                <div className={s.mainInfo}>
                  <p className={s.description}>{currentUser.description}</p>
                </div>
              </div>
              <div>
                <p>Телефон</p>
                <div className={s.mainInfo}>
                  <p className={s.phone}>{currentUser.phone}</p>
                </div>
              </div>

              <div className={s.bannerContainer}>
                {!showCardInfo ? (
                  <div className={s.cardPreview} onClick={() => setShowCardInfo(true)}>
                    <div className={s.cardBackground}>
                      <div className={s.cardPattern}></div>
                    </div>
                    <div className={s.cardContent}>
                      <div className={s.cardTop}>
                        <div className={s.cardChip}>
                          <svg viewBox="0 0 50 40" fill="none">
                            <rect width="50" height="40" rx="4" fill="url(#chipGradient)"/>
                            <path d="M10 20h30" stroke="#333" strokeWidth="1"/>
                            <path d="M15 15h20" stroke="#333" strokeWidth="1"/>
                            <path d="M15 25h20" stroke="#333" strokeWidth="1"/>
                            <defs>
                              <linearGradient id="chipGradient" x1="0" y1="0" x2="50" y2="40">
                                <stop offset="0" stopColor="#FFD700"/>
                                <stop offset="1" stopColor="#B8860B"/>
                              </linearGradient>
                            </defs>
                          </svg>
                        </div>
                        <div className={s.cardLogo}>
                          <svg viewBox="0 0 60 40" fill="none">
                            <circle cx="20" cy="20" r="20" fill="#FF0000" opacity="0.8"/>
                            <circle cx="40" cy="20" r="20" fill="#FFA500" opacity="0.8"/>
                          </svg>
                        </div>
                      </div>
                      <div className={s.cardNumber}>
                        <span>****</span>
                        <span>****</span>
                        <span>****</span>
                        <span>****</span>
                      </div>
                      <div className={s.cardBottom}>
                        <div className={s.cardHolder}>
                          <span className={s.cardLabel}>Card Holder</span>
                          <span className={s.cardValue}>Artem SAvkin</span>
                        </div>
                        <div className={s.cardExpiry}>
                          <span className={s.cardLabel}>Expires</span>
                          <span className={s.cardValue}>MM/YY</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={s.cardInfoForm}>
                    <button className={s.closeButton} onClick={() => setShowCardInfo(false)}>
                      <svg viewBox="0 0 24 24" width="24" height="24">
                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    </button>
                    <form className={s.form}>
                      <div className={s.formGroup}>
                        <label>Card Number</label>
                        <input
                          type="text"
                          className={s.inputField}
                          placeholder="0000 0000 0000 0000"
                          maxLength="19"
                          onChange={(e) => {
                            let value = e.target.value.replace(/\s/g, '');
                            value = value.replace(/(\d{4})/g, '$1 ').trim();
                            e.target.value = value;
                          }}
                          pattern="\d*"
                        />
                      </div>
                      <div className={s.formRow}>
                        <div className={s.formGroup}>
                          <label>Expiry Date</label>
                          <input
                            type="text"
                            className={s.inputField}
                            placeholder="MM/YY"
                            maxLength="5"
                            onChange={(e) => {
                              let value = e.target.value.replace('/', '');
                              if (value.length > 2) {
                                value = value.slice(0, 2) + '/' + value.slice(2);
                              }
                              e.target.value = value;
                            }}
                          />
                        </div>
                        <div className={s.formGroup}>
                          <label>CVV</label>
                          <input
                            type="password"
                            className={s.inputField}
                            placeholder="***"
                            maxLength="3"
                            pattern="\d*"
                          />
                        </div>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <button 
          className={s.publishButton}
          onClick={handlePublish}
          onMouseMove={handleMouseMove}
          type="button"
        >
          <span className={s.buttonContent}>
            <svg 
              viewBox="0 0 24 24" 
              width="22" 
              height="22"
              className={s.publishIcon}
            >
              <circle className={s.iconCircle} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
              <path className={s.iconArrow} d="M12 16V8M8 12l4-4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className={s.buttonText}>ОПУБЛИКОВАТЬ ТОВАР</span>
          </span>
          <div className={s.buttonGlow}></div>
        </button>
      </main>
      <Footer />
    </>
  );
});

Profile.displayName = 'Profile';
