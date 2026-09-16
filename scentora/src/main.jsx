import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './styles/global.css';
import './i18n';
import App from './App.jsx';
import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { UserProvider } from './context/UserContext';
import { RecentlyViewedProvider } from './context/RecentlyViewedContext';
import { AdminDataProvider } from './context/AdminDataContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <UserProvider>
          <AdminDataProvider>
            <CartProvider>
              <WishlistProvider>
                <RecentlyViewedProvider>
                  <App />
                </RecentlyViewedProvider>
              </WishlistProvider>
            </CartProvider>
          </AdminDataProvider>
        </UserProvider>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>
);