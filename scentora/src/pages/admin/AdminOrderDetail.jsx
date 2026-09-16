import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAdminData } from '../../context/AdminDataContext';
import { useToast } from '../../context/ToastContext';
import { formatPrice } from '../../utils/helpers';

const STATUS_TONES = { Processing: 'warning', Shipped: 'info', Delivered: 'success', Cancelled: 'danger', Pending: 'neutral' };
const ALL_STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminOrderDetail() {
  const { id } = useParams();
  const { orders, setOrderStatus } = useAdminData();
  const { success } = useToast();
  const order = orders.find((o) => o.id === id);
  const [dStatus, setDStatus] = useState(order?.status || '');

  if (!order) {
    return (
      <div className="admin-dash">
        <h1>Order not found</h1>
        <p><Link to="/admin/orders">Back to orders</Link></p>
      </div>
    );
  }

  const saveStatus = () => {
    setOrderStatus(id, dStatus);
    success(`Order ${id} → ${dStatus}`);
  };

  return (
    <div className="admin-dash">
      <div className="admin-page-head">
        <div>
          <h1>Order {id}</h1>
          <p>Placed {order.placedAt} · <span className={`stat-badge stat-badge--${STATUS_TONES[order.status] || 'neutral'}`}>{order.status}</span></p>
        </div>
        <Link to="/admin/orders" className="btn btn--ghost">Back to orders</Link>
      </div>

      <div className="order-detail">
        <div className="order-detail__status">
          <label className="form-field__label">Update order status</label>
          <div className="order-detail__status-row">
            <select value={dStatus} onChange={(e) => setDStatus(e.target.value)} aria-label="Order status">
              {ALL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <button className="btn btn--primary btn--sm" onClick={saveStatus}>Update</button>
          </div>
        </div>

        <div className="order-detail__grid">
          <div>
            <h4>Customer</h4>
            <p>{order.customer?.name}</p>
            <p>{order.customer?.email}</p>
            <p>{order.customer?.phone}</p>
          </div>
          <div>
            <h4>Shipping</h4>
            <p>{order.shipping?.name}</p>
            <p>{order.shipping?.line1}, {order.shipping?.city}</p>
            <p>{order.shipping?.zip}, {order.shipping?.country}</p>
          </div>
          <div>
            <h4>Order</h4>
            <p>Payment: {order.payment || 'Credit Card'}</p>
            <p>Method: {order.shipping?.method || order.shippingMethod}</p>
          </div>
        </div>

        <div className="admin-table">
          <table>
            <thead>
              <tr><th>#</th><th>Product</th><th>Size</th><th>Qty</th><th>Price</th></tr>
            </thead>
            <tbody>
              {order.items.map((it, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{it.name}</td>
                  <td>{it.size ? `${it.size} ml` : '—'}</td>
                  <td>{it.qty}</td>
                  <td>{formatPrice(it.price * it.qty)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="order-detail__totals">
          <div><span>Subtotal</span><strong>{formatPrice(order.subtotal)}</strong></div>
          <div><span>Shipping</span><strong>{order.shippingCost === 0 ? 'Free' : formatPrice(order.shippingCost)}</strong></div>
          {order.coupon && <div><span>Coupon ({order.coupon})</span><strong>−{formatPrice(order.discount || 0)}</strong></div>}
          <div className="order-detail__grand"><span>Total</span><strong>{formatPrice(order.total)}</strong></div>
        </div>
      </div>
    </div>
  );
}