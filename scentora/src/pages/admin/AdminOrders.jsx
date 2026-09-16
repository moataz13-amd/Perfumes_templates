import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdminData } from '../../context/AdminDataContext';
import { useToast } from '../../context/ToastContext';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import { SearchIcon, EyeIcon } from '../../components/common/icons';
import { formatPrice } from '../../utils/helpers';

const PER_PAGE = 10;
const STATUS_TONES = {
  Processing: 'warning',
  Shipped: 'info',
  Delivered: 'success',
  Cancelled: 'danger',
  Pending: 'neutral',
};

const ALL_STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminOrders() {
  const { orders, updateOrderStatus } = useAdminData();
  const { success } = useToast();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState(null);
  const [dStatus, setDStatus] = useState('');

  const filtered = useMemo(() => {
    let list = [...orders];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          (o.customer?.name || '').toLowerCase().includes(q) ||
          (o.customer?.email || '').toLowerCase().includes(q)
      );
    }
    if (status !== 'all') list = list.filter((o) => o.status === status);
    return list.sort((a, b) => (b.placedAt > a.placedAt ? 1 : -1));
  }, [orders, search, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const openDetail = (o) => {
    setDetail(o);
    setDStatus(o.status);
  };

  const saveStatus = () => {
    updateOrderStatus(detail.id, dStatus);
    success(`Order ${detail.id} → ${dStatus}`);
    setDetail((d) => ({ ...d, status: dStatus }));
  };

  const countBy = (s) => orders.filter((o) => o.status === s).length;

  return (
    <div className="admin-dash">
      <div className="admin-page-head">
        <div>
          <h1>Orders</h1>
          <p>{orders.length} orders placed</p>
        </div>
        <div className="admin-kpis admin-kpis--5">
          {ALL_STATUSES.map((s) => (
            <div className={`kpi kpi--${STATUS_TONES[s]}`} key={s}>
              <span>{s}</span>
              <strong>{countBy(s)}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-card admin-card--table">
        <div className="admin-table-toolbar">
          <div className="admin-table-toolbar__search">
            <SearchIcon width={16} height={16} />
            <input type="search" placeholder="Search order #, customer, email…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} aria-label="Search orders" />
          </div>
          <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} aria-label="Filter by status">
            <option value="all">All statuses</option>
            {ALL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {paged.length === 0 ? (
          <EmptyState title="No orders found" message="Try adjusting your search or filters." />
        ) : (
          <div className="admin-table">
            <table>
              <thead>
                <tr>
                  <th>Order</th><th>Customer</th><th>Date</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>View</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((o) => (
                  <tr key={o.id}>
                    <td className="admin-mono"><Link to={`/admin/orders/${o.id}`}>{o.id}</Link></td>
                    <td>
                      <div className="admin-cust-cell">
                        <strong>{o.customer?.name}</strong>
                        <small>{o.customer?.email}</small>
                      </div>
                    </td>
                    <td>{o.placedAt}</td>
                    <td>{o.items.reduce((a, i) => a + i.qty, 0)}</td>
                    <td><strong>{formatPrice(o.total)}</strong>{o.coupon ? <span className="admin-cell-sale"> coupon</span> : null}</td>
                    <td>{o.payment || 'Credit Card'}</td>
                    <td><span className={`stat-badge stat-badge--${STATUS_TONES[o.status] || 'neutral'}`}>{o.status}</span></td>
                    <td>
                      <button className="icon-btn icon-btn--sm" onClick={() => openDetail(o)} aria-label={`View ${o.id}`}>
                        <EyeIcon width={14} height={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="admin-table__footer">
          <span>Showing {paged.length} of {filtered.length} orders</span>
          <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
        </div>
      </div>

      <Modal open={!!detail} onClose={() => setDetail(null)} title={`Order ${detail?.id}`} size="lg">
        {detail && (
          <div className="order-detail">
            <div className="order-detail__status">
              <label className="form-field__label">Order status</label>
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
                <p>{detail.customer?.name}</p>
                <p>{detail.customer?.email}</p>
                <p>{detail.customer?.phone}</p>
              </div>
              <div>
                <h4>Shipping</h4>
                <p>{detail.shipping?.name}</p>
                <p>{detail.shipping?.line1}, {detail.shipping?.city}</p>
                <p>{detail.shipping?.zip}, {detail.shipping?.country}</p>
              </div>
              <div>
                <h4>Order</h4>
                <p>Placed {detail.placedAt}</p>
                <p>Payment: {detail.payment || 'Credit Card'}</p>
                <p>Method: {detail.shipping?.method || detail.shippingMethod}</p>
              </div>
            </div>

            <div className="admin-table">
              <table>
                <thead>
                  <tr><th>#</th><th>Product</th><th>Size</th><th>Qty</th><th>Price</th></tr>
                </thead>
                <tbody>
                  {detail.items.map((it, idx) => (
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
              <div><span>Subtotal</span><strong>{formatPrice(detail.subtotal)}</strong></div>
              <div><span>Shipping</span><strong>{detail.shippingCost === 0 ? 'Free' : formatPrice(detail.shippingCost)}</strong></div>
              {detail.coupon && <div><span>Coupon ({detail.coupon})</span><strong>−{formatPrice(detail.discount || 0)}</strong></div>}
              <div className="order-detail__grand"><span>Total</span><strong>{formatPrice(detail.total)}</strong></div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}