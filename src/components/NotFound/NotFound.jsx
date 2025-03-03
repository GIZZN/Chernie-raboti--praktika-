import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NotFound.module.css';

export const NotFound = memo(() => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>404 - Страница не найдена</h1>
      <p className={styles.message}>
        Извините, запрашиваемая страница не существует.
      </p>
      <button 
        className={styles.button}
        onClick={() => navigate('/')}
      >
        Вернуться на главную
      </button>
    </div>
  );
});

NotFound.displayName = 'NotFound'; 