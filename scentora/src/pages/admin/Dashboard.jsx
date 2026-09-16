import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  KPI,
  LineChart,
  BarChart,
  DonutChart,
  StatBadge,
} from '../../components/admin/Charts';
import { products } from '../../data/products';
import {
  WalletIcon,
  BagIcon,
  UsersIcon,
  TrendUpIcon,
  PackageIcon,
  ArrowRight,
} from '../../components/common/icons';

const RANGES = ['Today', '7 Days', '30 Days', '3 Months', '12 Months'];

const REVENUE_DATA = {
  Today: [
    { label: '8a', value: 120 }, { label: '10a', value: 260 }, { label: '12p', value: 410 },
    { label: '2p', value: 330 }, { label: '4p', value: 540 }, { label: '6p', value: 720 },
    { label: '8p', value: 610 }, { label: '10p', value: 380 },
  ],
  '7 Days': [
    { label: 'Mon', value: 820 }, { label: 'Tue', value: 940 }, { label: 'Wed', value: 780 },
    { label: 'Thu', value: 1150 }, { label: 'Fri', value: 1300 }, { label: 'Sat', value: 1600 },
    { label: 'Sun', value: 1240 },
  ],
  '30 Days': [
    { label: 'W1', value: 6200 }, { label: 'W2', value: 7100 }, { label: 'W3', value: 6800 },
    { label: 'W4', value: 8400 },
  ],
  '3 Months': [
    { label: 'Jun', value: 22100 }, { label: 'Jul', value: 24800 }, { label: 'Aug', value: 27300 },
    { label: 'Sep', value: 29800 },
  ],
  '12 Months': [
    { label: 'Oct', value: 21000 }, { label: 'Nov', value: 26800 }, { label: 'Dec', value: 34200 },
    { label: 'Jan', value: 22600 }, { label: 'Feb', value: 24100 }, { label: 'Mar', value: 25800 },
    { label: 'Apr', value: 23300 }, { label: 'May', value: 26900 }, { label: 'Jun', value: 28100 },
    { label: 'Jul', value: 27400 }, { label: 'Aug', value: 29600 }, { label: 'Sep', value: 31800 },
  ],
};

const ORDERS_DATA = {
  Today: [
    { label: '8a', value: 2 }, { label: '10a', value: 4 }, { label: '12p', value: 7 },
    { label: '2p', value: 5 }, { label: '4p', value: 9 }, { label: '6p', value: 11 },
    { label: '8p', value: 8 }, { label: '10p', value: 5 },
  ],
  '7 Days': [
    { label: 'Mon', value: 18 }, { label: 'Tue', value: 21 }, { label: 'Wed', value: 17 },
    { label: 'Thu', value: 26 }, { label: 'Fri', value: 31 }, { label: 'Sat', value: 40 },
    { label: 'Sun', value: 28 },
  ],
  '30 Days': [
    { label: 'W1', value: 132 }, { label: 'W2', value: 148 }, { label: 'W3', value: 141 },
    { label: 'W4', value: 176 },
  ],
  '3 Months': [
    { label: 'Jun', value: 480 }, { label: 'Jul', value: 530 }, { label: 'Aug', value: 570 },
    { label: 'Sep', value: 610 },
  ],
  '12 Months': [
    { label: 'Oct', value: 432 }, { label: 'Nov', value: 551 }, { label: 'Dec', value: 689 },
    { label: 'Jan', value: 459 }, { label: 'Feb', value: 487 }, { label: 'Mar', value: 530 },
    { label: 'Apr', value: 502 }, { label: 'May', value: 566 }, { label: 'Jun', value: 588 },
    { label: 'Jul', value: 573 }, { label: 'Aug', value: 612 }, { label: 'Sep', value: 644 },
  ],
};

const SALES_BY_BRAND = products
  .slice(0, 8)
  .map((p, i) => ({
    label: p.brand,
    value: 1200 - i * 130,
    color: ['#1a1a1a', '#3d3d3d', '#6b5a3e', '#8a7a55', '#2c2c2c', '#57534e', '#918264', '#0f0f0f'][i % 8],
  }));

const SALES_BY_CATEGORY = [
  { label: 'Men', value: 3120, color: '#1a1a1a' },
  { label: 'Women', value: 2760, color: '#6b5a3e' },
  { label: 'Unisex', value: 1640, color: '#9a8a63' },
  { label: 'Niche', value: 980, color: '#bbb' },
  { label: 'Gift Sets', value: 420, color: '#ddd' },
];

const RECENT_ORDERS = [
  { id: 'SCN-10024', customer: 'Olivia Martin', date: 'Sep 10', items: 2, total: 341.3, status: 'Delivered', payment: 'Visa' },
  { id: 'SCN-10023', customer: 'James Whitfield', date: 'Sep 9', items: 1, total: 158, status: 'Shipped', payment: 'Visa' },
  { id: 'SCN-10022', customer: 'Sofia Lindqvist', date: 'Sep 7', items: 3, total: 268.7, status: 'Processing', payment: 'PayPal' },
  { id: 'SCN-10021', customer: 'Ethan Goodman', date: 'Sep 5', items: 2, total: 276, status: 'Shipped', payment: 'Amex' },
  { id: 'SCN-10020', customer: 'Nadia Karim', date: 'Sep 4', items: 1, total: 148, status: 'Refunded', payment: 'Visa' },
];

