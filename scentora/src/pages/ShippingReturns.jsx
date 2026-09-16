import React from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/common/Breadcrumbs';
import { TruckIcon, RotateIcon, ShieldIcon, GiftIcon } from '../components/common/icons';
import { faqs } from '../data/reviews';

const BLOCKS = [
  {
    icon: <TruckIcon width={20} height={20} />,
    title: 'Shipping',
    body: (
      <>
        <ul>
          <li>Free standard shipping on all orders over $100.</li>
          <li>Standard delivery: 3–5 business days.</li>
          <li>Express delivery: 1–2 business days, $12.</li>
          <li>International shipping to 40+ countries.</li>
          <li>Orders over $300 ship fully insured.</li>
        </ul>
      </>
    ),
  },
  {
    icon: <RotateIcon width={20} height={20} />,
    title: 'Returns & Refunds',
    body: (
      <>
        <ul>
          <li>30-day return window from delivery date.</li>
          <li>Sealed and unused products only unless faulty.</li>
          <li>Free prepaid returns label via your account.</li>
          <li>Refunds in 5–7 business days after inspection.</li>
          <li>Gift returns are exchanged, never refunded to the buyer.</li>
        </ul>
      </>
    ),
  },
  {
    icon: <ShieldIcon width={20} height={20} />,
    title: 'Authenticity',
    body: (
      <>
        <ul>
          <li>100% genuine products from brand or authorised distributors.</li>
          <li>Batch codes printed on every carton.</li>
          <li>Verification tool available on request.</li>
        </ul>
      </>
    ),
  },
  {
    icon: <GiftIcon width={20} height={20} />,
    title: 'Gifting',
    body: (
      <>
        <ul>
          <li>Complimentary black box and ribbon on every order.</li>
          <li>Handwritten gift notes available ($0).</li>
          <li>Prices never shown on delivery notes.</li>
        </ul>
      </>
    ),
  },
];

export default function ShippingReturns() {
  return (
    <div>
      <div className="page-hero page-hero--min">
        <div className="container">
          <Breadcrumbs />
          <span className="section__eyebrow">Policies</span>
          <h1 className="page-hero__title">Shipping &amp; Returns</h1>
          <p className="page-hero__subtitle">
            Clear, customer-first policies \u2014 no fine print surprises.
          </p>
        </div>
      </div>

      <div className="container container--page">
        <div className="policy-grid">
          {BLOCKS.map((b) => (
            <div className="policy-card" key={b.title}>
              <span className="policy-card__icon">{b.icon}</span>
              <h2>{b.title}</h2>
              <div className="policy-card__body">{b.body}</div>
            </div>
          ))}
        </div>

        <section className="policy-note">
          <h2>Still have questions?</h2>
          <p>Check the FAQ or get in touch with our care team.</p>
          <div>
            <Link to="/faq" className="btn btn--ghost">Read the FAQ</Link>
            <Link to="/contact" className="btn btn--primary">Contact us</Link>
          </div>
        </section>
      </div>
    </div>
  );
}