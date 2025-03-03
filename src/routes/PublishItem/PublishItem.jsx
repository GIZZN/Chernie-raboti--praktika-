import { memo, useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { publishItem } from '../Profile/profileSlice';
import { Header } from '../../components/Header/Header';
import { Footer } from '../../components/Footer/Footer';
import s from './PublishItem.module.css';
import { nanoid } from 'nanoid';
import { updateProfile } from '../Profile/profileSlice';

const UploadIcon = memo(() => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
));

const ImagePreview = memo(({ images }) => (
  <div className={s.imagePreview}>
    {images.map((img, index) => (
      <img key={index} src={img} alt={`Preview ${index + 1}`} />
    ))}
  </div>
));

ImagePreview.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired
};

const SpecificationRow = memo(({ spec, index, onChange }) => (
  <div className={s.specRow}>
    <input
      type="text"
      placeholder="Название"
      value={spec.name}
      onChange={(e) => onChange(index, 'name', e.target.value)}
      className={s.specInput}
    />
    <input
      type="text"
      placeholder="Значение"
      value={spec.value}
      onChange={(e) => onChange(index, 'value', e.target.value)}
      className={s.specInput}
    />
  </div>
));

SpecificationRow.propTypes = {
  spec: PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  }).isRequired,
  index: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired
};

const CategoryIcons = {
  Техника: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={s.categoryIconSvg}>
      <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      <path d="M6 16h12"/>
      <path d="M9 12v8"/>
      <path d="M15 12v8"/>
    </svg>
  ),
  Инструменты: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={s.categoryIconSvg}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
      <path d="M10 9l-6 6"/>
    </svg>
  ),
  Материалы: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={s.categoryIconSvg}>
      <path d="M2 6h20l-2 12H4L2 6z"/>
      <path d="M4 6l2-4h12l2 4"/>
      <path d="M10 12v4"/>
      <path d="M14 12v4"/>
    </svg>
  ),
  Люди: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={s.categoryIconSvg}>
      <circle cx="12" cy="7" r="4"/>
      <path d="M5.4 20a9 9 0 0 1 13.2 0"/>
      <path d="M18 14c3.4 1 6 3.6 6 7"/>
      <path d="M6 14c-3.4 1-6 3.6-6 7"/>
    </svg>
  )
};

const CATEGORIES = {
  'Техника': {
    icon: CategoryIcons.Техника,
    description: 'Электроинструменты и оборудование'
  },
  'Инструменты': {
    icon: CategoryIcons.Инструменты,
    description: 'Ручные и профессиональные инструменты'
  },
  'Материалы': {
    icon: CategoryIcons.Материалы,
    description: 'Строительные и отделочные материалы'
  },
  'Люди': {
    icon: CategoryIcons.Люди,
    description: 'Услуги специалистов и мастеров'
  }
};