const STATUS_TONE = {
  Delivered: 'success',
  Shipped: 'info',
  Processing: 'warning',
  Pending: 'neutral',
  Refunded: 'danger',
  Cancelled: 'danger',
};

const bestSellers = [...products]
  .sort((a, b) => b.reviewCount - a.reviewCount)
  .slice(0, 5);

const lowStock = products.filter((p) => p.stock <= 10 && p.stock > 0);

export default function AdminDashboard() {
  const [range, setRange] = useState('30 Days');
  const revenue = REVENUE_DATA[range] || REVENUE_DATA['30 Days'];
  const orders = ORDERS_DATA[range] || ORDERS_DATA['30 Days'];

  return (
    <div className="admin-dash">
      <div className="admin-page-head">
        <div>
          <h1>Dashboard</h1>
          <p>Good morning. Here's what's happening at SCENTORA today.</p>
        </div>
        <div className="admin-page-head__range">
          {RANGES.map((r) => (
            <button
              key={r}
              className={range === r ? 'is-active' : ''}
              onClick={() => setRange(r)}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-kpis">
        <KPI label="Revenue" value="$27,340" delta={12.4} deltaLabel="vs last period" trend="up" icon={WalletIcon} />
        <KPI label="Orders" value="1,241" delta={8.1} deltaLabel="vs last period" trend="up" icon={BagIcon} />
        <KPI label="Customers" value="8,420" delta={6.7} deltaLabel="new this period" trend="up" icon={UsersIcon} />
        <KPI label="Avg. Order Value" value="$88" delta={2.9} deltaLabel="vs last period" trend="up" icon={TrendUpIcon} />
        <KPI label="Conversion Rate" value="2.4%" delta={0.4} deltaLabel="vs last period" trend="down" icon={PackageIcon} />
      </div>

      <div className="admin-grid admin-grid--2">
        <section className="admin-card">
          <div className="admin-card__head">
            <h2>Revenue over time</h2>
            <span>{range}</span>
          </div>
          <LineChart data={revenue} height={240} />
        </section>
        <section className="admin-card">
          <div className="admin-card__head">
            <h2>Orders over time</h2>
            <span>{range}</span>
          </div>
          <BarChart data={orders} height={240} />
        </section>
      </div>

      <div className="admin-grid admin-grid--2">
        <section className="admin-card">
          <div className="admin-card__head">
            <h2>Sales by brand</h2>
            <Link to="/admin/analytics" className="link-arrow">Details</Link>
          </div>
          <div className="admin-card__donut-wrap">
            <DonutChart data={SALES_BY_BRAND} size={200} label="units" />
            <div className="donut-legend">
              {SALES_BY_BRAND.slice(0, 6).map((d) => (
                <div key={d.label}>
                  <span style={{ background: d.color }} aria-hidden="true" />
                  <p>{d.label}</p>
                  <strong>{d.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="admin-card">
          <div className="admin-card__head">
            <h2>Sales by category</h2>
            <Link to="/admin/analytics" className="link-arrow">Details</Link>
          </div>
          <div className="admin-card__donut-wrap">
            <DonutChart data={SALES_BY_CATEGORY} size={200} label="units" />
            <div className="donut-legend">
              {SALES_BY_CATEGORY.map((d) => (
                <div key={d.label}>
                  <span style={{ background: d.color }} aria-hidden="true" />
                  <p>{d.label}</p>
                  <strong>{d.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <div className="admin-grid admin-grid--3">
        <section className="admin-card admin-card--table">
          <div className="admin-card__head">
            <h2>Recent orders</h2>
            <Link to="/admin/orders" className="link-arrow">
              All orders <ArrowRight width={13} height={13} />
            </Link>
          </div>
          <div className="admin-table">
            <table>
              <thead>
                <tr>
                  <th>Order</th><th>Customer</th><th>Total</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_ORDERS.map((o) => (
                  <tr key={o.id}>
                    <td><Link to="/admin/orders">{o.id}</Link></td>
                    <td>{o.customer}</td>
                    <td>${o.total}</td>
                    <td><StatBadge tone={STATUS_TONE[o.status]}>{o.status}</StatBadge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="admin-card admin-card--table">
          <div className="admin-card__head">
            <h2>Best sellers</h2>
            <Link to="/admin/products" className="link-arrow">Products</Link>
          </div>
          <div className="admin-list">
            {bestSellers.map((p, i) => (
              <div className="admin-list__row" key={p.id}>
                <span className="admin-list__rank">{i + 1}</span>
                <img src={p.images[0]} alt="" />
                <div>
                  <strong>{p.name}</strong>
                  <small>{p.brand} · {p.reviewCount} reviews</small>
                </div>
                <em>{products.filter((x) => x.brand === p.brand).length}</em>
              </div>
            ))}
          </div>
        </section>

        <section className="admin-card admin-card--table">
          <div className="admin-card__head">
            <h2>Low stock alerts</h2>
            <Link to="/admin/inventory" className="link-arrow">Inventory</Link>
          </div>
          <div className="admin-list">
            {lowStock.slice(0, 5).map((p) => (
              <div className="admin-list__row" key={p.id}>
                <img src={p.images[0]} alt="" className="admin-list__thumb-stock" />
                <div>
                  <strong>{p.name}</strong>
                  <small>{p.sku}</small>
                </div>
                <span className={`admin-stock admin-stock--${p.stock === 0 ? 'out' : 'low'}`}>
                  {p.stock === 0 ? 'Out' : `${p.stock} left`}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}