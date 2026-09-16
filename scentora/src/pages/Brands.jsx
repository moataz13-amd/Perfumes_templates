import React from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/common/Breadcrumbs';
import { brands } from '../data/brands';
import { products } from '../data/products';
import { ArrowRight } from '../components/common/icons';

export default function Brands() {
  return (
    <div>
      <div className="page-hero">
        <div className="container">
          <Breadcrumbs />
          <h1 className="page-hero__title">Our Maisons</h1>
          <p className="page-hero__subtitle">
            Twenty of the world's most storied perfume houses, one address for
            discovery.
          </p>
        </div>
      </div>

      <div className="container container--page">
        <div className="brand-list">
          {brands.map((brand) => {
            const count = products.filter((p) => p.brand === brand.name).length;
            return (
              <Link
                key={brand.slug}
                to={`/brand/${brand.slug}`}
                className="brand-list__card"
              >
                <img src={brand.heroImage} alt={brand.name} loading="lazy" />
                <div className="brand-list__content">
                  <span className="brand-list__founded">
                    Est. {brand.founded} · {brand.country}
                  </span>
                  <h2>{brand.name}</h2>
                  <p>{brand.tagline}</p>
                  <div className="brand-list__footer">
                    <span>{count} fragrances</span>
                    <span className="link-arrow">
                      Explore <ArrowRight width={14} height={14} />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}