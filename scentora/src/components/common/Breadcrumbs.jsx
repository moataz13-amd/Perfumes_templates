import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from './icons';

export default function Breadcrumbs({ items = [] }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <Link to="/" className="breadcrumbs__link">
        Home
      </Link>
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span className="breadcrumbs__item" key={`${item.label}-${i}`}>
            <ChevronRight width={12} height={12} className="breadcrumbs__sep" />
            {isLast || !item.to ? (
              <span className="breadcrumbs__current">{item.label}</span>
            ) : (
              <Link to={item.to} className="breadcrumbs__link">
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}