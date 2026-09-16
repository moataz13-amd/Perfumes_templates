import React, { useMemo, useState } from 'react';
import { useAdminData } from '../../context/AdminDataContext';
import { BarChart, DonutChart, KPI } from '../../components/admin/Charts';
import { cx } from '../../utils/helpers';

const RANGES = { '7d': 7, '30d': 30, '90d': 90 };

const TOP_PERFORMERS = [
  { name: 'Sauvage Elixir', brand: 'Dior', revenue: 18940, units: 317, delta: 12.1 },
  { name: 'Bleu de Chanel EDP', brand: 'Chanel', revenue: 16420, units: 281, delta: 8.4 },
  { name: 'Creed Aventus', brand: 'Creed', revenue: 15180, units: 118, delta: -2.3 },
  { name: "Tom Ford Ombr\u00e9 Leather", brand: 'Tom Ford', revenue: 12360, units: 142, delta: 5.6 },
  { name: 'Y Eau de Parfum', brand: 'Yves Saint Laurent', revenue: 10880, units: 196, delta: 3.1 },
  { name: 'Terre d\u2019Herm\u00e8s', brand: 'Herm\u00e8s', revenue: 9270, units: 138, delta: 7.2 },
];

export default function AdminAnalytics() {
  const { orders, customers } = useAdminData();
  const [range, setRange] = useState('30d');

  const spent = useMemo(() => customers.reduce((a, c) => a + c.totalSpent, 0), [customers]);

  const customersByTier = useMemo(() => {
    const tiers = { VIP: 0, Gold: 0, Standard: 0 };
    customers.forEach((c) => { tiers[c.tier] = (tiers[c.tier] || 0) + 1; });
    return Object.entries(tiers).map(([label, value]) => ({ label, value }));
  }, [customers]);

  const ordersByStatus = useMemo(() => {
    const counts = {};
    orders.forEach((o) => { counts[o.status] = (counts[o.status] || 0) + 1; });
    return Object.entries(counts).map(([label, value]) => ({ label, value }));
  }, [orders]);

  const grossRevenue = useMemo(() => orders.reduce((a, o) => a + o.total, 0), [orders]);
  const avgOrder = grossRevenue / (orders.length || 1);

  const chartData = useMemo(() => {
    const range = RANGES?.['30d'] ?? 30;
    const now = new Date();
    const days = [];
    for (let i = 0; i < range; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - (range - 1 - i));
      const key = d.toISOString().slice(5, 10);
      days.push({ label: key, revenue: 0, orders: 0 });
    }
    return days;
  }, []);

  return (
    <div className="admin-dash">
      <div className="admin-page-head">
        <div>
          <h1>Analytics</h1>
          <p>Performance over the last 30 days</p>
        </div>
        <div className="seg">
          {Object.entries(RANGES).map(([key, val]) => (
            <button key={key} className={`seg-btn ${range === key ? 'is-active' : ''}`} onClick={() => setRange(key)}>
              {val}d
            </button>
          ))}
        </div>
      </div>

      <div className="admin-kpis admin-kpis--4">
        <KPI label="Revenue" value={`$${grossRevenue.toLocaleString()}`} delta="+8.2%" />
        <KPI label="Orders" value={orders.length} delta="+5.1%" />
        <KPI label="AOV" value={`$${avgOrder.toFixed(0)}`} delta="-1.3%" />
        <KPI label="Total spent" value={`$${spent.toLocaleString()}`} delta="+11.4%" />
      </div>

      <div className="admin-grid admin-grid--2">
        <div className="admin-card admin-card--chart">
          <h3>Revenue trend</h3>
          <BarChart data={chartData} color="#8c6d3f" height={240} />
        </div>
        <div className="admin-card admin-card--chart">
          <h3>Revenue by channel</h3>
          <ul className="admin-analytics-list">
            <li><span><b>Direct or scan</b></span><strong>42%</strong></li>
            <li><span><b>SMS Marketing</b></span><strong>24%</strong></li>
            <li><span><b>Social (DM Link)</b></span><strong>19%</strong></li>
            <li><span><b>In-store (QR)</b></span><strong>15%</strong></li>
          </ul>
          <br />
          <h3>Conversion funnel (demo)</h3>
          <p className="text-muted">0.36% sessions to checkout - tuned for the template, not live store numbers. Connect analytics via your own tracking.</p>
        </div>
      </div>

      <div className="admin-grid admin-grid--3">
        <div className="admin-card admin-card--chart">
          <h3>Customers by tier</h3>
          <DonutChart data={customersByTier} centerLabel={`${customers.length}`} />
        </div>
        <div className="admin-card admin-card--chart">
          <h3>Orders by status</h3>
          <DonutChart data={ordersByStatus} colors={['#8c6d3f', '#5d7a5a', '#4a6474', '#b3543f', '#9b9b9b']} />
        </div>
        <div className="admin-card admin-card--chart">
          <h3>Top perfumers (demo)</h3>
          <DonutChart
            data={TOP_PERFORMERS.slice(0, 5).map((p) => ({ label: p.name, value: p.revenue }))}
            colors={['#8c6d3f', '#3e3e3e', '#b3543f', '#5d7a5a', '#4a6474']}
          />
        </div>
      </div>

      <div className="admin-card admin-card--table">
        <h3>Top performers</h3>
        <div className="admin-table">
          <table>
            <thead>
              <tr><th>#</th><th>Product</th><th>Brand</th><th>Units</th><th>Revenue</th><th>Delta</th></tr>
            </thead>
            <tbody>
              {TOP_PERFORMERS.map((p, i) => (
                <tr key={p.name}>
                  <td>{i + 1}</td>
                  <td><strong>{p.name}</strong></td>
                  <td>{p.brand}</td>
                  <td>{p.units}</td>
                  <td>${p.revenue.toLocaleString()}</td>
                  <td>
                    <span className={cx(p.delta >= 0 ? 'trend-up' : 'trend-down')}>
                      {p.delta >= 0 ? '+' : ''}{p.delta}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}