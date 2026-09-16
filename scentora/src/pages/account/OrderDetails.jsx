import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { demoOrders } from '../../data/reviews';
import { products } from '../../data/products';
import { formatPrice, formatDate } from '../../utils/helpers';
import EmptyState from '../../components/common/EmptyState';
import { CheckIcon } from '../../components/common/icons';

export default function OrderDetails() {
  const { orderId } = useParams();
  const order = demoOrders.find((o) => o.id === orderId);

  if (!order) {
    return (
      <EmptyState
        title="Order not found"
        message="We couldn't find that order in your account."
        actionLabel="View all orders"
        actionTo="/account/orders"
      />
    );
  }

  const steps = [
    { label: 'Order placed', done: true },
    { label: 'Payment', done: order.status !== 'Pending' },
    { label: 'Shipped', done: ['Shipped', 'Delivered'].includes(order.status) },
    { label: 'Delivered', done: order.status === 'Delivered' },
  ];

  return (
    <div>
      <div className="order-detail-head">
        <div>
          <span className="section__eyebrow">Order details</span>
          <h1 className="page-title">{order.id}</h1>
          <span className="status-pill status-pill--delivered">{order.status}</span>
        </div>
        <Link to="/account/orders" className="btn btn--ghost btn--sm">
          ← Back to orders
        </Link>
      </div>

      <div className="order-timeline">
        {steps.map((s, i) => (
          <div className={`order-timeline__step ${s.done ? 'is-done' : ''}`} key={s.label}>
            <span>{s.done ? <CheckIcon width={12} height={12} /> : i + 1}</span>
            <p>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="order-detail-grid">
        <section className="account-card">
          <h2>Items</h2>
          <div className="order-detail-items">
            {order.items.map((item) => {
              const product = products.find((p) => p.id === item.productId);
              return (
                <div className="order-detail-item" key={item.name}>
                  <img src={product?.images?.[0] || item.image} alt={item.name} loading="lazy" />
                  <div>
                    <strong>{item.name}</strong>
                    <span>{item.brand} · {item.size} ml · Qty {item.quantity}</span>
                  </div>
                  <strong>{formatPrice(item.price * item.quantity)}</strong>
                </div>
              );
            })}
          </div>
          <div className="order-detail-totals">
            <div><span>Subtotal</span><strong>{formatPrice(order.payment.subtotal)}</strong></div>
            <div><span>Shipping</span><strong>{order.payment.shipping === 0 ? 'Free' : formatPrice(order.payment.shipping)}</strong></div>
            <div><span>Tax</span><strong>{formatPrice(order.payment.tax)}</strong></div>
            <div className="is-total"><span>Total</span><strong>{formatPrice(order.payment.total)}</strong></div>
          </div>
        </section>

        <div className="order-detail-side">
          <section className="account-card">
            <h2>Shipping address</h2>
            <p>{order.address.fullName}</p>
            <p>{order.address.line1}</p>
            <p>{order.address.city}, {order.address.postal}</p>
            <p>{order.address.country}</p>
            <p>{order.address.phone}</p>
          </section>
          <section className="account-card">
            <h2>Payment</h2>
            <p>{order.payment.method}
              {order.payment.last4 && <> ·&nbsp;•••• {order.payment.last4}</>}
            </p>
            <p>Placed on {formatDate(order.placedAt)}</p>
          </section>
          <section className="account-card account-card--cta">
            <h2>Need help with this order?</h2>
            <Link to="/contact" className="btn btn--ghost btn--sm">
              Contact support
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}