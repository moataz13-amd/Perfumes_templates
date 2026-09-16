import React, { useMemo, useState } from 'react';
import { useAdminData } from '../../context/AdminDataContext';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import { SearchIcon, EyeIcon } from '../../components/common/icons';
import { formatPrice } from '../../utils/helpers';

const PER_PAGE = 10;

export default function AdminCustomers() {
  const { customers } = useAdminData();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return customers;
    const q = search.trim().toLowerCase();
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q)
    );
  }, [customers, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const tierClass = (tier) =>
    tier === 'VIP' ? 'stat-badge--warning' :
    tier === 'Gold' ? 'stat-badge--success' : 'stat-badge--neutral';

  return (
    <div className="admin-dash">
      <div className="admin-page-head">
        <div>
          <h1>Customers</h1>
          <p>{customers.length} registered accounts</p>
        </div>
      </div>

      <div className="admin-card admin-card--table">
        <div className="admin-table-toolbar">
          <div className="admin-table-toolbar__search">
            <SearchIcon width={16} height={16} />
            <input type="search" placeholder="Search by name or email…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} aria-label="Search customers" />
          </div>
        </div>

        {paged.length === 0 ? (
          <EmptyState title="No customers found" />
        ) : (
          <div className="admin-table">
            <table>
              <thead>
                <tr>
                  <th>Customer</th><th>Orders</th><th>Total Spent</th><th>Tier</th><th>Last order</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div className="admin-cust-cell">
                        <strong>{c.name}</strong>
                        <small>{c.email}</small>
                      </div>
                    </td>
                    <td>{c.orderCount}</td>
                    <td><strong>{formatPrice(c.totalSpent)}</strong></td>
                    <td><span className={`stat-badge ${tierClass(c.tier)}`}>{c.tier}</span></td>
                    <td>{c.lastOrderDate || '—'}</td>
                    <td>
                      <button className="icon-btn icon-btn--sm" onClick={() => setDetail(c)} aria-label={`View ${c.name}`}>
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
          <span>Showing {paged.length} of {filtered.length} customers</span>
          <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
        </div>
      </div>

      <Modal open={!!detail} onClose={() => setDetail(null)} title={`Customer — ${detail?.name}`} size="md">
        {detail && (
          <div className="admin-cust-modal">
            <div className="admin-form__grid">
              <div>
                <span className="form-field__label">Name</span>
                <p>{detail.name}</p>
              </div>
              <div>
                <span className="form-field__label">Email</span>
                <p>{detail.email}</p>
              </div>
            </div>
            <div className="admin-form__grid">
              <div>
                <span className="form-field__label">Total orders</span>
                <p><strong>{detail.orderCount}</strong></p>
              </div>
              <div>
                <span className="form-field__label">Total spent</span>
                <p><strong>{formatPrice(detail.totalSpent)}</strong></p>
              </div>
              <div>
                <span className="form-field__label">Loyalty tier</span>
                <p><span className={`stat-badge ${tierClass(detail.tier)}`}>{detail.tier}</span></p>
              </div>
              <div>
                <span className="form-field__label">Last order</span>
                <p>{detail.lastOrderDate || '—'}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}