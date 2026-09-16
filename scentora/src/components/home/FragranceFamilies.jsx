import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from '../common/icons';
import { fragranceFamilies } from '../../data/reviews';

export default function FragranceFamilies() {
  return (
    <section className="section section--families">
      <div className="container">
        <div className="section__heading section__heading--center">
          <span className="section__eyebrow">Find your note</span>
          <h2 className="section__title">Fragrance Families</h2>
          <p className="section__subtitle">
            Every scent belongs to a family. Start with the one that sounds like you.
          </p>
        </div>
        <div className="family-grid">
          {fragranceFamilies.map((fam) => (
            <Link
              key={fam.slug}
              to={`/shop?family=${encodeURIComponent(fam.slug)}`}
              className="family-card"
            >
              <img src={fam.image} alt={fam.name} loading="lazy" />
              <div className="family-card__content">
                <h3>{fam.name}</h3>
                <p>{fam.description}</p>
                <span className="link-arrow">
                  Discover <ArrowRight width={13} height={13} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}