export const PublishItem = memo(() => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme, currentUser } = useSelector((state) => state.profile);
  
  const [itemData, setItemData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    images: [],
    specifications: []
  });

  const [newSpecification, setNewSpecification] = useState({ name: '', value: '' });

  // Функция для конвертации файла в base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Обновленная функция загрузки изображений
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    try {
      const base64Images = await Promise.all(
        files.map(async (file) => {
          const base64 = await convertToBase64(file);
          return base64;
        })
      );

      setItemData(prev => ({
        ...prev,
        images: [...prev.images, ...base64Images]
      }));
    } catch (error) {
      console.error('Error converting images:', error);
      alert('Ошибка при загрузке изображений');
    }
  };

  // Обновленная функция отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      alert('Необходимо авторизоваться');
      navigate('/login');
      return;
    }

    if (!itemData.category) {
      alert('Пожалуйста, выберите категорию товара');
      return;
    }

    try {
      const newItem = {
        id: nanoid(),
        text: itemData.title,
        price: Number(itemData.price),
        img: itemData.images[0],
        detailImg: itemData.images[0],
        description: itemData.description,
        category: itemData.category,
        specifications: itemData.specifications,
        isPublished: true,
        publishedBy: currentUser.id,
        createdAt: new Date().toISOString()
      };

      dispatch(publishItem(newItem));
      dispatch(updateProfile({
        ...currentUser,
        publishedItems: [...(currentUser.publishedItems || []), newItem]
      }));

      alert('Товар успешно опубликован!');
      navigate('/profile');
      
    } catch (error) {
      console.error('Ошибка публикации:', error);
      alert('Произошла ошибка при публикации товара');
    }
  };

  const handleAddSpecification = useCallback(() => {
    if (newSpecification.name.trim() && newSpecification.value.trim()) {
      setItemData(prev => ({
        ...prev,
        specifications: [...prev.specifications, { 
          id: nanoid(),
          name: newSpecification.name.trim(), 
          value: newSpecification.value.trim() 
        }]
      }));
      setNewSpecification({ name: '', value: '' });
    }
  }, [newSpecification]);

  const handleRemoveSpecification = useCallback((id) => {
    setItemData(prev => ({
      ...prev,
      specifications: prev.specifications.filter(spec => spec.id !== id)
    }));
  }, []);

  const handleInputChange = useCallback((field, value) => {
    setItemData(prev => ({ ...prev, [field]: value }));
  }, []);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  return (
    <>
      <Header />
      <main className={`${s.container} ${s[theme]}`}>
        <h1 className={s.title}>Публикация товара</h1>
        <form className={s.form} onSubmit={handleSubmit}>
          <div className={s.imageSection}>
            <label className={s.fileInputLabel}>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className={s.fileInput}
              />
              <UploadIcon />
              Выберите изображения
            </label>
            <ImagePreview images={itemData.images} />
          </div>

          <div className={s.infoSection}>
            <div className={s.formGroup}>
              <label>Название товара</label>
              <input
                type="text"
                required
                value={itemData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={s.input}
              />
            </div>

            <div className={s.formGroup}>
              <label>Цена ₽</label>
              <input
                type="number"
                required
                value={itemData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                className={`${s.input} ${s.priceInput}`}
                min="0"
              />
            </div>

            <div className={s.formGroup}>
              <label>Описание</label>
              <textarea
                required
                value={itemData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={s.textarea}
                rows="4"
              />
            </div>

            <div className={s.formGroup}>
              <label>Категория товара</label>
              <div className={s.categorySelector}>
                {Object.entries(CATEGORIES).map(([category, { icon, description }]) => (
                  <div
                    key={category}
                    className={`${s.categoryOption} ${itemData.category === category ? s.selected : ''}`}
                    onClick={() => setItemData(prev => ({ ...prev, category }))}
                  >
                    <div className={s.categoryIcon}>
                      {icon}
                    </div>
                    <div className={s.categoryInfo}>
                      <h3>{category}</h3>
                      <p>{description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={s.formGroup}>
              <label>Характеристики товара</label>
              <div className={s.specificationsContainer}>
                {itemData.specifications.map((spec) => (
                  <div key={spec.id} className={s.specificationTag}>
                    <span className={s.specName}>{spec.name}</span>
                    <span className={s.specValue}>{spec.value}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSpecification(spec.id)}
                      className={s.removeSpecification}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              
              <div className={s.addSpecificationContainer}>
                <input
                  type="text"
                  value={newSpecification.name}
                  onChange={(e) => setNewSpecification(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Характеристика"
                  className={s.specificationInput}
                />
                <input
                  type="text"
                  value={newSpecification.value}
                  onChange={(e) => setNewSpecification(prev => ({ ...prev, value: e.target.value }))}
                  placeholder="Значение"
                  className={s.specificationInput}
                />
                <button
                  type="button"
                  onClick={handleAddSpecification}
                  className={s.addSpecificationButton}
                  disabled={!newSpecification.name.trim() || !newSpecification.value.trim()}
                >
                  +
                </button>
              </div>
            </div>

            <div className={s.buttonGroup}>
              <button type="submit" className={s.submitButton}>
                Опубликовать
              </button>
              <button 
                type="button" 
                onClick={() => navigate('/profile')} 
                className={s.cancelButton}
              >
                Отмена
              </button>
            </div>
          </div>
        </form>
      </main>
      <Footer />
    </>
  );
});

PublishItem.propTypes = {
};

PublishItem.displayName = 'PublishItem';
