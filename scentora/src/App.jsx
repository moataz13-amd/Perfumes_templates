import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CustomerLayout from './layouts/CustomerLayout';
import AccountLayout from './layouts/AccountLayout';
import AdminLayout from './layouts/AdminLayout';

import Home from './pages/Home';
import Shop from './pages/Shop';
import { NewArrivals, BestSellers, Sale } from './pages/Collections';
import ProductDetails from './pages/ProductDetails';
import Brands from './pages/Brands';
import BrandDetails from './pages/BrandDetails';
import SearchPage from './pages/SearchPage';
import CartPage from './pages/CartPage';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Wishlist from './pages/WishlistPage';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import ShippingReturns from './pages/ShippingReturns';
import { PrivacyPolicy, Terms } from './pages/Legal';
import NotFound from './pages/NotFound';

import Login from './pages/account/Login';
import Register from './pages/account/Register';
import ForgotPassword from './pages/account/ForgotPassword';
import Logout from './pages/account/Logout';
import AccountDashboard from './pages/account/AccountDashboard';
import OrdersList from './pages/account/OrdersList';
import OrderDetails from './pages/account/OrderDetails';
import AccountWishlist from './pages/account/AccountWishlist';
import Addresses from './pages/account/Addresses';
import Profile from './pages/account/Profile';
import ChangePassword from './pages/account/ChangePassword';

import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminBrands from './pages/admin/AdminBrands';
import AdminInventory from './pages/admin/AdminInventory';
import AdminOrders from './pages/admin/AdminOrders';
import AdminOrderDetail from './pages/admin/AdminOrderDetail';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminCoupons from './pages/admin/AdminCoupons';
import AdminReviews from './pages/admin/AdminReviews';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminContent from './pages/admin/AdminContent';
import AdminSettings from './pages/admin/AdminSettings';

function GenderRedirect({ gender }) {
  return <Navigate to={`/shop?gender=${gender}`} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/men" element={<GenderRedirect gender="Men" />} />
        <Route path="/women" element={<GenderRedirect gender="Women" />} />
        <Route path="/unisex" element={<GenderRedirect gender="Unisex" />} />
        <Route path="/new-arrivals" element={<NewArrivals />} />
        <Route path="/best-sellers" element={<BestSellers />} />
        <Route path="/sale" element={<Sale />} />
        <Route path="/product/:slug" element={<ProductDetails />} />
        <Route path="/brands" element={<Brands />} />
        <Route path="/brand/:brand" element={<BrandDetails />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/shipping-returns" element={<ShippingReturns />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route element={<AccountLayout />}>
        <Route path="/account" element={<AccountDashboard />} />
        <Route path="/account/orders" element={<OrdersList />} />
        <Route path="/account/orders/:orderId" element={<OrderDetails />} />
        <Route path="/account/wishlist" element={<AccountWishlist />} />
        <Route path="/account/addresses" element={<Addresses />} />
        <Route path="/account/profile" element={<Profile />} />
        <Route path="/account/change-password" element={<ChangePassword />} />
        <Route path="/logout" element={<Logout />} />
      </Route>

      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/products/new" element={<AdminProductForm />} />
        <Route path="/admin/products/:id/edit" element={<AdminProductForm />} />
        <Route path="/admin/brands" element={<AdminBrands />} />
        <Route path="/admin/inventory" element={<AdminInventory />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/orders/:id" element={<AdminOrderDetail />} />
        <Route path="/admin/customers" element={<AdminCustomers />} />
        <Route path="/admin/coupons" element={<AdminCoupons />} />
        <Route path="/admin/reviews" element={<AdminReviews />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/admin/content" element={<AdminContent />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}