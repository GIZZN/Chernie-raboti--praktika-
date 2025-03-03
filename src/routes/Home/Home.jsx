import { memo, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import { Header } from "../../components/Header/Header";
import { Footer } from "../../components/Footer/Footer";
import BuilderImage from "../../assets/Nigger.png";
import StarIcon from "../../assets/StarIcon.png";
import s from "./Home.module.css";

const ToolIcon = memo(() => (
  <svg className={s.featureIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" 
      stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
));

const DeliveryIcon = memo(() => (
  <svg className={s.featureIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 17h14M5 12h14M5 7h14" stroke="#FFD700" strokeWidth="2" strokeLinecap="round"/>
    <path d="M17 3l4 4-4 4" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
));

const PriceIcon = memo(() => (
  <svg className={s.featureIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H7" 
      stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
));

const FeatureCard = memo(({ Icon, title, description }) => (
  <div className={s.featureCard}>
    <div className={s.featureIconWrapper}>
      <Icon />
    </div>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
));

FeatureCard.propTypes = {
  Icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
};

const ReviewCard = memo(({ stars, text }) => (
  <div className={s.reviewCard}>
    <div className={s.stars}>
      {[...Array(stars)].map((_, i) => (
        <img key={i} src={StarIcon} alt="Звезда" />
      ))}
    </div>
    <p className={s.reviewText}>{text}</p>
  </div>
));

ReviewCard.propTypes = {
  stars: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired
};

const features = [
  {
    Icon: ToolIcon,
    title: "Качественные инструменты",
    description: "Только проверенные бренды и надежные поставщики"
  },
  {
    Icon: DeliveryIcon,
    title: "Быстрая доставка",
    description: "Доставляем по всей России в кратчайшие сроки"
  },
  {
    Icon: PriceIcon,
    title: "Выгодные цены",
    description: "Лучшие цены на рынке строительных материалов"
  }
];

const reviews = [
  { stars: 5, text: "Отличный магазин, всё пришло вовремя. Инструменты качественные и надёжные." },
  { stars: 4, text: "Хороший выбор и адекватные цены. Единственное — хотелось бы быстрее доставку." },
  { stars: 5, text: "Магазин супер! Очень дружелюбный персонал и быстрое обслуживание." }
];

export const Home = memo(() => {
  const lineRef = useRef(null);
  const aboutRef = useRef(null);
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const reviewsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(s.animate);
          }
        });
      },
      { threshold: 0.1 }
    );

    [lineRef, aboutRef, heroRef, featuresRef, reviewsRef].forEach(ref => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className={s.wrapper}>
      <Header />
      <main className={s.main}>
        <section className={`${s.hero} ${s.fadeInUp}`} ref={heroRef}>
          <div className={s.heroContent}>
            <h1 className={s.title}>Строительные материалы и инструменты</h1>
            <p className={s.subtitle}>Качество, проверенное временем</p>
            <div className={s.line} ref={lineRef}></div>
            <Link to="/tovari" className={s.ctaButton}>
              Перейти к товарам
            </Link>
          </div>
          <div className={s.imageWrapper}>
            <img className={s.image} src={BuilderImage} alt="Строитель" />
          </div>
        </section>

        <section className={`${s.features} ${s.fadeInLeft}`} ref={featuresRef}>
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              Icon={feature.Icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </section>

        <section className={`${s.reviewsSection} ${s.fadeInRight}`} ref={reviewsRef}>
          <h2 className={s.reviewsTitle}>Отзывы наших клиентов</h2>
          <div className={s.reviews}>
            {reviews.map((review, index) => (
              <ReviewCard
                key={index}
                stars={review.stars}
                text={review.text}
              />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
});

Home.displayName = 'Home';
