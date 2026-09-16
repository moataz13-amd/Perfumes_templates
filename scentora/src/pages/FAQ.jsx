import React, { useState } from 'react';
import Breadcrumbs from '../components/common/Breadcrumbs';
import Accordion from '../components/common/Accordion';
import { faqs } from '../data/reviews';
import { SearchIcon } from '../components/common/icons';
import { normalize } from '../utils/helpers';

export default function FAQ() {
  const [query, setQuery] = useState('');
  const q = normalize(query).trim();

  return (
    <div>
      <div className="page-hero page-hero--min">
        <div className="container">
          <Breadcrumbs />
          <span className="section__eyebrow">Help centre</span>
          <h1 className="page-hero__title">Frequently asked questions</h1>
          <p className="page-hero__subtitle">
            Everything about ordering, shipping, returns and our fragrances.
          </p>
          <div className="faq-search">
            <SearchIcon width={18} height={18} />
            <input
              type="search"
              placeholder="Search for answers…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search FAQ"
            />
          </div>
        </div>
      </div>

      <div className="container container--page">
        {faqs.map((group) => {
          const filtered = q
            ? group.items.filter((item) =>
                normalize(item.q + ' ' + item.a).includes(q)
              )
            : group.items;
          if (filtered.length === 0) return null;
          return (
            <section className="faq-group" key={group.category}>
              <h2 className="faq-group__title">{group.category}</h2>
              <Accordion items={filtered} />
            </section>
          );
        })}
        {q && faqs.every((g) => g.items.every((i) => !normalize(i.q + ' ' + i.a).includes(q))) && (
          <p className="faq-none">No matches for “{query}”. Try a different keyword or <a href="/contact">contact us</a>.</p>
        )}

        <section className="faq-bottom">
          <h2>Still stuck?</h2>
          <p>Our care team is happy to help with anything else.</p>
          <div>
            <a href="/contact" className="btn btn--primary">Contact support</a>
            <a href="mailto:hello@scentora.com" className="btn btn--ghost">Email us</a>
          </div>
        </section>
      </div>
    </div>
  );
}