import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from '../common/icons';

export default function Hero() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setPhase((p) => (p + 1) % 3), 6500);
    return () => clearInterval(timer);
  }, []);

  const slides = [
    {
      image:
        'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1800&auto=format&fit=crop',
      accent: 'Iconic Classics',
      eyebrow: 'The house of iconic fragrance',
      title: "Find Your Signature Scent.",
      subtitle:
        'Discover iconic fragrances from the world\u2019s most renowned perfume houses.',
    },
    {
      image:
        'https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?q=80&w=1800&auto=format&fit=crop',
      accent: 'New Season',
      eyebrow: 'New season, new rituals',
      title: 'The Art of Perfumery.',
      subtitle:
        'Hand-picked compositions from Dior, Chanel, Tom Ford and the most celebrated maisons.',
    },
    {
      image:
        'https://images.unsplash.com/photo-1610461888750-10bfc601b874?q=80&w=1800&auto=format&fit=crop',
      accent: 'Gifting',
      eyebrow: 'A gift that lingers',
      title: 'Fragrance, Perfected.',
      subtitle:
        'From first spritz to final trail \u2014 discover scents designed to be remembered.',
    },
  ];

  const current = slides[phase];

  return (
    <section className="hero" aria-label="Featured">
      <div className="hero__slides">
        {slides.map((slide, i) => (
          <div
            key={slide.accent}
            className={`hero__slide ${i === phase ? 'is-active' : ''}`}
            aria-hidden={i !== phase}
          >
            <img src={slide.image} alt={slide.accent} />
          </div>
        ))}
      </div>

      <div className="hero__overlay" aria-hidden="true" />
      <div className="container">
        <div className="hero__content">
          <span className="hero__eyebrow">{current.eyebrow}</span>
          <h1 className="hero__title">{current.title}</h1>
          <p className="hero__subtitle">{current.subtitle}</p>
          <div className="hero__actions">
            <Link to="/shop" className="btn btn--light btn--lg">
              Shop Fragrances <ArrowRight width={16} height={16} />
            </Link>
            <Link to="/brands" className="btn btn--outline-light btn--lg">
              Explore Brands
            </Link>
          </div>
        </div>
      </div>

      <div className="hero__dots" role="tablist" aria-label="Slides">
        {slides.map((slide, i) => (
          <button
            key={slide.accent}
            className={`hero__dot ${i === phase ? 'is-active' : ''}`}
            onClick={() => setPhase(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-selected={i === phase}
            role="tab"
          />
        ))}
      </div>
    </section>
  );
}