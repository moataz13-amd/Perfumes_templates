import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CloseIcon, ChevronDown, WhatsAppIcon, SparkleIcon } from '../common/icons';
import { cx } from '../../utils/helpers';
import { useUser } from '../../context/UserContext';
import { useCart } from '../../context/CartContext';

export default function MobileMenu({ open, onClose }) {
  const { user } = useUser();
  const { itemsCount, openCart } = useCart();
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'en';

  const MENU_GROUPS = [
    {
      label: t('footer.namespace_shop'),
      links: [
        { label: t('footer.allFragrances'), to: '/shop' },
        { label: t('shop.titleNiche'), to: '/shop?category=Niche' },
        { label: t('footer.giftSets'), to: '/shop?category=Gift%20Sets' },
      ],
    },
    {
      label: t('footer.namespace_collections'),
      links: [
        { label: t('nav.newArrivals'), to: '/shop?sort=Newest' },
        { label: t('nav.bestSellers'), to: '/shop?sort=Best Selling' },
        { label: t('nav.sale'), to: '/shop?sale=1' },
        { label: t('nav.brands'), to: '/brands' },
      ],
    },
  ];

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return createPortal(
    <div className={cx('mobile-menu', open && 'is-open')} aria-hidden={!open}>
      <div className="mobile-menu__backdrop" onClick={onClose} />
      <div className="mobile-menu__panel" role="dialog" aria-label="Menu" aria-modal="true">
        <div className="mobile-menu__header">
          <Link to="/" className="header__logo" onClick={onClose}>
            <span className="header__logo-text">SCENTORA</span>
          </Link>
          <div className="mobile-menu__header-actions">
            <button className="icon-btn" onClick={onClose} aria-label="Close menu">
              <CloseIcon />
            </button>
          </div>
        </div>

        {!user.isAuthenticated ? (
          <div className="mobile-menu__auth">
            <Link to="/login" className="btn btn--primary btn--block" onClick={onClose}>
              {t('common.signIn')}
            </Link>
            <Link to="/register" className="btn btn--ghost btn--block" onClick={onClose}>
              {currentLang === 'ar' ? 'إنشاء حساب جديد' : 'Create account'}
            </Link>
          </div>
        ) : (
          <div className="mobile-menu__user">
            <div className="mobile-menu__avatar">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <p className="mobile-menu__user-name">
                <strong>{user.name}</strong>
                <small>{user.email}</small>
              </p>
              <Link
                to={user.isAdmin ? '/admin' : '/account'}
                className="mobile-menu__user-link"
                onClick={onClose}
              >
                {user.isAdmin ? (
                  <span className="text-gold"><SparkleIcon width={12} height={12} /> Admin Dashboard</span>
                ) : (
                  t('header.myAccount')
                )}
              </Link>
            </div>
          </div>
        )}

        <nav className="mobile-menu__nav" aria-label="Mobile Navigation">
          {MENU_GROUPS.map((group) => (
            <div className="mobile-menu__group" key={group.label}>
              <div className="mobile-menu__group-label">
                {group.label}
                <ChevronDown width={14} height={14} />
              </div>
              {group.links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className="mobile-menu__link"
                  onClick={onClose}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          ))}

          <div className="mobile-menu__group">
            <div className="mobile-menu__group-label">
              {t('footer.namespace_support')}
              <ChevronDown width={14} height={14} />
            </div>
            <NavLink to="/wishlist" className="mobile-menu__link" onClick={onClose}>
              {t('header.wishlistLink')}
            </NavLink>
            <NavLink to="/about" className="mobile-menu__link" onClick={onClose}>
              {t('footer.aboutUs')}
            </NavLink>
            <NavLink to="/contact" className="mobile-menu__link" onClick={onClose}>
              {t('footer.contact')}
            </NavLink>
            <NavLink to="/faq" className="mobile-menu__link" onClick={onClose}>
              {t('footer.faq')}
            </NavLink>
            <NavLink to="/shipping-returns" className="mobile-menu__link" onClick={onClose}>
              {t('footer.shippingReturns')}
            </NavLink>
          </div>
        </nav>

        <div className="mobile-menu__footer-actions">
          <a
            href="https://wa.me/12125550199"
            target="_blank"
            rel="noopener noreferrer"
            className="mobile-menu__whatsapp-btn"
          >
            <WhatsAppIcon width={16} height={16} />
            <span>{currentLang === 'ar' ? 'تواصل عبر واتساب' : 'Chat on WhatsApp'}</span>
          </a>

          <button
            className="mobile-menu__cart"
            onClick={() => {
              onClose();
              openCart();
            }}
          >
            <span>{currentLang === 'ar' ? `حقيبة التسوق (${itemsCount})` : `Shopping Bag (${itemsCount})`}</span>
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}