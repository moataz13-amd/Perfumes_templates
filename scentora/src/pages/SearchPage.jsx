import React, { useMemo, useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { products } from '../data/products';
import { brands } from '../data/brands';
import { searchProducts, normalize } from '../utils/helpers';
import ProductCard from '../components/common/ProductCard';
import Breadcrumbs from '../components/common/Breadcrumbs';
import EmptyState from '../components/common/EmptyState';
import { SearchIcon } from '../components/common/icons';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [input, setInput] = useState(query);

  useEffect(() => {
    setInput(query);
  }, [query]);

  const results = useMemo(() => {
    if (!query.trim()) return { products: [], brands: [], categories: [] };
    const q = normalize(query).trim();

    const productResults = searchProducts(products, q);

    const brandResults = brands
      .filter(
        (b) =>
          normalize(b.name).includes(q) ||
          normalize(b.description).includes(q) ||
          normalize(b.tagline).includes(q)
      )
      .slice(0, 6);

    const categoryKeywords = {
      men: 'Men',
      women: 'Women',
      unisex: 'Unisex',
      niche: 'Niche',
      'gift': 'Gift Sets',
      'gift sets': 'Gift Sets',
      'new': 'New Arrivals',
      'new arrivals': 'New Arrivals',
      sale: 'Sale',
      'best': 'Best Sellers',
      'best sellers': 'Best Sellers',
    };

    let categoryResults = [];
    Object.keys(categoryKeywords).forEach((key) => {
      if (q.includes(key)) {
        categoryResults.push({ label: categoryKeywords[key], ...categoryMeta(categoryKeywords[key], q) });
      }
    });

    return { products: productResults, brands: brandResults, categories: categoryResults };
  }, [query]);

  const total = results.products.length + results.brands.length + results.categories.length;

  const setQuery = (value) => setSearchParams(value ? { q: value } : {});

  const submit = (e) => {
    e.preventDefault();
    setQuery(input);
  };

  return (
    <div>
      <div className="page-hero">
        <div className="container">
          <Breadcrumbs />
          <h1 className="page-hero__title">Search</h1>
          <form className="search-page__form" onSubmit={submit} role="search">
            <SearchIcon width={20} height={20} />
            <input
              type="search"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search by name, brand, note, family…"
              autoFocus
              aria-label="Search fragrances"
            />
            <button className="btn btn--primary" type="submit" disabled={!input.trim()}>
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="container container--page">
        {query.trim() === '' ? (
          <EmptyState
            title="Search for a fragrance"
            message="Try “Aventus”, “rose”, “Dior”, “oud” or “new arrivals”."
          />
        ) : total === 0 ? (
          <EmptyState
            title={`No results for “${query}”`}
            message="Check the spelling, or try a different scent note or brand."
            actionLabel="Browse all products"
            actionTo="/shop"
          />
        ) : (
          <>
            <p className="search-page__summary">
              {total} result{total !== 1 && 's'} for <strong>“{query}”</strong>
            </p>

            {results.categories.length > 0 && (
              <section className="search-section">
                <h2 className="search-section__title">Categories</h2>
                <div className="search-categories">
                  {results.categories.map((c) => (
                    <Link
                      key={c.label}
                      to={c.to}
                      className="search-category-chip"
                    >
                      {c.label}
                      <span aria-hidden="true">→</span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {results.brands.length > 0 && (
              <section className="search-section">
                <h2 className="search-section__title">Maisons</h2>
                <div className="search-brands">
                  {results.brands.map((b) => (
                    <Link to={`/brand/${b.slug}`} className="search-brand" key={b.slug}>
                      <img src={b.heroImage} alt="" />
                      <div>
                        <strong>{b.name}</strong>
                        <span>{b.tagline}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {results.products.length > 0 && (
              <section className="search-section">
                <h2 className="search-section__title">
                  Fragrances <span>({results.products.length})</span>
                </h2>
                <div className="product-grid">
                  {results.products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function categoryMeta(label, q) {
  const map = {
    Men: '/shop?gender=Men',
    Women: '/shop?gender=Women',
    Unisex: '/shop?gender=Unisex',
    Niche: '/shop?category=Niche',
    'Gift Sets': '/shop?category=Gift%20Sets',
    'New Arrivals': '/new-arrivals',
    'Best Sellers': '/best-sellers',
    Sale: '/sale',
  };
  return { to: map[label] || '/shop' };
}