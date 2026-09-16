import React from 'react';
import { Link } from 'react-router-dom';

export default function EmptyState({
  icon = null,
  title = 'Nothing here yet',
  message = '',
  actionLabel = null,
  actionTo = '/shop',
  onAction = null,
}) {
  return (
    <div className="empty-state">
      {icon && <div className="empty-state__icon">{icon}</div>}
      <h3 className="empty-state__title">{title}</h3>
      {message && <p className="empty-state__message">{message}</p>}
      {actionLabel &&
        (onAction ? (
          <button className="btn btn--primary" onClick={onAction}>
            {actionLabel}
          </button>
        ) : (
          <Link to={actionTo} className="btn btn--primary">
            {actionLabel}
          </Link>
        ))}
    </div>
  );
}