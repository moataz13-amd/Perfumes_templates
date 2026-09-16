import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container container--page">
      <div className="not-found">
        <span className="not-found__code" aria-hidden="true">404</span>
        <h1 className="page-title">Page not found</h1>
        <p>
          Sorry — we couldn't find the page you were looking for. It may have been
          moved, renamed, or doesn't exist.
        </p>
        <div className="not-found__actions">
          <Link to="/" className="btn btn--primary btn--lg">
            Go home
          </Link>
          <Link to="/shop" className="btn btn--ghost btn--lg">
            Browse fragrances
          </Link>
        </div>
      </div>
    </div>
  );
}