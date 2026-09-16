import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useWishlist } from '../../context/WishlistContext';
import { demoOrders, addressBook } from '../../data/reviews';
import { formatPrice, formatDate } from '../../utils/helpers';
import {
  PackageIcon,
  HeartIcon,
  MapPinIcon,
  ArrowRight,
} from '../../components/common/icons';

export default function AccountDashboard() {
  const { user } = useUser();
  const { wishlist } = useWishlist();

  const lastOrder = demoOrders[0];

  return (
    <div className="account-dash">
      <div className="account-dash__welcome">
        <h1 className="page-title">Hi, {user.name.split(' ')[0]} 👋</h1>
        <p>
          A customer since {new Date(user.customerSince).getFullYear()}. Welcome back to
          SCENTORA.
        </p>
      </div>

      <div className="account-stats">
        <div className="account-stat">
          <span>Orders</span>
          <strong>{demoOrders.length}</strong>
        </div>
        <div className="account-stat">
          <span>Total spent</span>
          <strong>{formatPrice(933)}</strong>
        </div>
        <div className="account-stat">
          <span>Wishlist items</span>
          <strong>{wishlist.length}</strong>
        </div>
        <div className="account-stat">
          <span>Addresses</span>
          <strong>{addressBook.length}</strong>
        </div>
      </div>

      <div className="account-dash__grid">
        <section className="account-card">
          <div className="account-card__head">
            <h3>
              <PackageIcon width={17} height={17} /> Recent orders
            </h3>
            <Link to="/account/orders" className="link-arrow">
              View all <ArrowRight width={13} height={13} />
            </Link>
          </div>
          {lastOrder ? (
            <div className="account-last-orders-list">
              <div className="account-last-order">
                <div className="account-last-order__info">
                  <strong>{lastOrder.id}</strong>
                  <span>{formatDate(lastOrder.placedAt)} · <em className="account-status-tag">{lastOrder.status}</em></span>
                </div>
                <strong className="account-last-order__price">{formatPrice(lastOrder.payment.total)}</strong>
              </div>
              {demoOrders.length > 1 && (
                <div className="account-last-order">
                  <div className="account-last-order__info">
                    <strong>{demoOrders[1].id}</strong>
                    <span>{formatDate(demoOrders[1].placedAt)} · <em className="account-status-tag">{demoOrders[1].status}</em></span>
                  </div>
                  <strong className="account-last-order__price">{formatPrice(demoOrders[1].payment.total)}</strong>
                </div>
              )}
            </div>
          ) : (
            <p className="account-card__empty">No orders yet.</p>
          )}
        </section>

        <section className="account-card">
          <div className="account-card__head">
            <h3>
              <HeartIcon width={17} height={17} /> Your wishlist
            </h3>
            <Link to="/account/wishlist" className="link-arrow">
              View <ArrowRight width={13} height={13} />
            </Link>
          </div>
          {wishlist.length === 0 ? (
            <p className="account-card__empty">
              Your wishlist is empty. <Link to="/shop">Start browsing</Link>.
            </p>
          ) : (
            <div className="account-wishlist-mini">
              {wishlist.slice(0, 3).map((p) => (
                <Link to={`/product/${p.slug}`} key={p.id}>
                  <img src={p.images?.[0] || p.image} alt={p.name} />
                </Link>
              ))}
              {wishlist.length > 3 && <span className="account-wishlist-mini__more">+{wishlist.length - 3}</span>}
            </div>
          )}
        </section>

        <section className="account-card">
          <div className="account-card__head">
            <h3>
              <MapPinIcon width={17} height={17} /> Saved addresses
            </h3>
            <Link to="/account/addresses" className="link-arrow">
              Manage <ArrowRight width={13} height={13} />
            </Link>
          </div>
          <div className="account-address-list">
            {addressBook.map((a) => (
              <div className="account-card__address-item" key={a.id}>
                <strong>{a.label}</strong>
                <span>
                  {a.fullName} · {a.line1}, {a.city} {a.postal}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="account-card account-card--cta">
          <h3>Ready for a new signature?</h3>
          <p>Explore best sellers your peers love right now.</p>
          <Link to="/shop?sort=Best+Selling" className="btn btn--primary btn--sm">
            Shop best sellers
          </Link>
        </section>
      </div>
    </div>
  );
}