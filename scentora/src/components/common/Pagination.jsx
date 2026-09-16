import React from 'react';
import { ChevronLeft, ChevronRight } from './icons';
import { cx } from '../../utils/helpers';

export default function Pagination({
  page,
  totalPages,
  onChange,
  disabled = false,
}) {
  if (totalPages <= 1) return null;

  const pages = [];
  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
  const end = Math.min(totalPages, start + 4);
  for (let i = start; i <= end; i += 1) pages.push(i);

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        className="pagination__btn"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1 || disabled}
        aria-label="Previous page"
      >
        <ChevronLeft width={16} height={16} />
      </button>
      {start > 1 && (
        <>
          <button className="pagination__btn" onClick={() => onChange(1)} disabled={disabled}>
            1
          </button>
          {start > 2 && <span className="pagination__ellipsis">…</span>}
        </>
      )}
      {pages.map((p) => (
        <button
          key={p}
          className={cx('pagination__btn', p === page && 'is-active')}
          onClick={() => onChange(p)}
          disabled={disabled}
          aria-current={p === page ? 'page' : undefined}
        >
          {p}
        </button>
      ))}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="pagination__ellipsis">…</span>}
          <button
            className="pagination__btn"
            onClick={() => onChange(totalPages)}
            disabled={disabled}
          >
            {totalPages}
          </button>
        </>
      )}
      <button
        className="pagination__btn"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages || disabled}
        aria-label="Next page"
      >
        <ChevronRight width={16} height={16} />
      </button>
    </nav>
  );
}