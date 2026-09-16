import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getBrandBySlug } from '../data/brands';
import { products } from '../data/products';
import ProductCard from '../components/common/ProductCard';
import Breadcrumbs from '../components/common/Breadcrumbs';
import EmptyState from '../components/common/EmptyState';
import { SkeletonGrid } from '../components/common/Skeleton';
import { ChevronDown } from '../components/common/icons';
import { SORT_OPTIONS } from '../components/shop/filters';

const BRAND_SORT_OPTIONS = SORT_OPTIONS.slice(0, -1);

export default function BrandDetails() {
  const { brand: brandSlug } = useParams();
  const brand = getBrandBySlug(brandSlug);
  const [sort, setSort] = useState('Featured');
  const [gender, setGender] = useState('All');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const brandProducts = useMemo(
    () =>
      products.filter((p) => p.brand === (brand ? brand.name : '')),
    [brand]
  );

  const genders = useMemo(
    () => ['All', ...new Set(brandProducts.map((p) => p.gender))],
    [brandProducts]
  );

  const categories = useMemo(
    () => ['All', ...new Set(brandProducts.map((p) => p.category))],
    [brandProducts]
  );

  const filtered = useMemo(() => {
    let list = brandProducts;
    if (gender !== 'All') list = list.filter((p) => p.gender === gender);
    if (category !== 'All') list = list.filter((p) => p.category === category);
    switch (sort) {
      case 'Best Selling':
        list = [...list].sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'Newest':
        list = [...list].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'Price: Low to High':
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case 'Price: High to Low':
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case 'Highest Rated':
        list = [...list].sort((a, b) => b.rating - a.rating);
        break;
      default:
        list = [...list].sort(
          (a, b) =>
            (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0) ||
            b.reviewCount - a.reviewCount
        );
    }
    return list;
  }, [brandProducts, gender, category, sort]);

  const changeFilter = (fn) => {
    setLoading(true);
    fn();
    setTimeout(() => setLoading(false), 250);
  };

  if (!brand) {
    return (
      <div className="container container--page">
        <EmptyState
          title="House not found"
          message="We couldn't find that brand. Explore all our maisons instead."
          actionLabel="Explore brands"
          actionTo="/brands"
        />
      </div>
    );
  }

  const FilterControls = (
    <React.Fragment>
      <label className="filter-inline">
        <span>Gender</span>
        <select value={gender} onChange={(e) => changeFilter(() => setGender(e.target.value))}>
          {genders.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </label>
      <label className="filter-inline">
        <span>Category</span>
        <select value={category} onChange={(e) => changeFilter(() => setCategory(e.target.value))}>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>
    </React.Fragment>
  );

  return (
    <div>
      <section className="brand-hero">
        <img src={brand.heroImage} alt={brand.name} />
        <div className="brand-hero__shade" aria-hidden="true" />
        <div className="container">
          <Breadcrumbs items={[{ label: 'Brands', to: '/brands' }, { label: brand.name }]} />
          <div className="brand-hero__content">
            <span className="brand-hero__est">
              Est. {brand.founded} · {brand.country}
            </span>
            <h1>{brand.name}</h1>
            <p>{brand.tagline}</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="brand-description">
            <span className="section__eyebrow">The house</span>
            <p>{brand.description}</p>
          </div>
        </div>
      </section>

      <section className="container container--page">
        <div className="store-header">
          <h2>
            {brand.name} Fragrances{' '}
            <span className="store-header__count">{filtered.length}</span>
          </h2>
          <div className="store-header__controls">
            {FilterControls}
            <label className="filter-inline">
              <span>Sort</span>
              <select
                value={sort}
                onChange={(e) => changeFilter(() => setSort(e.target.value))}
              >
                {BRAND_SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>

            <button
              className="btn btn--ghost store-header__mobile-filter"
              onClick={() => setMobileFiltersOpen(true)}
            >
              Filters
            </button>
          </div>
        </div>

        {loading ? (
          <SkeletonGrid count={8} />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No fragrances match"
            message="Adjust your filters to see more of this collection."
          />
        ) : (
          <div className="product-grid">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="brand-footer-cta">
          <h3>Want to explore more houses?</h3>
          <Link to="/brands" className="btn btn--primary">
            Browse all brands
          </Link>
        </div>
      </section>
    </div>
  );
}