import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useUser } from '../../context/UserContext';
import {
  SearchIcon,
  UserIcon,
  HeartIcon,
  BagIcon,
  MenuIcon,
  CloseIcon,
  TruckIcon,
  SparkleIcon,
  ShieldIcon,
} from '../common/icons';
import { cx } from '../../utils/helpers';
import { products } from '../../data/products';
import MobileMenu from './MobileMenu';

const QUICK_TAGS = ['Oud', 'Vanilla', 'Chanel', 'Niche', 'Men', 'Gift Sets'];

export default function Header() {
  const { itemsCount, openCart } = useCart();
  const { wishlist } = useWishlist();
  const { user } = useUser();
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  const NAV_ITEMS = [
    { label: t('nav.shop'), to: '/shop' },
    { label: t('nav.brands'), to: '/brands' },
    { label: t('nav.newArrivals'), to: '/shop?sort=Newest' },
    { label: t('nav.bestSellers'), to: '/shop?sort=Best Selling' },
    { label: t('nav.sale'), to: '/shop?sale=1' },
  ];

  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const searchRef = useRef(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setSearchOpen(false);
    setMenuOpen(false);
    setAccountOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }
    const matches = products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.scentFamily.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      )
      .slice(0, 5);
    setSuggestions(matches);
  }, [query]);

  useEffect(() => {
    const onClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
        setQuery('');
        setSuggestions([]);
      }
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const submitSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setQuery('');
    }
  };

  const handleTagClick = (tag) => {
    setQuery(tag);
  };

  const goAccount = () => navigate(user.isAuthenticated ? '/account' : '/login');

  return (
    <header className={cx('header', scrolled && 'is-scrolled')}>
      <div className="announcement">
        <div className="announcement__inner">
          <div className="announcement__item">
            <TruckIcon width={14} height={14} />
            <span>{t('announcement.freeShipping')}</span>
          </div>
          <span className="announcement__separator" aria-hidden="true">•</span>
          <div className="announcement__item announcement__secondary">
            <ShieldIcon width={13} height={13} />
            <span>{currentLang === 'ar' ? 'عطور أصلية 100%' : '100% Authentic Guarantee'}</span>
          </div>
          <span className="announcement__separator" aria-hidden="true">•</span>
          <div className="announcement__item announcement__secondary">
            <SparkleIcon width={13} height={13} />
            <span>{t('announcement.giftWrapping')}</span>
          </div>
        </div>
      </div>

      <div className="header__main">
        <div className="header__left">
          <button
            className="icon-btn header__menu-btn"
            onClick={() => setMenuOpen(true)}
            aria-label={t('header.openMenu')}
          >
            <MenuIcon />
          </button>
          <nav className="header__nav" aria-label="Primary">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cx('header__link', isActive && 'is-active')
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <Link to="/" className="header__logo" aria-label="SCENTORA home">
          <span className="header__logo-text">SCENTORA</span>
          <span className="header__logo-sub">PARFUM</span>
        </Link>

        <div className="header__right">
          <div className="header__search" ref={searchRef}>
            <button
              className="icon-btn"
              onClick={() => setSearchOpen((o) => !o)}
              aria-label="Search"
              aria-expanded={searchOpen}
            >
              <SearchIcon />
            </button>
            <div className={cx('search-overlay', searchOpen && 'is-open')}>
              <form onSubmit={submitSearch} className="search-form">
                <SearchIcon className="search-form__icon" width={18} height={18} />
                <input
                  type="search"
                  autoFocus
                  placeholder={t('search.placeholder')}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label={t('search.placeholder')}
                />
                {query && (
                  <button
                    type="button"
                    className="search-form__clear"
                    onClick={() => setQuery('')}
                    aria-label="Clear search"
                  >
                    <CloseIcon width={14} height={14} />
                  </button>
                )}
                <button type="submit" className="btn btn--primary btn--sm">
                  {t('search.submit')}
                </button>
              </form>

              {!query && (
                <div className="search-quick-tags">
                  <span className="search-quick-tags__title">
                    {currentLang === 'ar' ? 'الأكثر بحثاً:' : 'Popular:'}
                  </span>
                  <div className="search-quick-tags__list">
                    {QUICK_TAGS.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        className="search-tag-chip"
                        onClick={() => handleTagClick(tag)}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {suggestions.length > 0 && (
                <ul className="search-results">
                  {suggestions.map((p) => (
                    <li key={p.id}>
                      <Link
                        to={`/product/${p.slug}`}
                        className="search-result"
                        onClick={() => {
                          setSearchOpen(false);
                          setQuery('');
                        }}
                      >
                        <img src={p.images[0]} alt="" width={44} height={44} />
                        <span className="search-result__meta">
                          <strong>{p.name}</strong>
                          <small>
                            {p.brand} · ${p.price}
                          </small>
                        </span>
                        {p.scentFamily && (
                          <span className="search-result__badge">{p.scentFamily}</span>
                        )}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      to={`/search?q=${encodeURIComponent(query)}`}
                      className="search-result search-result--all"
                      onClick={() => setSearchOpen(false)}
                    >
                      {currentLang === 'ar'
                        ? `عرض جميع النتائج لـ "${query}"`
                        : `View all results for “${query}”`}
                    </Link>
                  </li>
                </ul>
              )}
            </div>
          </div>

          <div className="header__account" ref={accountRef}>
            <button
              className="icon-btn"
              onClick={() => setAccountOpen((o) => !o)}
              aria-label={t('header.account')}
              aria-expanded={accountOpen}
            >
              <UserIcon />
            </button>
            {accountOpen && (
              <div className="account-dropdown">
                {user.isAuthenticated ? (
                  <>
                    <div className="account-dropdown__user-card">
                      <div className="account-dropdown__avatar">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div className="account-dropdown__info">
                        <strong>{user.name}</strong>
                        <small>{user.email}</small>
                      </div>
                    </div>
                    <div className="account-dropdown__links">
                      {user.isAdmin && (
                        <Link to="/admin" className="account-dropdown__admin-badge">
                          <SparkleIcon width={14} height={14} /> Admin Dashboard
                        </Link>
                      )}
                      <Link to="/account">{t('header.myAccount')}</Link>
                      <Link to="/account/orders">{t('header.orders')}</Link>
                      <Link to="/account/wishlist">{t('header.wishlistLink')}</Link>
                      <Link to="/logout">{t('header.logout')}</Link>
                    </div>
                  </>
                ) : (
                  <div className="account-dropdown__login">
                    <p>
                      <strong>{currentLang === 'ar' ? 'أهلاً بك في سكَنتورا' : 'Welcome to SCENTORA'}</strong>
                      <small>{currentLang === 'ar' ? 'سجّل دخولك لتجربة تسوق أسرع.' : 'Sign in for a faster checkout.'}</small>
                    </p>
                    <Link to="/login" className="btn btn--primary btn--block">
                      {t('common.signIn')}
                    </Link>
                    <Link to="/register" className="btn btn--ghost btn--block">
                      {currentLang === 'ar' ? 'إنشاء حساب جديد' : 'Create account'}
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          <Link
            to="/wishlist"
            className="icon-btn header__wishlist"
            aria-label={t('header.wishlistLabel')}
          >
            <HeartIcon />
            {wishlist.length > 0 && (
              <span className="header__badge header__badge--pulse">{wishlist.length}</span>
            )}
          </Link>

          <button
            className="icon-btn header__cart"
            onClick={openCart}
            aria-label={t('header.cartLabel')}
          >
            <BagIcon />
            {itemsCount > 0 && <span className="header__badge header__badge--pulse">{itemsCount}</span>}
          </button>

        </div>
      </div>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}