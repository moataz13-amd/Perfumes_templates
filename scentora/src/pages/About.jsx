import React from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/common/Breadcrumbs';
import { brands } from '../data/brands';
import { SparkleIcon } from '../components/common/icons';

export default function About() {
  return (
    <div>
      <div className="page-hero page-hero--min">
        <div className="container">
          <Breadcrumbs />
          <span className="section__eyebrow">Our story</span>
          <h1 className="page-hero__title">Scent, curated.</h1>
          <p className="page-hero__subtitle">
            SCENTORA is a modern multi-brand fragrance maison bringing the world's
            most storied perfumes to one considered address.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="about-lead">
            <img
              src="https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?q=80&w=1200&auto=format&fit=crop"
              alt="SCENTORA curation"
              loading="lazy"
            />
            <div className="about-lead__text">
              <span className="section__eyebrow">Why SCENTORA</span>
              <h2>Fragrance is personal. Your shopping shouldn't be.</h2>
              <p>
                We founded SCENTORA on a simple belief: finding a signature scent
                should feel like a discovery, not a transaction. Our buyers travel
                the world to hand-pick compositions from independent houses and
                global icons  then present them in an editorial space built for
                exploring.
              </p>
              <p>
                Every parcel leaves our atelier gift-wrapped, every product is
                authenticated, and every order over $100 ships free.
              </p>
              <div className="about-lead__stats">
                <div><strong>01</strong><span>Founded 2025, New York</span></div>
                <div><strong>20+</strong><span>Partner maisons</span></div>
                <div><strong>50+</strong><span>Curated fragrances</span></div>
                <div><strong>40+</strong><span>Countries served</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--tinted">
        <div className="container">
          <div className="section__heading section__heading--center">
            <span className="section__eyebrow">Our promise</span>
            <h2 className="section__title">The SCENTORA standard</h2>
          </div>
          <div className="about-values">
            {[
              { icon: '✓', title: 'Authenticity, always', text: 'Sourced from the brand or authorised distributors. Code-verifiable.' },
              { icon: '✎', title: 'Editorial curation', text: 'We edit relentlessly so you only meet the scents that matter.' },
              { icon: '✉', title: 'Gifting, exacted', text: 'Free signature wrapping with every order, every time.' },
              { icon: '↻', title: 'Returns without hustle', text: '30 days, no questions. Because discovery should be safe.' },
            ].map((v) => (
              <div className="about-value" key={v.title}>
                <span className="about-value__icon" aria-hidden="true">{v.icon}</span>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section__heading section__heading--center">
            <span className="section__eyebrow">The maisons</span>
            <h2 className="section__title">Houses we carry</h2>
          </div>
          <div className="about-brands">
            {brands.map((b) => (
              <Link to={`/brand/${b.slug}`} key={b.slug} className="about-brand">
                <SparkleIcon width={14} height={14} />
                {b.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}