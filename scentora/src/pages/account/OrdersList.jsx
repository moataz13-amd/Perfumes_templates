import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { demoOrders } from '../../data/reviews';
import { products } from '../../data/products';
import { formatPrice, formatDate } from '../../utils/helpers';
import { BagIcon, ArrowRight } from '../../components/common/icons';

const STATUS_STYLES = {
  Pending: 'status-pill--pending',
  Processing: 'status-pill--processing',
  Shipped: 'status-pill--shipped',
  Delivered: 'status-pill--delivered',
  Cancelled: 'status-pill--cancelled',
};

export default function OrdersList() {
  const { addItem, openCart } = useCart();
  const { success } = useToast();
  const [reorderBusy, setReorderBusy] = useState(false);

  const reorder = (orderId) => {
    const order = demoOrders.find((o) => o.id === orderId);
    if (!order) return;
    setReorderBusy(true);
    setTimeout(() => {
      order.items.forEach((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (product) {
          addItem(product, { size: item.size ? String(item.size) : product.size[0], quantity: item.quantity });
        }
      });
      setReorderBusy(false);
      success('Items added to your cart');
      openCart();
    }, 450);
  };

  return (
    <div className="orders-page">
      <div className="orders-page__head">
        <h1 className="page-title">Your Orders</h1>
        <p className="orders-page__subtitle">View order history, track shipments, and reorder your signature scents.</p>
      </div>

      {demoOrders.length === 0 ? (
        <div className="account-card account-card--cta">
          <h3>No orders yet</h3>
          <p>When you place an order it will appear here.</p>
          <Link to="/shop" className="btn btn--primary">
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {demoOrders.map((order) => (
            <article className="order-card" key={order.id}>
              <div className="order-card__head">
                <div className="order-card__meta">
                  <strong className="order-card__id">{order.id}</strong>
                  <span className="order-card__date">
                    Placed {formatDate(order.placedAt)} · {order.items.length} item{order.items.length !== 1 && 's'}
                  </span>
                </div>
                <span className={`status-pill ${STATUS_STYLES[order.status] || 'status-pill--delivered'}`}>
                  {order.status}
                </span>
              </div>

              <div className="order-card__body">
                <div className="order-card__items">
                  <div className="order-card__thumbs">
                    {order.items.map((item, i) => (
                      <div key={i} className="order-card__thumb">
                        <img
                          src={products.find((p) => p.id === item.productId)?.images?.[0] || item.image}
                          alt={item.name}
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="order-card__info">
                    <p className="order-card__item-names">
                      {order.items[0]?.name}{order.items.length > 1 ? ` +${order.items.length - 1} more items` : ''}
                    </p>
                    <span className="order-card__total">Total <strong>{formatPrice(order.payment.total)}</strong></span>
                  </div>
                </div>

                <div className="order-card__actions">
                  <Link to={`/account/orders/${order.id}`} className="btn btn--ghost btn--sm">
                    View details <ArrowRight width={14} height={14} />
                  </Link>
                  <button
                    className="btn btn--secondary btn--sm"
                    onClick={() => reorder(order.id)}
                    disabled={reorderBusy}
                  >
                    <BagIcon width={14} height={14} /> Reorder
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}