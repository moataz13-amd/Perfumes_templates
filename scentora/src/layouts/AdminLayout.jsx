import React, { useState } from 'react';
import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import {
  ChartIcon,
  BoxIcon,
  PackageIcon,
  UsersIcon,
  TagIcon,
  EyeIcon,
  SettingsIcon,
  BellIcon,
  MenuIcon,
  CloseIcon,
  StoreIcon,
  SearchIcon,
} from '../components/common/icons';
import { cx } from '../utils/helpers';
import useScrollToTop from '../hooks/useScrollToTop';

const SIDEBAR = [
  { group: 'Overview', links: [
    { to: '/admin', label: 'Dashboard', icon: ChartIcon, end: true },
  ]},
  { group: 'Catalog', links: [
    { to: '/admin/products', label: 'Products', icon: BoxIcon },
    { to: '/admin/brands', label: 'Brands', icon: StoreIcon },
    { to: '/admin/inventory', label: 'Inventory', icon: PackageIcon },
  ]},
  { group: 'Sales', links: [
    { to: '/admin/orders', label: 'Orders', icon: PackageIcon },
    { to: '/admin/customers', label: 'Customers', icon: UsersIcon },
  ]},
  { group: 'Marketing', links: [
    { to: '/admin/coupons', label: 'Coupons', icon: TagIcon },
    { to: '/admin/reviews', label: 'Reviews', icon: EyeIcon },
  ]},
  { group: 'Content', links: [
    { to: '/admin/content', label: 'Homepage', icon: StoreIcon },
  ]},
  { group: 'Analytics', links: [
    { to: '/admin/analytics', label: 'Analytics', icon: ChartIcon },
  ]},
  { group: 'Settings', links: [
    { to: '/admin/settings', label: 'Settings', icon: SettingsIcon },
  ]},
];

export default function AdminLayout() {
  const { user } = useUser();
  useScrollToTop();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user.isAuthenticated || !user.isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className={cx('admin-layout', collapsed && 'is-collapsed')}>
      <aside className={cx('admin-sidebar', mobileOpen && 'is-mobile-open')}>
        <div className="admin-sidebar__header">
          <NavLink to="/admin" className="admin-sidebar__logo">
            {collapsed ? 'S' : 'SCENTORA'}
          </NavLink>
          <button
            className="icon-btn admin-sidebar__toggle"
            onClick={() => setCollapsed((c) => !c)}
            aria-label="Toggle sidebar"
          >
            <MenuIcon />
          </button>
        </div>
        <nav className="admin-nav" aria-label="Admin">
          {SIDEBAR.map((group) => (
            <div className="admin-nav__group" key={group.group}>
              {!collapsed && <span className="admin-nav__group-title">{group.group}</span>}
              {group.links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    cx('admin-nav__link', isActive && 'is-active')
                  }
                  onClick={() => setMobileOpen(false)}
                  title={collapsed ? link.label : undefined}
                >
                  <link.icon width={18} height={18} />
                  {!collapsed && <span>{link.label}</span>}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      <div className="admin-main">
        <header className="admin-header">
          <div className="admin-header__left">
            <button
              className="icon-btn admin-header__menu"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle mobile menu"
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
            <div className="admin-header__search">
              <SearchIcon width={16} height={16} />
              <input type="search" placeholder="Search products, orders, customers…" aria-label="Admin search" />
            </div>
          </div>
          <div className="admin-header__right">
            <button className="icon-btn admin-header__bell" aria-label="Notifications">
              <BellIcon />
              <span className="admin-header__badge">3</span>
            </button>
            <div className="admin-header__user">
              <span className="admin-header__avatar">{user.name?.[0] || 'A'}</span>
              <div className="admin-header__user-info">
                <strong>{user.name}</strong>
                <small>Admin</small>
              </div>
            </div>
            <NavLink to="/" className="btn btn--ghost btn--sm admin-header__live">
              View store
            </NavLink>
          </div>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </div>

      {mobileOpen && (
        <div className="admin-overlay" onClick={() => setMobileOpen(false)} />
      )}
    </div>
  );
}