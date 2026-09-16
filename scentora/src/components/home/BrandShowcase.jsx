import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from '../common/icons';
import { featuredBrands } from '../../data/brands';

export default function BrandShowcase() {
  return (
    <section className="section section--brands">
      <div className="container">
        <div className="section__heading">
          <div>
            <span className="section__eyebrow">The Houses</span>
            <h2 className="section__title">Shop by Brand</h2>
          </div>
          <Link to="/brands" className="link-arrow">
            All brands <ArrowRight width={14} height={14} />
          </Link>
        </div>

        <div className="brand-grid">
          {featuredBrands.map((brand) => (
            <Link
              key={brand.slug}
              to={`/brand/${brand.slug}`}
              className="brand-card"
              title={brand.name}
            >
              <img src={brand.heroImage} alt={brand.name} loading="lazy" />
              <span className="brand-card__shade" aria-hidden="true" />
              <span className="brand-card__name">{brand.name.toUpperCase()}</span>
              <span className="brand-card__cta">
                Shop <ArrowRight width={12} height={12} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}