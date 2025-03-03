import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Home } from './routes/Home/Home';
import { Tovari } from './routes/Tovari/Tovari';
import { Profile } from './routes/Profile/Profile';
import { Cart } from './routes/Cart/Cart';
import { Login } from './routes/Login/LogIn';
import { Registration } from './routes/Registration/Registration';
import { TovarDetails } from './components/TovarDetails/TovarDetails';
import { SearchResults } from './routes/poisk/SearchResults';
import { PublishItem } from './routes/PublishItem/PublishItem';
import ErrorBoundary from './components/ErrorBoundary';
import { Favorites } from './routes/Favorites/Favorites';

const validateUrl = (url) => {
  const sqlInjectionPattern = /['";=]|UNION|SELECT|FROM|WHERE/i;
  return !sqlInjectionPattern.test(url);
};

let router = createBrowserRouter([
  {
    path: '/',
    element: <ErrorBoundary><Home /></ErrorBoundary>,
    errorElement: <ErrorBoundary><h1>404 - Страница не найдена</h1></ErrorBoundary>
  },
  {
    path: '/login',
    element: <ErrorBoundary><Login /></ErrorBoundary>
  },
  {
    path: '/registration',
    element: <ErrorBoundary><Registration /></ErrorBoundary>
  },
  {
    path: '/tovari',
    element: <ErrorBoundary><Tovari /></ErrorBoundary>
  },
  {
    path: '/profile',
    element: <ErrorBoundary><Profile /></ErrorBoundary>
  },
  {
    path: '/cart',
    element: <ErrorBoundary><Cart /></ErrorBoundary>
  },
  {
    path: '/tovar/:id',
    element: <ErrorBoundary><TovarDetails /></ErrorBoundary>,
    loader: ({ params }) => {
      if (!validateUrl(params.id)) {
        throw new Error('Недопустимый URL');
      }
      return null;
    }
  },
  {
    path: '/search/:query',
    element: <ErrorBoundary><SearchResults /></ErrorBoundary>,
    loader: ({ params }) => {
      if (!validateUrl(params.query)) {
        throw new Error('Недопустимый поисковый запрос');
      }
      return null;
    }
  },
  {
    path: '/publish',
    element: <ErrorBoundary><PublishItem /></ErrorBoundary>
  },
  {
    path: '/favorites',
    element: <ErrorBoundary><Favorites /></ErrorBoundary>
  },
  {
    path: '*',
    element: (
      <ErrorBoundary>
        <div style={{ 
          textAlign: 'center', 
          padding: '2rem',
          maxWidth: '600px',
          margin: '2rem auto' 
        }}>
          <h1 style={{ color: '#e74c3c' }}>404 - Страница не найдена</h1>
          <p style={{ color: '#666', marginBottom: '2rem' }}>
            Извините, запрашиваемая страница не существует.
          </p>
          <button 
            onClick={() => window.location.href = '/'} 
            style={{
              background: '#3498db',
              color: 'white',
              border: 'none',
              padding: '0.8rem 1.5rem',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Вернуться на главную
          </button>
        </div>
      </ErrorBoundary>
    )
  }
]);

export function App() {
  return <RouterProvider router={router} />;
}