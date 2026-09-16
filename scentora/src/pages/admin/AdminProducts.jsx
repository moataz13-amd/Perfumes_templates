import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdminData } from '../../context/AdminDataContext';
import { useToast } from '../../context/ToastContext';
import Pagination from '../../components/common/Pagination';
import {
  SearchIcon,
  PencilIcon,
  CopyIcon,
  TrashIcon,
  PlusIcon,
  ChevronDown,
  CheckIcon,
} from '../../components/common/icons';
import { cx, isOnSale } from '../../utils/helpers';

const PER_PAGE = 10;
const STATUS_META = {
  active: { label: 'Active', tone: 'success' },
  draft: { label: 'Draft', tone: 'neutral' },
};

export default function AdminProducts() {
  const { catalog, removeProducts, addProduct, bulkUpdateStatus } = useAdminData();
  const { success } = useToast();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sort, setSort] = useState('Newest');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState([]);
  const [bulkMenu, setBulkMenu] = useState(false);

  const categories = useMemo(() => ['all', ...new Set(catalog.map((p) => p.category))], [catalog]);

  const filtered = useMemo(() => {
    let list = [...catalog];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'all') list = list.filter((p) => (p.status || 'active') === statusFilter);
    if (categoryFilter !== 'all') list = list.filter((p) => p.category === categoryFilter);
    switch (sort) {
      case 'Name A-Z': list.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'Name Z-A': list.sort((a, b) => b.name.localeCompare(a.name)); break;
      case 'Price: Low': list.sort((a, b) => a.price - b.price); break;
      case 'Price: High': list.sort((a, b) => b.price - a.price); break;
      case 'Stock: Low': list.sort((a, b) => a.stock - b.stock); break;
      default: list.sort((a, b) => b.id - a.id);
    }
    return list;
  }, [catalog, search, statusFilter, categoryFilter, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const toggleAll = () => {
    if (selected.length === paged.length) setSelected([]);
    else setSelected(paged.map((p) => p.id));
  };

  const toggleOne = (id) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const bulkDelete = () => {
    removeProducts(selected);
    success(`${selected.length} product(s) deleted`);
    setSelected([]);
  };

  const bulkStatus = (status) => {
    bulkUpdateStatus(selected, status);
    success(`Status updated to "${status}" for ${selected.length} product(s)`);
    setSelected([]);
    setBulkMenu(false);
  };

  const duplicate = (product) => {
    const clone = { ...product, id: null, name: `${product.name} (Copy)`, sku: `${product.sku}-COPY`, stock: 0 };
    addProduct(clone, { publish: false });
    success('Product duplicated');
  };

  return (
    <div className="admin-dash">
      <div className="admin-page-head">
        <div>
          <h1>Products</h1>
          <p>{catalog.length} products in catalog</p>
        </div>
        <Link to="/admin/products/new" className="btn btn--primary">
          <PlusIcon width={15} height={15} /> Add product
        </Link>
      </div>

      <div className="admin-card admin-card--table">
        <div className="admin-table-toolbar">
          <div className="admin-table-toolbar__search">
            <SearchIcon width={16} height={16} />
            <input
              type="search"
              placeholder="Search by name, brand or SKU…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              aria-label="Search products"
            />
          </div>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} aria-label="Filter by status">
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
          </select>
          <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }} aria-label="Filter by category">
            {categories.map((c) => (
              <option key={c} value={c}>{c === 'all' ? 'All categories' : c}</option>
            ))}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort products">
            {['Newest', 'Name A-Z', 'Name Z-A', 'Price: Low', 'Price: High', 'Stock: Low'].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <div className="admin-bulk">
            {selected.length > 0 ? (
              <>
                <div className="admin-bulk__info">
                  <CheckIcon width={14} height={14} /> {selected.length} selected
                </div>
                <button className="btn btn--danger btn--sm" onClick={bulkDelete}>
                  <TrashIcon width={14} height={14} /> Delete
                </button>
                <div className="admin-bulk__menu">
                  <button className="btn btn--ghost btn--sm" onClick={() => setBulkMenu((b) => !b)}>
                    Set status <ChevronDown width={13} height={13} />
                  </button>
                  {bulkMenu && (
                    <div className="admin-popover">
                      <button onClick={() => bulkStatus('active')}>Active (publish)</button>
                      <button onClick={() => bulkStatus('draft')}>Draft (unpublish)</button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <span className="admin-bulk__hint">Select products to bulk act</span>
            )}
          </div>
        </div>

        <div className="admin-table">
          <table>
            <thead>
              <tr>
                <th style={{ width: 40 }}>
                  <input
                    type="checkbox"
                    onChange={toggleAll}
                    checked={paged.length > 0 && selected.length === paged.length}
                    aria-label="Select all"
                  />
                </th>
                <th>Product</th>
                <th>Brand</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Sales</th>
                <th style={{ width: 110 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((p) => {
                const meta = STATUS_META[(p.status || 'active')] || STATUS_META.active;
                return (
                  <tr key={p.id} className={cx(selected.includes(p.id) && 'is-selected')}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selected.includes(p.id)}
                        onChange={() => toggleOne(p.id)}
                        aria-label={`Select ${p.name}`}
                      />
                    </td>
                    <td>
                      <div className="admin-product-cell">
                        <img src={p.images?.[0]} alt="" />
                        <div>
                          <Link to={`/product/${p.slug}`}>{p.name}</Link>
                          {isOnSale(p) && <span className="admin-cell-sale">Sale</span>}
                        </div>
                      </div>
                    </td>
                    <td>{p.brand}</td>
                    <td className="admin-mono">{p.sku}</td>
                    <td>{p.category}</td>
                    <td>
                      ${p.price}
                      {p.compareAtPrice && (
                        <span className="admin-strike"> ${p.compareAtPrice}</span>
                      )}
                    </td>
                    <td>
                      <span className={cx('admin-stock', p.stock === 0 ? 'admin-stock--out' : p.stock <= 10 ? 'admin-stock--low' : 'admin-stock--ok')}>
                        {p.stock}
                      </span>
                    </td>
                    <td><span className={`stat-badge stat-badge--${meta.tone}`}>{meta.label}</span></td>
                    <td>{Math.round(p.reviewCount * 1.6)}</td>
                    <td>
                      <div className="admin-cell-actions">
                        <Link to={`/admin/products/${p.id}/edit`} className="icon-btn icon-btn--sm" title="Edit" aria-label="Edit">
                          <PencilIcon width={14} height={14} />
                        </Link>
                        <button className="icon-btn icon-btn--sm" title="Duplicate" aria-label="Duplicate" onClick={() => duplicate(p)}>
                          <CopyIcon width={14} height={14} />
                        </button>
                        <button className="icon-btn icon-btn--sm" title="Delete" aria-label="Delete"
                          onClick={() => { removeProducts([p.id]); success('Product deleted'); }}>
                          <TrashIcon width={14} height={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="admin-table__footer">
          <span>Showing {(safePage - 1) * PER_PAGE + 1}–{Math.min(safePage * PER_PAGE, filtered.length)} of {filtered.length}</span>
          <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />
        </div>
      </div>
    </div>
  );
}