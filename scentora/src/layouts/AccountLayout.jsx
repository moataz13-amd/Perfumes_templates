import React from 'react';
import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useWishlist } from '../context/WishlistContext';
import { demoOrders } from '../data/reviews';
import {
  UserIcon,
  PackageIcon,
  HeartIcon,
  MapPinIcon,
  LogoutIcon,
  LockIcon,
} from '../components/common/icons';
import { cx } from '../utils/helpers';

const LINKS = [
  { to: '/account', label: 'Dashboard', end: true, icon: UserIcon },
  { to: '/account/orders', label: 'Orders', icon: PackageIcon },
  { to: '/account/wishlist', label: 'Wishlist', icon: HeartIcon },
  { to: '/account/addresses', label: 'Addresses', icon: MapPinIcon },
  { to: '/account/profile', label: 'Profile', icon: UserIcon },
  { to: '/account/change-password', label: 'Password', icon: LockIcon },
];

export default function AccountLayout() {
  const { user } = useUser();
  const { wishlist } = useWishlist();

  if (!user.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const orderCount = demoOrders.length;

  return (
    <div className="container container--page">
      <div className="account-layout">
        <aside className="account-sidebar">
          <div className="account-sidebar__user">
            <span className="account-sidebar__avatar" aria-hidden="true">
              {user.name?.[0] || 'S'}
            </span>
            <div className="account-sidebar__user-meta">
              <strong>{user.name}</strong>
              <small>{user.email}</small>
            </div>
          </div>
          <nav className="account-nav" aria-label="Account">
            {LINKS.map(({ to, label, end, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cx('account-nav__link', isActive && 'is-active')
                }
              >
                <Icon width={17} height={17} />
                {label}
                {label === 'Wishlist' && wishlist.length > 0 && (
                  <span className="account-nav__count">{wishlist.length}</span>
                )}
                {label === 'Orders' && orderCount > 0 && (
                  <span className="account-nav__count">{orderCount}</span>
                )}
              </NavLink>
            ))}
          </nav>
          <NavLink to="/logout" className="account-nav__logout">
            <LogoutIcon width={17} height={17} /> Log out
          </NavLink>
        </aside>

        <div className="account-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}