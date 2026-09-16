import React, { useMemo, useState } from 'react';
import { useAdminData } from '../../context/AdminDataContext';
import { useToast } from '../../context/ToastContext';
import Pagination from '../../components/common/Pagination';
import Modal from '../../components/common/Modal';
import { SearchIcon, AlertTriangleIcon } from '../../components/common/icons';
import { cx } from '../../utils/helpers';

const PER_PAGE = 12;

export default function AdminInventory() {
  const { catalog, setStock } = useAdminData();
  const { success } = useToast();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [adjusting, setAdjusting] = useState(null);
  const [delta, setDelta] = useState(0);

  const stats = useMemo(() => {
    const totalUnits = catalog.reduce((a, p) => a + p.stock, 0);
    const out = catalog.filter((p) => p.stock === 0).length;
    const low = catalog.filter((p) => p.stock > 0 && p.stock <= 10).length;
    return { totalUnits, out, low };
  }, [catalog]);

  const filtered = useMemo(() => {
    let list = [...catalog];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
    }
    if (filter === 'out') list = list.filter((p) => p.stock === 0);
    if (filter === 'low') list = list.filter((p) => p.stock > 0 && p.stock <= 10);
    return list;
  }, [catalog, search, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const apply = () => {
    const product = adjusting;
    const newStock = Math.max(0, Number(delta || 0));
    setStock(product.id, newStock);
    success(`"${product.name}" stock set to ${newStock}`);
    setAdjusting(null);
    setDelta(0);
  };

  return (
    <div className="admin-dash">
      <div className="admin-page-head">
        <div>
          <h1>Inventory</h1>
          <p>Manage stock levels across the catalog</p>
        </div>
        <div className="admin-kpis admin-kpis--3">
          <div className="kpi"><span>Total units</span><strong>{stats.totalUnits.toLocaleString()}</strong></div>
          <div className="kpi kpi--warn"><span>Low (1–10)</span><strong>{stats.low}</strong></div>
          <div className="kpi kpi--danger"><span>Out of stock</span><strong>{stats.out}</strong></div>
        </div>
      </div>

      <div className="admin-card admin-card--table">
        <div className="admin-table-toolbar">
          <div className="admin-table-toolbar__search">
            <SearchIcon width={16} height={16} />
            <input type="search" placeholder="Search product or SKU…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} aria-label="Search inventory" />
          </div>
          <select value={filter} onChange={(e) => { setFilter(e.target.value); setPage(1); }} aria-label="Filter stock">
            <option value="all">All stock</option>
            <option value="low">Low stock (1-10)</option>
            <option value="out">Out of stock</option>
          </select>
        </div>

        <div className="inv-grid">
          {paged.map((p) => (
            <div key={p.id} className={cx('inv-card', p.stock === 0 && 'inv-card--out')}>
              <img src={p.images?.[0]} alt="" />
              <div className="inv-card__body">
                <div className="inv-card__name">{p.brand} <span className="text-muted">·</span> {p.name}</div>
                <div className="inv-card__meta">{p.sku}</div>
                <div className="inv-card__row">
                  {p.stock === 0 ? (
                    <span className="inv-pill inv-pill--out"><AlertTriangleIcon width={12} height={12} /> Out of stock</span>
                  ) : p.stock <= 10 ? (
                    <span className="inv-pill inv-pill--low">Low stock</span>
                  ) : (
                    <span className="inv-pill inv-pill--ok">In stock</span>
                  )}
                  <strong>{p.stock}</strong>
                </div>
                <button className="btn btn--ghost btn--sm" onClick={() => { setAdjusting(p); setDelta(0); }}>
                  Adjust
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="admin-table__footer">
          <span>Showing {paged.length} of {filtered.length} products</span>
          <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
        </div>
      </div>

      <Modal open={!!adjusting} onClose={() => setAdjusting(null)} title={`Adjust stock — ${adjusting?.name}`} size="sm">
        {adjusting && (
          <div className="admin-form">
            <p className="form-field__helper">Current stock: <strong>{adjusting.stock}</strong></p>
            <FormLabel>New stock quantity</FormLabel>
            <input
              type="number"
              className="form-field__input"
              value={delta}
              onChange={(e) => setDelta(e.target.value)}
              aria-label="New stock quantity"
            />
            <div className="modal__footer-actions">
              <button className="btn btn--ghost" onClick={() => setAdjusting(null)}>Cancel</button>
              <button className="btn btn--primary" onClick={apply}>Save</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function FormLabel({ children }) {
  return <label className="form-field__label">{children}</label>;
}