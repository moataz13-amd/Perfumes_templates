import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import QuantitySelector from '../components/common/QuantitySelector';
import Breadcrumbs from '../components/common/Breadcrumbs';
import EmptyState from '../components/common/EmptyState';
import {
  TrashIcon,
  ArrowRight,
  LockIcon,
  TruckIcon,
  RefreshIcon,
} from '../components/common/icons';
import { formatPrice } from '../utils/helpers';
import { coupons } from '../data/reviews';
import { getProductById } from '../data/products';

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    updateVariant,
    subtotal,
    clearCart,
  } = useCart();
  const { toggleWishlist } = useWishlist();
  const { success } = useToast();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  const discount = appliedCoupon
    ? appliedCoupon.type === 'percent'
      ? (subtotal * appliedCoupon.value) / 100
      : Math.min(appliedCoupon.value, subtotal)
    : 0;

  const afterDiscount = subtotal - discount;
  const shipping = afterDiscount >= 100 || afterDiscount === 0 ? 0 : 12;
  const tax = afterDiscount > 0 ? afterDiscount * 0.08 : 0;
  const total = afterDiscount + shipping + tax;

  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    const coupon = coupons.find((c) => c.code.toUpperCase() === code && c.status === 'active');
    if (!coupon || subtotal < coupon.minOrder) {
      setCouponError(
        coupon && subtotal < coupon.minOrder
          ? `Minimum order of $${coupon.minOrder.toFixed(2)} required.`
          : 'Invalid or inactive coupon code.'
      );
      return;
    }
    setAppliedCoupon(coupon);
    setCouponError('');
    success(`Coupon ${coupon.code} applied`);
  };

  if (items.length === 0) {
    return (
      <div className="container container--page">
        <Breadcrumbs items={[{ label: 'Cart' }]} />
        <EmptyState
          icon="🛍"
          title="Your bag is empty"
          message="Fill it with something unforgettable."
          actionLabel="Shop fragrances"
          actionTo="/shop"
        />
      </div>
    );
  }

  return (
    <div className="container container--page">
      <Breadcrumbs items={[{ label: 'Cart' }]} />
      <h1 className="page-title">Shopping Cart</h1>

      <div className="cart-layout">
        <div className="cart-layout__main">
          <div className="cart-table">
            <div className="cart-table__head">
              <span>Product</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Total</span>
              <span aria-hidden="true" />
            </div>
            {items.map((item) => {
              const product = getProductById(item.id);
              const variants = product?.size || [item.size];
              return (
                <div className="cart-table__row" key={`${item.id}-${item.size}`}>
                  <div className="cart-table__product">
                    <Link to={`/product/${item.slug}`} className="cart-table__thumb">
                      <img src={item.image} alt={item.name} />
                    </Link>
                    <div>
                      <p className="cart-table__brand">{item.brand}</p>
                      <Link to={`/product/${item.slug}`} className="cart-table__name">
                        {item.name}
                      </Link>
                      <p className="cart-table__meta">Size: {item.size} ml</p>
                      <div className="cart-table__actions">
                        <button
                          className="cart-table__link"
                          onClick={() => {
                            toggleWishlist({ ...product, images: [item.image] });
                            removeItem(item.id, item.size);
                            success('Moved to wishlist');
                          }}
                        >
                          Save for later
                        </button>
                        <button
                          className="cart-table__link"
                          onClick={() => {
                            removeItem(item.id, item.size);
                            success('Removed from cart');
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="cart-table__price">
                    {product?.compareAtPrice ? (
                      <>
                        <span className="price">{formatPrice(item.price)}</span>
                        <span className="price price--compare">
                          {formatPrice(product.compareAtPrice)}
                        </span>
                      </>
                    ) : (
                      <span className="price">{formatPrice(item.price)}</span>
                    )}
                  </div>
                  <div className="cart-table__qty">
                    <QuantitySelector
                      value={item.quantity}
                      onChange={(q) => updateQuantity(item.id, item.size, q)}
                      size="sm"
                    />
                    {variants.length > 1 && (
                      <select
                        value={item.size}
                        onChange={(e) => updateVariant(item.id, item.size, e.target.value)}
                        aria-label="Change size"
                      >
                        {variants.map((v) => (
                          <option key={v} value={v}>
                            {v} ml
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  <div className="cart-table__total">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                  <button
                    className="icon-btn cart-table__remove"
                    onClick={() => removeItem(item.id, item.size)}
                    aria-label={`Remove ${item.name}`}
                  >
                    <TrashIcon width={16} height={16} />
                  </button>
                </div>
              );
            })}
          </div>
          <button className="cart-page__clear" onClick={() => clearCart()}>
            <RefreshIcon width={14} height={14} /> Clear entire cart
          </button>
        </div>

        <aside className="cart-summary">
          <h2 className="cart-summary__title">Order Summary</h2>

          <div className="cart-summary__coupon">
            <input
              placeholder="Coupon code (WELCOME15)"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              aria-label="Coupon code"
            />
            <button onClick={applyCoupon}>Apply</button>
            {couponError && <p className="cart-summary__error">{couponError}</p>}
            {appliedCoupon && (
              <p className="cart-summary__applied">
                {appliedCoupon.code} applied
              </p>
            )}
          </div>

          <div className="cart-summary__rows">
            <div><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div>
            {discount > 0 && (
              <div><span>Discount</span><strong className="is-discount">-{formatPrice(discount)}</strong></div>
            )}
            <div><span>Shipping</span><strong>{shipping === 0 ? 'Free' : formatPrice(shipping)}</strong></div>
            <div><span>Estimated tax</span><strong>{formatPrice(tax)}</strong></div>
            <div className="cart-summary__total"><span>Total</span><strong>{formatPrice(total)}</strong></div>
          </div>

          {shipping > 0 && (
            <p className="cart-summary__notice">
              <TruckIcon width={14} height={14} />
              Add {formatPrice(100 - afterDiscount)} more for free shipping.
            </p>
          )}

          <button
            className="btn btn--primary btn--block btn--lg"
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout <ArrowRight width={16} height={16} />
          </button>
          <Link to="/shop" className="cart-summary__shop">
            Continue shopping
          </Link>
          <p className="cart-summary__secure">
            <LockIcon width={12} height={12} /> Secure 256-bit SSL encrypted checkout
          </p>
        </aside>
      </div>
    </div>
  );
}