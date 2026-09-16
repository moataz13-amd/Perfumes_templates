import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import QuantitySelector from '../common/QuantitySelector';
import { CloseIcon, TrashIcon, ArrowRight, LockIcon } from '../common/icons';
import { cx, formatPrice } from '../../utils/helpers';
import { coupons } from '../../data/reviews';

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    subtotal,
    clearCart,
  } = useCart();
  const { success } = useToast();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && closeCart();
    if (isOpen) {
      document.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, closeCart]);

  useEffect(() => {
    if (!isOpen) {
      setAppliedCoupon(null);
      setCouponCode('');
      setCouponError('');
    }
  }, [isOpen]);

  const discountValue = appliedCoupon
    ? appliedCoupon.type === 'percent'
      ? (subtotal * appliedCoupon.value) / 100
      : Math.min(appliedCoupon.value, subtotal)
    : 0;

  const shipping = subtotal - discountValue >= 100 || subtotal - discountValue === 0 ? 0 : 12;
  const tax = subtotal - discountValue > 0 ? (subtotal - discountValue) * 0.08 : 0;
  const total = subtotal - discountValue + shipping + tax;

  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    const coupon = coupons.find(
      (c) => c.code.toUpperCase() === code && c.status === 'active'
    );
    if (!coupon) {
      setCouponError('Invalid or inactive coupon code.');
      return;
    }
    if (subtotal < coupon.minOrder) {
      setCouponError(`Minimum order of $${coupon.minOrder.toFixed(2)} required.`);
      return;
    }
    setAppliedCoupon(coupon);
    setCouponError('');
    success(`Coupon ${coupon.code} applied`);
  };

  const goCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <div className={cx('cart-drawer', isOpen && 'is-open')} aria-hidden={!isOpen}>
      <div className="cart-drawer__backdrop" onClick={closeCart} />
      <aside
        className="cart-drawer__panel"
        role="dialog"
        aria-label="Shopping cart"
        aria-modal="true"
      >
        <div className="cart-drawer__header">
          <h2 className="cart-drawer__title">
            Shopping Bag <span>({items.reduce((s, i) => s + i.quantity, 0)})</span>
          </h2>
          <button className="icon-btn" onClick={closeCart} aria-label="Close cart">
            <CloseIcon />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart-drawer__empty">
            <p className="cart-drawer__empty-icon" aria-hidden="true">✕</p>
            <h3>Your bag is empty</h3>
            <p>Discover your signature scent.</p>
            <Link to="/shop" className="btn btn--primary" onClick={closeCart}>
              Start shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="cart-drawer__items">
              {items.map((item) => (
                <div className="cart-line" key={`${item.id}-${item.size}`}>
                  <Link
                    to={`/product/${item.slug}`}
                    onClick={closeCart}
                    className="cart-line__image"
                  >
                    <img src={item.image} alt={item.name} />
                  </Link>
                  <div className="cart-line__body">
                    <div className="cart-line__top">
                      <div>
                        <p className="cart-line__brand">{item.brand}</p>
                        <Link
                          to={`/product/${item.slug}`}
                          className="cart-line__name"
                          onClick={closeCart}
                        >
                          {item.name}
                        </Link>
                        <p className="cart-line__meta">
                          {item.size} ml · {item.variantLabel || 'Eau de Parfum'}
                        </p>
                      </div>
                      <button
                        className="icon-btn icon-btn--sm"
                        onClick={() => removeItem(item.id, item.size)}
                        aria-label={`Remove ${item.name}`}
                      >
                        <TrashIcon width={16} height={16} />
                      </button>
                    </div>
                    <div className="cart-line__bottom">
                      <QuantitySelector
                        value={item.quantity}
                        onChange={(q) => updateQuantity(item.id, item.size, q)}
                        size="sm"
                      />
                      <span className="cart-line__price">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))}
              <button
                className="cart-drawer__clear"
                onClick={() => {
                  clearCart();
                  success('Cart cleared');
                }}
              >
                Clear cart
              </button>
            </div>

            <div className="cart-drawer__coupon">
              <input
                className="cart-drawer__coupon-input"
                placeholder="Coupon code (try WELCOME15)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                aria-label="Coupon code"
              />
              <button className="btn btn--secondary btn--sm" onClick={applyCoupon}>
                Apply
              </button>
              {couponError && <p className="cart-drawer__coupon-error">{couponError}</p>}
            </div>

            <div className="cart-drawer__summary">
              <div className="cart-drawer__row">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discountValue > 0 && (
                <div className="cart-drawer__row cart-drawer__row--discount">
                  <span>Discount ({appliedCoupon.code})</span>
                  <span>-{formatPrice(discountValue)}</span>
                </div>
              )}
              <div className="cart-drawer__row">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
              </div>
              <div className="cart-drawer__row">
                <span>Estimated tax</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="cart-drawer__row cart-drawer__row--total">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
              {shipping > 0 && (
                <p className="cart-drawer__shipping-notice">
                  Add {formatPrice(100 - subtotal)} more for free shipping.
                </p>
              )}
            </div>

            <div className="cart-drawer__footer">
              <button className="btn btn--primary btn--block" onClick={goCheckout}>
                Checkout <ArrowRight width={16} height={16} />
              </button>
              <Link to="/cart" className="btn btn--ghost btn--block" onClick={closeCart}>
                View full cart
              </Link>
              <p className="cart-drawer__secure">
                <LockIcon width={12} height={12} /> Secure checkout · Encrypted payment
              </p>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}