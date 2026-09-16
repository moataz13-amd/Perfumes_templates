import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from '../common/icons';

export default function EditorialCampaign() {
  return (
    <section className="section section--editorial">
      <div className="container">
        <div className="editorial">
          <div className="editorial__media">
            <img
              src="https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=1400"
              alt="Luxury fragrance campaign"
              loading="lazy"
            />
            <span className="editorial__badge">Spring Edit 2026</span>
          </div>
          <div className="editorial__content">
            <span className="section__eyebrow">The Scentora Edit</span>
            <h2 className="editorial__title">
              The Art of
              <em>Wearing</em> a
              Scent
            </h2>
            <p className="editorial__text">
              From the first citrus spark to the amber dry down &mdash; a great
              fragrance is a story you wear. Our edit brings together the
              compositions shaping the season: sun-warmed florals, clean
              accords and trails of quiet opulence.
            </p>
            <div className="editorial__stats">
              <div>
                <strong>20+</strong>
                <span>Maisons</span>
              </div>
              <div>
                <strong>50+</strong>
                <span>Fragrances</span>
              </div>
              <div>
                <strong>100%</strong>
                <span>Authentic</span>
              </div>
            </div>
            <Link to="/shop" className="btn btn--primary btn--lg">
              Shop the edit <ArrowRight width={16} height={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}