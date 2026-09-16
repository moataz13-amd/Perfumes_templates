import React from 'react';
import { Link } from 'react-router-dom';
import { TruckIcon, ShieldIcon, RotateIcon, GiftIcon } from '../common/icons';

const VALUES = [
  {
    icon: <TruckIcon width={28} height={28} />,
    title: 'Free Shipping',
    text: 'Free standard shipping on orders over $100.',
  },
  {
    icon: <ShieldIcon width={28} height={28} />,
    title: '100% Authentic',
    text: 'Every bottle sourced directly from the house.',
  },
  {
    icon: <RotateIcon width={28} height={28} />,
    title: '30-Day Returns',
    text: 'Unused products, returned hassle-free.',
  },
  {
    icon: <GiftIcon width={28} height={28} />,
    title: 'Signature Gifting',
    text: 'Complimentary black box and ribbon.',
  },
];

export default function ValueProps() {
  return (
    <section className="value-props" aria-label="Why shop with us">
      <div className="container">
        <div className="value-props__grid">
          {VALUES.map((v) => (
            <div className="value-prop" key={v.title}>
              <span className="value-prop__icon">{v.icon}</span>
              <div>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}