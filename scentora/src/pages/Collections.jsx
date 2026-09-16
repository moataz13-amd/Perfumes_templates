import React from 'react';
import { products } from '../data/products';
import ProductCard from '../components/common/ProductCard';
import Breadcrumbs from '../components/common/Breadcrumbs';
import EmptyState from '../components/common/EmptyState';
import { isOnSale } from '../utils/helpers';

function CollectionPage({ title, subtitle, items, eyebrow }) {
  return (
    <div>
      <div className="page-hero">
        <div className="container">
          <Breadcrumbs />
          <span className="section__eyebrow">{eyebrow}</span>
          <h1 className="page-hero__title">{title}</h1>
          <p className="page-hero__subtitle">{subtitle}</p>
        </div>
      </div>
      <div className="container container--page">
        {items.length === 0 ? (
          <EmptyState
            title="Nothing to see yet"
            message="Check back soon or browse the full collection."
            actionLabel="Shop all fragrances"
            actionTo="/shop"
          />
        ) : (
          <>
            <p className="collection-count">{items.length} products</p>
            <div className="product-grid">
              {items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function NewArrivals() {
  const items = products.filter((p) => p.isNew);
  return (
    <CollectionPage
      title="New Arrivals"
      eyebrow="Just landed"
      subtitle="The freshest drops from your favourite houses."
      items={items}
    />
  );
}

export function BestSellers() {
  const items = products.filter((p) => p.isBestSeller);
  return (
    <CollectionPage
      title="Best Sellers"
      eyebrow="Most loved"
      subtitle="The fragrances your peers can't stop buying."
      items={items}
    />
  );
}

export function Sale() {
  const items = products.filter(isOnSale);
  return (
    <CollectionPage
      title="Sale"
      eyebrow="Limited time"
      subtitle="Signature scents at their most irresistible prices."
      items={items}
    />
  );
}