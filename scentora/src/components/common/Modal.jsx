import React, { useEffect, useCallback } from 'react';
import { CloseIcon } from './icons';
import { cx } from '../../utils/helpers';

export default function Modal({
  open,
  onClose,
  title,
  children,
  size = 'md',
  footer = null,
}) {
  const closeOnEsc = useCallback(
    (e) => {
      if (e.key === 'Escape' && open) onClose();
    },
    [open, onClose]
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener('keydown', closeOnEsc);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', closeOnEsc);
      document.body.style.overflow = prev;
    };
  }, [open, closeOnEsc]);

  if (!open) return null;

  return (
    <div className="modal-overlay" role="presentation" onMouseDown={onClose}>
      <div
        className={cx('modal', `modal--${size}`)}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modal__header">
          <h2 className="modal__title">{title}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close dialog">
            <CloseIcon />
          </button>
        </div>
        <div className="modal__body">{children}</div>
        {footer && <div className="modal__footer">{footer}</div>}
      </div>
    </div>
  );
}