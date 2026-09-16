import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import Breadcrumbs from '../components/common/Breadcrumbs';
import {
  FormField,
  SelectField,
  CheckboxField,
} from '../components/common/FormField';
import {
  LockIcon,
  CardIcon,
  WalletIcon,
  TruckIcon,
  CheckIcon,
  ArrowRight,
  ArrowLeft,
  GiftIcon,
} from '../components/common/icons';
import { formatPrice } from '../utils/helpers';
import { cx } from '../utils/helpers';

const STEPS = [
  { id: 'contact', label: 'Contact' },
  { id: 'shipping', label: 'Delivery' },
  { id: 'payment', label: 'Payment' },
  { id: 'review', label: 'Review' },
];

const INITIAL = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  apartment: '',
  city: '',
  postal: '',
  country: 'United States',
  state: '',
  shippingMethod: 'standard',
  giftWrap: false,
  giftNote: '',
  paymentMethod: 'card',
  cardNumber: '',
  cardName: '',
  cardExpiry: '',
  cardCvc: '',
  notes: '',
};

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { success } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [placing, setPlacing] = useState(false);

  const discount = 0;
  const shippingCost = form.shippingMethod === 'express' ? 12 : 0;
  const giftFee = form.giftWrap ? 6 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal - discount + shippingCost + giftFee + tax;
  const codFee = form.paymentMethod === 'cod' ? 5 : 0;

  const set = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateStep = (current) => {
    const e = {};
    if (current === 0) {
      if (!form.email.includes('@')) e.email = 'Enter a valid email address';
      if (form.fullName.trim().length < 2) e.fullName = 'Enter your full name';
      if (form.phone.trim().length < 7) e.phone = 'Enter a valid phone number';
    }
    if (current === 1) {
      if (form.address.trim().length < 5) e.address = 'Enter your street address';
      if (!form.city.trim()) e.city = 'Enter your city';
      if (!form.postal.trim()) e.postal = 'Enter your postal code';
      if (!form.country) e.country = 'Select a country';
    }
    if (current === 2) {
      if (form.paymentMethod === 'card') {
        if (form.cardNumber.replace(/\s/g, '').length < 15) e.cardNumber = 'Invalid card number';
        if (!form.cardName.trim()) e.cardName = 'Name on card is required';
        if (!/^(0[1-9]|1[0-2])\s?\/\s?\d{2}$/.test(form.cardExpiry)) e.cardExpiry = 'MM/YY';
        if (form.cardCvc.length < 3) e.cardCvc = 'Invalid CVC';
      }
    }
    return e;
  };

  const next = () => {
    const e = validateStep(step);
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const back = () => setStep((s) => Math.max(s - 1, 0));

  const placeOrder = () => {
    setPlacing(true);
    setTimeout(() => {
      const order = {
        id: `SCN-${Math.floor(10000 + Math.random() * 89999)}`,
        placedAt: new Date().toISOString(),
        status: 'Processing',
        items,
        totals: { subtotal, shipping: shippingCost, tax, giftWrap: giftFee, total: total + codFee },
        payment: { method: form.paymentMethod === 'card' ? 'Credit Card' : 'Cash on Delivery' },
        shipping: {
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          line1: form.address,
          line2: form.apartment,
          city: form.city,
          postal: form.postal,
          country: form.country,
          method: form.shippingMethod,
          giftWrap: form.giftWrap,
          giftNote: form.giftNote,
        },
      };
      const existing = JSON.parse(localStorage.getItem('scentora_orders_v1') || '[]');
      localStorage.setItem('scentora_orders_v1', JSON.stringify([order, ...existing]));
      clearCart();
      success('Order placed successfully!');
      navigate('/order-success', { state: { order } });
    }, 1200);
  };

  const cardNumberFormatted = form.cardNumber
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, '$1 ');

  const orderItemsPreview = useMemo(
    () =>
      items.slice(0, 4).map((i) => (
        <div className="checkout-item" key={`${i.id}-${i.size}`}>
          <img src={i.image} alt={i.name} />
          <div>
            <p>{i.name}</p>
            <span>
              {i.size} ml · Qty {i.quantity}
            </span>
          </div>
          <strong>{formatPrice(i.price * i.quantity)}</strong>
        </div>
      )),
    [items]
  );

  return (
    <div className="container container--page">
      <Breadcrumbs items={[{ label: 'Checkout' }]} />

      <div className="checkout">
        <div className="checkout__main">
          <h1 className="page-title">Checkout</h1>

          <ol className="checkout-steps" aria-label="Checkout progress">
            {STEPS.map((s, i) => (
              <li
                key={s.id}
                className={cx(
                  i === step && 'is-active',
                  i < step && 'is-done',
                  i === step && i === STEPS.length - 1 && 'is-last'
                )}
              >
                <span className="checkout-steps__num">
                  {i < step ? <CheckIcon width={14} height={14} /> : i + 1}
                </span>
                <span className="checkout-steps__label">{s.label}</span>
              </li>
            ))}
          </ol>

          <div className="checkout__panel">
            {step === 0 && (
              <div className="checkout-form">
                <h2>Contact information</h2>
                <FormField
                  label="Full name"
                  name="fullName"
                  value={form.fullName}
                  onChange={set('fullName')}
                  placeholder="Olivia Martin"
                  required
                  error={errors.fullName}
                />
                <FormField
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={set('email')}
                  placeholder="you@example.com"
                  required
                  error={errors.email}
                />
                <FormField
                  label="Phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={set('phone')}
                  placeholder="+1 555 000 0000"
                  required
                  error={errors.phone}
                />
              </div>
            )}

            {step === 1 && (
              <div className="checkout-form">
                <h2>Delivery</h2>
                <FormField
                  label="Street address"
                  name="address"
                  value={form.address}
                  onChange={set('address')}
                  placeholder="128 Mercer Street"
                  required
                  error={errors.address}
                />
                <FormField
                  label="Apartment, suite (optional)"
                  name="apartment"
                  value={form.apartment}
                  onChange={set('apartment')}
                  placeholder="Apt 4B"
                />
                <div className="checkout-form__row">
                  <FormField
                    label="City"
                    name="city"
                    value={form.city}
                    onChange={set('city')}
                    placeholder="New York"
                    required
                    error={errors.city}
                  />
                  <FormField
                    label="Postal code"
                    name="postal"
                    value={form.postal}
                    onChange={set('postal')}
                    placeholder="10012"
                    required
                    error={errors.postal}
                  />
                </div>
                <div className="checkout-form__row">
                  <SelectField
                    label="Country"
                    name="country"
                    value={form.country}
                    onChange={set('country')}
                    options={['United States', 'Canada', 'United Kingdom', 'France', 'Germany', 'Italy', 'Spain', 'Australia', 'United Arab Emirates', 'Japan', 'Singapore', 'Brazil']}
                  />
                  <FormField
                    label="State / Province"
                    name="state"
                    value={form.state}
                    onChange={set('state')}
                    placeholder="NY"
                  />
                </div>

                <div className="delivery-options" role="radiogroup" aria-label="Delivery method">
                  <label className={cx('delivery-option', form.shippingMethod === 'standard' && 'is-active')}>
                    <input
                      type="radio"
                      name="shipping"
                      checked={form.shippingMethod === 'standard'}
                      onChange={() => setForm((p) => ({ ...p, shippingMethod: 'standard' }))}
                    />
                    <TruckIcon width={20} height={20} />
                    <div>
                      <strong>Standard · Free</strong>
                      <span>3–5 business days</span>
                    </div>
                  </label>
                  <label className={cx('delivery-option', form.shippingMethod === 'express' && 'is-active')}>
                    <input
                      type="radio"
                      name="shipping"
                      checked={form.shippingMethod === 'express'}
                      onChange={() => setForm((p) => ({ ...p, shippingMethod: 'express' }))}
                    />
                    <TruckIcon width={20} height={20} />
                    <div>
                      <strong>Express · $12</strong>
                      <span>1–2 business days</span>
                    </div>
                  </label>
                </div>

                <div className="gift-options">
                  <CheckboxField
                    label="This is a gift — add complementary wrapping ($6)"
                    name="giftWrap"
                    checked={form.giftWrap}
                    onChange={(e) => setForm((p) => ({ ...p, giftWrap: e.target.checked }))}
                  />
                  {form.giftWrap && (
                    <FormField
                      label="Gift note"
                      name="giftNote"
                      value={form.giftNote}
                      onChange={set('giftNote')}
                      placeholder="To Olivia — with all my love"
                    />
                  )}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="checkout-form">
                <h2>Payment</h2>
                <div className="payment-methods" role="radiogroup" aria-label="Payment method">
                  <label className={cx('payment-method', form.paymentMethod === 'card' && 'is-active')}>
                    <input
                      type="radio"
                      name="payment"
                      checked={form.paymentMethod === 'card'}
                      onChange={() => setForm((p) => ({ ...p, paymentMethod: 'card' }))}
                    />
                    <CardIcon width={20} height={20} />
                    <div>
                      <strong>Credit / Debit Card</strong>
                      <span>Visa · Mastercard · Amex</span>
                    </div>
                  </label>
                  <label className={cx('payment-method', form.paymentMethod === 'cod' && 'is-active')}>
                    <input
                      type="radio"
                      name="payment"
                      checked={form.paymentMethod === 'cod'}
                      onChange={() => setForm((p) => ({ ...p, paymentMethod: 'cod' }))}
                    />
                    <WalletIcon width={20} height={20} />
                    <div>
                      <strong>Cash on Delivery · $5</strong>
                      <span>Pay when your order arrives</span>
                    </div>
                  </label>
                </div>

                {form.paymentMethod === 'card' ? (
                  <div className="card-form">
                    <FormField
                      label="Card number"
                      name="cardNumber"
                      value={cardNumberFormatted}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          cardNumber: e.target.value.replace(/\D/g, '').slice(0, 16),
                        }))
                      }
                      placeholder="4242 4242 4242 4242"
                      inputMode="numeric"
                      error={errors.cardNumber}
                    />
                    <FormField
                      label="Name on card"
                      name="cardName"
                      value={form.cardName}
                      onChange={set('cardName')}
                      placeholder="Olivia Martin"
                      error={errors.cardName}
                    />
                    <div className="checkout-form__row">
                      <FormField
                        label="Expiry"
                        name="cardExpiry"
                        value={form.cardExpiry}
                        onChange={(e) => {
                          let v = e.target.value.replace(/\D/g, '').slice(0, 4);
                          if (v.length > 2) v = `${v.slice(0, 2)}/${v.slice(2)}`;
                          setForm((p) => ({ ...p, cardExpiry: v }));
                        }}
                        placeholder="MM/YY"
                        error={errors.cardExpiry}
                      />
                      <FormField
                        label="CVC"
                        name="cardCvc"
                        type="password"
                        value={form.cardCvc}
                        onChange={(e) => setForm((p) => ({ ...p, cardCvc: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                        placeholder="123"
                        error={errors.cardCvc}
                      />
                    </div>
                    <p className="card-form__secure">
                      <LockIcon width={13} height={13} /> Your payment details are encrypted end-to-end.
                    </p>
                  </div>
                ) : (
                  <p className="cod-note">
                    You'll pay <strong>{formatPrice(total + codFee)}</strong> in cash or card
                    on delivery. A small logistics fee of $5 applies.
                  </p>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="checkout-form checkout-review">
                <h2>Review your order</h2>
                <div className="checkout-review__blocks">
                  <div>
                    <span>Contact</span>
                    <p>{form.fullName}</p>
                    <p>{form.email}</p>
                    <p>{form.phone}</p>
                  </div>
                  <div>
                    <span>Ship to</span>
                    <p>{form.address} {form.apartment}</p>
                    <p>{form.city}, {form.postal} {form.state}</p>
                    <p>{form.country}</p>
                  </div>
                  <div>
                    <span>Delivery</span>
                    <p>{form.shippingMethod === 'express' ? 'Express ($12)' : 'Standard (Free)'}</p>
                    <p>{form.paymentMethod === 'card' ? `Card ending ${form.cardNumber.slice(-4) || '••••'}` : 'Cash on Delivery'}</p>
                    {form.giftWrap && <p>Gift wrap + note</p>}
                  </div>
                </div>
                <div className="checkout-review__items">
                  {orderItemsPreview}
                  {items.length > 4 && <p className="checkout-review__more">+{items.length - 4} more items</p>}
                </div>
              </div>
            )}
          </div>

          <div className="checkout__nav">
            {step > 0 && (
              <button className="btn btn--ghost" onClick={back}>
                <ArrowLeft width={15} height={15} /> Back
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button className="btn btn--primary" onClick={next}>
                Continue <ArrowRight width={15} height={15} />
              </button>
            ) : (
              <button className="btn btn--dark" onClick={placeOrder} disabled={placing}>
                <LockIcon width={15} height={15} />
                {placing ? 'Placing order…' : `Place order · ${formatPrice(total + codFee)}`}
              </button>
            )}
          </div>
        </div>

        <aside className="checkout__summary">
          <h2>Order Summary</h2>
          <div className="checkout__items-preview">{orderItemsPreview}</div>
          <div className="checkout__rows">
            <div><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div>
            <div><span>Shipping</span><strong>{shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}</strong></div>
            {giftFee > 0 && <div><span>Gift wrap</span><strong>{formatPrice(giftFee)}</strong></div>}
            {form.paymentMethod === 'cod' && <div><span>COD fee</span><strong>{formatPrice(codFee)}</strong></div>}
            <div><span>Estimated tax</span><strong>{formatPrice(tax)}</strong></div>
            <div className="checkout__total"><span>Total</span><strong>{formatPrice(total + codFee)}</strong></div>
          </div>
          <p className="checkout__secure">
            <LockIcon width={12} height={12} /> 100% secure checkout
          </p>
        </aside>
      </div>
    </div>
  );
}