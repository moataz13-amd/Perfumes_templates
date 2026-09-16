import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../common/ProductCard';
import { ArrowRight } from '../common/icons';

export default function ProductRail({ title, eyebrow, products, viewAllTo = '/shop', viewAllLabel = 'View all' }) {
  if (!products || products.length === 0) return null;

  return (
    <section className="section section--product-rail">
      <div className="container">
        <div className="section__heading">
          <div>
            {eyebrow && <span className="section__eyebrow">{eyebrow}</span>}
            <h2 className="section__title">{title}</h2>
          </div>
          <Link to={viewAllTo} className="link-arrow">
            {viewAllLabel} <ArrowRight width={14} height={14} />
          </Link>
        </div>
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}