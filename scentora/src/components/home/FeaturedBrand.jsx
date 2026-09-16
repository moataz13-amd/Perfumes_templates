import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from '../common/icons';
import { brands } from '../../data/brands';
import { products } from '../../data/products';

export default function FeaturedBrand() {
  const brand = brands.find((b) => b.slug === 'creed') || brands[0];
  const brandProducts = products.filter((p) => p.brand === brand.name).slice(0, 4);

  return (
    <section className="section section--featured-brand">
      <div className="container">
        <div className="featured-brand">
          <div className="featured-brand__hero">
            <img
              src="https://images.pexels.com/photos/3181712/pexels-photo-3181712.jpeg?auto=compress&cs=tinysrgb&w=1400"
              alt={brand.name}
              loading="lazy"
            />
            <div className="featured-brand__hero-content">
              <span className="section__eyebrow">Featured House</span>
              <h2>{brand.name}</h2>
              <p>{brand.tagline}</p>
              <Link to={`/brand/${brand.slug}`} className="btn btn--light btn--sm">
                Explore the house <ArrowRight width={14} height={14} />
              </Link>
            </div>
          </div>
          <div className="featured-brand__products">
            <div className="featured-brand__products-head">
              <h3>From the collection</h3>
              <Link to={`/brand/${brand.slug}`} className="link-arrow">
                All {brand.name} <ArrowRight width={14} height={14} />
              </Link>
            </div>
            <div className="featured-brand__grid">
              {brandProducts.map((p) => (
                <Link to={`/product/${p.slug}`} className="featured-brand__product" key={p.id}>
                  <img src={p.images[0]} alt={p.name} loading="lazy" />
                  <div>
                    <p>{p.name}</p>
                    <span>${p.price}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}