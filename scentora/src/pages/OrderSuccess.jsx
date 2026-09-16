import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckIcon, PackageIcon, TruckIcon, MailIcon } from '../components/common/icons';
import { formatPrice, formatDate } from '../utils/helpers';

export default function OrderSuccess() {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return (
      <div className="container container--page">
        <div className="order-success">
          <PackageIcon width={44} height={44} />
          <h1>Your order is confirmed</h1>
          <p>Thank you. A confirmation email is on its way.</p>
          <Link to="/account/orders" className="btn btn--primary">
            View your orders
          </Link>
        </div>
      </div>
    );
  }

  const statusSteps = [
    { label: 'Order placed', done: true },
    { label: 'Payment confirmed', done: true },
    { label: 'Being packed', done: false },
    { label: 'Shipped', done: false },
    { label: 'Delivered', done: false },
  ];

  return (
    <div className="container container--page">
      <div className="order-success">
        <span className="order-success__check" aria-hidden="true">
          <CheckIcon width={26} height={26} />
        </span>
        <span className="section__eyebrow">Thank you for your order</span>
        <h1>Order {order.id} confirmed</h1>
        <p>
          A confirmation has been sent to <strong>{order.shipping.email}</strong>.
          Your fragrances are being prepared with care.
        </p>

        <div className="order-progress">
          {statusSteps.map((s, i) => (
            <div className={`order-progress__step ${s.done ? 'is-done' : ''}`} key={s.label}>
              <span>
                {s.done ? <CheckIcon width={13} height={13} /> : i + 1}
              </span>
              <p>{s.label}</p>
            </div>
          ))}
        </div>

        <div className="order-success__card">
          <h2>Order details</h2>
          <div className="order-success__rows">
            <div>
              <span>Order number</span>
              <strong>{order.id}</strong>
            </div>
            <div>
              <span>Placed on</span>
              <strong>{formatDate(order.placedAt)}</strong>
            </div>
            <div>
              <span>Payment</span>
              <strong>{order.payment.method}</strong>
            </div>
            <div>
              <span>Shipping</span>
              <strong className="is-cap">
                {order.shipping.method === 'express' ? 'Express' : 'Standard'} ·{' '}
                {order.shipping.fullName}
              </strong>
            </div>
            <div>
              <span>Ship to</span>
              <strong>
                {order.shipping.city}, {order.shipping.country}
              </strong>
            </div>
            <div>
              <span>Total</span>
              <strong>{formatPrice(order.totals.total)}</strong>
            </div>
          </div>

          <div className="order-success__items">
            {order.items.map((i) => (
              <div className="checkout-item" key={`${i.id}-${i.size}`}>
                <img src={i.image} alt={i.name} />
                <div>
                  <p>{i.name}</p>
                  <span>
                    {i.brand} · {i.size} ml · Qty {i.quantity}
                  </span>
                </div>
                <strong>{formatPrice(i.price * i.quantity)}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="order-success__actions">
          <Link to="/shop" className="btn btn--primary">
            Continue shopping
          </Link>
          <Link to="/account/orders" className="btn btn--ghost">
            <TruckIcon width={15} height={15} /> Track order
          </Link>
          <button className="btn btn--ghost" onClick={() => window.print()}>
            Print receipt
          </button>
        </div>
      </div>
    </div>
  );
}