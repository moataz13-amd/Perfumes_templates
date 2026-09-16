import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../context/ToastContext';
import {
  CheckIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  InstagramIcon,
  TikTokIcon,
  WhatsAppIcon,
  ShieldIcon,
  TruckIcon,
  RotateIcon,
  LockIcon,
} from '../common/icons';

export default function Footer() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language || 'en';
  const { success } = useToast();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const subscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    success(currentLang === 'ar' ? 'أهلاً بك في سكَنتورا — تحقق من بريدك الإلكتروني!' : 'Welcome to SCENTORA — check your inbox!');
    setEmail('');
  };

  const columns = [
    {
      title: t('footer.namespace_shop'),
      links: [
        { label: t('footer.allFragrances'), to: '/shop' },
        { label: t('nav.men'), to: '/shop?gender=Men' },
        { label: t('nav.women'), to: '/shop?gender=Women' },
        { label: t('nav.unisex'), to: '/shop?gender=Unisex' },
        { label: t('shop.titleNiche'), to: '/shop?category=Niche' },
        { label: t('footer.giftSets'), to: '/shop?category=Gift%20Sets' },
      ],
    },
    {
      title: t('footer.namespace_collections'),
      links: [
        { label: t('footer.newArrivals'), to: '/shop?sort=Newest' },
        { label: t('footer.bestSellers'), to: '/shop?sort=Best Selling' },
        { label: t('nav.sale'), to: '/shop?sale=1' },
        { label: t('nav.brands'), to: '/brands' },
      ],
    },
    {
      title: t('footer.namespace_company'),
      links: [
        { label: t('footer.aboutUs'), to: '/about' },
        { label: t('footer.contact'), to: '/contact' },
        { label: t('footer.faq'), to: '/faq' },
        { label: t('footer.blog'), to: '/about' },
        { label: t('footer.careers'), to: '/about' },
      ],
    },
    {
      title: t('footer.namespace_support'),
      links: [
        { label: t('footer.shippingReturns'), to: '/shipping-returns' },
        { label: t('footer.orderTracking'), to: '/account/orders' },
        { label: t('footer.privacyPolicy'), to: '/privacy-policy' },
        { label: t('footer.termsOfService'), to: '/terms' },
      ],
    },
  ];

  const trustBadges = [
    {
      icon: <ShieldIcon width={22} height={22} />,
      title: currentLang === 'ar' ? 'عطور أصلية 100%' : '100% Authentic',
      desc: currentLang === 'ar' ? 'مستوردة مباشرة من الماركات العالمية' : 'Direct from official boutique desks',
    },
    {
      icon: <TruckIcon width={22} height={22} />,
      title: currentLang === 'ar' ? 'شحن سريع ومجاني' : 'Express Free Shipping',
      desc: currentLang === 'ar' ? 'للطلبات أكثر من 100 دولار' : 'On all orders over $100',
    },
    {
      icon: <RotateIcon width={22} height={22} />,
      title: currentLang === 'ar' ? 'استبدال خلال 30 يوم' : '30-Day Easy Exchange',
      desc: currentLang === 'ar' ? 'سياسة إرجاع مرنة وبسيطة' : 'Hassle-free return experience',
    },
    {
      icon: <LockIcon width={22} height={22} />,
      title: currentLang === 'ar' ? 'دفع آمن ومشفّر' : '100% Secure Checkout',
      desc: currentLang === 'ar' ? 'حماية شاملة لجميع البيانات' : 'SSL 256-bit encrypted protocol',
    },
  ];

  return (
    <footer className="footer">
      {/* Newsletter Section */}
      <div className="footer__newsletter">
        <div className="container">
          <div className="footer__newsletter-card">
            <div className="footer__newsletter-content">
              <h3>{t('footer.newsletterTitle')}</h3>
              <p>{t('footer.newsletterText')}</p>
            </div>
            {subscribed ? (
              <div className="footer__newsletter-done">
                <CheckIcon width={20} height={20} />
                <span>{t('footer.newsletterDone')}</span>
              </div>
            ) : (
              <form className="footer__newsletter-form" onSubmit={subscribe}>
                <div className="footer__newsletter-input-wrap">
                  <MailIcon className="footer__newsletter-icon" width={18} height={18} />
                  <input
                    type="email"
                    required
                    placeholder={t('footer.newsletterEmail')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-label={t('footer.newsletterEmail')}
                  />
                </div>
                <button className="btn btn--secondary" type="submit">
                  {t('common.subscribe')}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Trust Badges Bar */}
      <div className="footer__trust-bar">
        <div className="container">
          <div className="footer__trust-grid">
            {trustBadges.map((badge, idx) => (
              <div className="trust-item" key={idx}>
                <div className="trust-item__icon">{badge.icon}</div>
                <div className="trust-item__text">
                  <strong>{badge.title}</strong>
                  <small>{badge.desc}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="footer__main">
        <div className="container">
          <div className="footer__grid">
            <div className="footer__brand">
              <Link to="/" className="footer__logo">
                SCENTORA
              </Link>
              <p className="footer__tagline">{t('common.tagline')}</p>
              <p className="footer__about">{t('footer.aboutText')}</p>

              <div className="footer__contact-info">
                <p className="footer__contact-item">
                  <MapPinIcon width={16} height={16} />
                  <span>112 Madison Avenue, New York, NY 10016</span>
                </p>
                <p className="footer__contact-item">
                  <PhoneIcon width={16} height={16} />
                  <a href="tel:+12125550199">+1 (212) 555-0199</a>
                </p>
                <p className="footer__contact-item">
                  <MailIcon width={16} height={16} />
                  <a href="mailto:concierge@scentora.com">concierge@scentora.com</a>
                </p>
              </div>

              <div className="footer__socials" aria-label="Social media links">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-badge">
                  <InstagramIcon width={18} height={18} />
                </a>
                <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="social-badge">
                  <TikTokIcon width={18} height={18} />
                </a>
                <a href="https://wa.me/12125550199" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="social-badge">
                  <WhatsAppIcon width={18} height={18} />
                </a>
              </div>
            </div>

            {columns.map((col) => (
              <nav className="footer__col" key={col.title} aria-label={col.title}>
                <h4 className="footer__col-title">{col.title}</h4>
                <ul className="footer__links">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link to={link.to}>{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer__bottom">
        <div className="container">
          <div className="footer__bottom-inner">
            <p className="footer__copyright">
              {t('footer.rights', { year: new Date().getFullYear() })}
            </p>
            <p className="footer__note">{t('footer.disclaimer')}</p>
            <div className="footer__payments" aria-label="Accepted payment methods">
              <span className="payment-chip">VISA</span>
              <span className="payment-chip">MASTERCARD</span>
              <span className="payment-chip">AMEX</span>
              <span className="payment-chip">APPLE PAY</span>
              <span className="payment-chip">MADA</span>
              <span className="payment-chip">COD</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}