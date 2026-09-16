import React, { useMemo, useState } from 'react';
import { useAdminData } from '../../context/AdminDataContext';
import { useToast } from '../../context/ToastContext';
import { demoReviews } from '../../data/reviews';
import { getProductById } from '../../data/products';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import StarRating from '../../components/common/StarRating';
import { CheckIcon, TrashIcon } from '../../components/common/icons';

const PER_PAGE = 8;
const SEED = demoReviews.map((r, i) => ({ id: `r-${i}`, ...r, status: 'approved' }));

export default function AdminReviews() {
  const { reviews, updateReviewStatus, removeReview } = useAdminData();
  const { success } = useToast();
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);

  const all = useMemo(() => {
    const combined = [...reviews, ...SEED.filter((s) => !reviews.some((r) => r.id === s.id))];
    return combined.filter((r) => getProductById(r.productId));
  }, [reviews]);

  const filtered = all.filter((r) => (status === 'all' ? true : r.status === status));
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));

  const stats = useMemo(() => ({
    total: all.length,
    approved: all.filter((r) => r.status === 'approved').length,
    pending: all.filter((r) => r.status === 'pending').length,
    flagged: all.filter((r) => r.status === 'flagged').length,
  }), [all]);

  return (
    <div className="admin-dash">
      <div className="admin-page-head">
        <div>
          <h1>Reviews</h1>
          <p>Moderate customer reviews & ratings</p>
        </div>
        <div className="admin-kpis admin-kpis--4">
          <div className="kpi"><span>Total</span><strong>{stats.total}</strong></div>
          <div className="kpi kpi--success"><span>Approved</span><strong>{stats.approved}</strong></div>
          <div className="kpi kpi--warn"><span>Pending</span><strong>{stats.pending}</strong></div>
          <div className="kpi kpi--danger"><span>Flagged</span><strong>{stats.flagged}</strong></div>
        </div>
      </div>

      <div className="admin-card admin-card--table">
        <div className="admin-table-toolbar">
          <div className="admin-table-toolbar__filters">
            {['all', 'approved', 'pending', 'flagged'].map((s) => (
              <button key={s} className={`seg-btn ${status === s ? 'is-active' : ''}`} onClick={() => { setStatus(s); setPage(1); }}>
                {s[0].toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState title="No reviews here" message="Reviews will appear after customers buy." />
        ) : (
          <div className="admin-reviews">
            {filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE).map((r) => {
              const product = getProductById(r.productId);
              return (
                <div key={r.id} className="admin-review">
                  <div className="admin-review__head">
                    <div className="admin-review__user">
                      <span className="admin-avatar">{r.author?.[0] || 'U'}</span>
                      <div>
                        <strong>{r.author}</strong>
                        <span className="text-muted">{r.date}</span>
                      </div>
                    </div>
                    <div className="admin-review__rating">
                      <StarRating value={r.rating} />
                      <span className={`stat-badge ${r.status === 'approved' ? 'stat-badge--success' : r.status === 'flagged' ? 'stat-badge--danger' : 'stat-badge--warning'}`}>
                        {r.status}
                      </span>
                    </div>
                  </div>
                  <p className="admin-review__body">“{r.text}”</p>
                  <div className="admin-review__foot">
                    <span className="admin-review__product">{product?.name} — {product?.brand}</span>
                    <div className="admin-review__actions">
                      {r.status !== 'approved' && (
                        <button className="btn btn--ghost btn--sm" onClick={() => { updateReviewStatus(r.id, 'approved'); success('Review approved'); }}>
                          <CheckIcon width={14} height={14} /> Approve
                        </button>
                      )}
                      {(r.status === 'approved' || r.status === 'pending') && (
                        <button className="btn btn--ghost btn--sm" onClick={() => { updateReviewStatus(r.id, 'flagged'); success('Review flagged'); }}>
                          Flag
                        </button>
                      )}
                      <button className="btn btn--danger btn--sm icon-only" onClick={() => { removeReview(r.id); success('Review removed'); }} aria-label="Delete review">
                        <TrashIcon width={14} height={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="admin-table__footer">
          <span>{filtered.length} review(s)</span>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      </div>
    </div>
  );
}