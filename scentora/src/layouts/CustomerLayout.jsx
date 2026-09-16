import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import CartDrawer from '../components/cart/CartDrawer';
import useScrollToTop from '../hooks/useScrollToTop';

export default function CustomerLayout() {
  useScrollToTop();
  return (
    <div className="site">
      <Header />
      <CartDrawer />
      <main id="main" className="site__main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}