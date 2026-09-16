import React from 'react';
import StarRating from '../common/StarRating';
import { testimonials } from '../../data/reviews';

export default function Testimonials() {
  const [active, setActive] = React.useState(0);
  const t = testimonials[active];

  return (
    <section className="section section--testimonials">
      <div className="container">
        <div className="section__heading section__heading--center">
          <span className="section__eyebrow">Loved by thousands</span>
          <h2 className="section__title">What Our Customers Say</h2>
        </div>

        <div className="testimonial">
          <StarRating rating={t.rating} size={18} />
          <blockquote className="testimonial__quote">
            “{t.quote}”
          </blockquote>
          <div className="testimonial__author">
            <span className="testimonial__avatar" aria-hidden="true">
              {t.name[0]}
            </span>
            <div>
              <strong>{t.name}</strong>
              <span>{t.role}</span>
            </div>
          </div>
        </div>

        <div className="testimonial__controls" role="tablist" aria-label="Testimonials">
          {testimonials.map((item, i) => (
            <button
              key={item.name}
              className={i === active ? 'is-active' : ''}
              onClick={() => setActive(i)}
              role="tab"
              aria-selected={i === active}
              aria-label={`Show testimonial from ${item.name}`}
            />
          ))}
        </div>

        <div className="trust-row">
          <div className="trust-row__item">
            <strong>4.8/5</strong>
            <span>Average rating · 12,000+ reviews</span>
          </div>
          <div className="trust-row__item">
            <strong>100%</strong>
            <span>Authenticity guaranteed</span>
          </div>
          <div className="trust-row__item">
            <strong>40+</strong>
            <span>Countries shipped to</span>
          </div>
          <div className="trust-row__item">
            <strong>30 days</strong>
            <span>Hassle-free returns</span>
          </div>
        </div>
      </div>
    </section>
  );
}