import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/common/ProductCard';
import Breadcrumbs from '../components/common/Breadcrumbs';
import { SkeletonGrid } from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import Pagination from '../components/common/Pagination';
import {
  FilterIcon,
  CloseIcon,
  ChevronDown,
} from '../components/common/icons';
import {
  SORT_OPTIONS,
  BRAND_OPTIONS,
  GENDER_OPTIONS,
  CATEGORY_OPTIONS,
  CheckFilter,
  FilterGroup,
  getFacetCounts,
  matchesFamily,
} from '../components/shop/filters';
import { products } from '../data/products';
import { cx } from '../utils/helpers';

const PRICE_BUCKETS = [
  { id: 'p0', label: 'Under $100', min: 0, max: 100 },
  { id: 'p1', label: '$100 - $150', min: 100, max: 150 },
  { id: 'p2', label: '$150 - $250', min: 150, max: 250 },
  { id: 'p3', label: '$250+', min: 250, max: Infinity },
];

const RATING_OPTIONS = [4.5, 4, 3.5];

const PER_PAGE = 12;

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialSort = searchParams.get('sort') || 'Featured';
  const [sort, setSort] = useState(initialSort);
  const [brandsSelected, setBrandsSelected] = useState([]);
  const [gendersSelected, setGendersSelected] = useState([]);
  const [categoriesSelected, setCategoriesSelected] = useState([]);
  const [familiesSelected, setFamiliesSelected] = useState([]);
  const [concentrations, setConcentrations] = useState([]);
  const [sizeSelected, setSizeSelected] = useState([]);
  const [priceRanges, setPriceRanges] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [availability, setAvailability] = useState('all');
  const [saleOnly, setSaleOnly] = useState(searchParams.get('sale') === '1');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const gender = searchParams.get('gender');
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const family = searchParams.get('family');
    const sale = searchParams.get('sale');
    const s = searchParams.get('sort');
    if (gender) setGendersSelected([gender]);
    if (category) setCategoriesSelected([category]);
    if (brand) setBrandsSelected([brand]);
    if (family) setFamiliesSelected([family]);
    if (sale === '1') setSaleOnly(true);
    if (s) setSort(s);
  }, [searchParams]);

  const activeFilterCount =
    brandsSelected.length +
    gendersSelected.length +
    categoriesSelected.length +
    familiesSelected.length +
    concentrations.length +
    sizeSelected.length +
    priceRanges.length +
    (minRating > 0 ? 1 : 0) +
    (availability !== 'all' ? 1 : 0) +
    (saleOnly ? 1 : 0);

  const facetCounts = useMemo(() => getFacetCounts(products), []);

  const filtered = useMemo(() => {
    let list = [...products];

    if (saleOnly) list = list.filter((p) => p.compareAtPrice && p.compareAtPrice > p.price);
    if (brandsSelected.length) {
      list = list.filter((p) => brandsSelected.includes(p.brand));
    }
    if (gendersSelected.length) {
      list = list.filter((p) => gendersSelected.includes(p.gender));
    }
    if (categoriesSelected.length) {
      list = list.filter((p) => categoriesSelected.includes(p.category));
    }
    if (familiesSelected.length) {
      list = list.filter((p) =>
        familiesSelected.some((f) => matchesFamily(p, f, list))
      );
    }
    if (concentrations.length) {
      list = list.filter((p) => concentrations.includes(p.concentration));
    }
    if (sizeSelected.length) {
      list = list.filter((p) => p.size.some((s) => sizeSelected.includes(s)));
    }
    if (priceRanges.length) {
      list = list.filter((p) =>
        priceRanges.some((r) => {
          const bucket = PRICE_BUCKETS.find((b) => b.id === r);
          return p.price >= bucket.min && p.price < bucket.max;
        })
      );
    }
    if (minRating > 0) list = list.filter((p) => p.rating >= minRating);
    if (availability === 'in_stock') list = list.filter((p) => p.stock > 0);
    if (availability === 'low_stock') {
      list = list.filter((p) => p.stock > 0 && p.stock <= 10);
    }
    if (availability === 'out_of_stock') list = list.filter((p) => p.stock <= 0);

    switch (sort) {
      case 'Best Selling':
        list = list.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'Newest':
        list = list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'Price: Low to High':
        list = list.sort((a, b) => a.price - b.price);
        break;
      case 'Price: High to Low':
        list = list.sort((a, b) => b.price - a.price);
        break;
      case 'Highest Rated':
        list = list.sort((a, b) => b.rating - a.rating);
        break;
      default:
        list = list.sort(
          (a, b) =>
            (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0) ||
            b.reviewCount - a.reviewCount
        );
    }

    return list;
  }, [
    products,
    sort,
    saleOnly,
    brandsSelected,
    gendersSelected,
    categoriesSelected,
    familiesSelected,
    concentrations,
    sizeSelected,
    priceRanges,
    minRating,
    availability,
  ]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 250);
    return () => clearTimeout(t);
  }, [sort, brandsSelected.join(','), gendersSelected.join(','), categoriesSelected.join(','), familiesSelected.join(','), concentrations.join(','), sizeSelected.join(','), priceRanges.join(','), minRating, availability, saleOnly, page]);

  const toggleMulti = (setter, value) => {
    setPage(1);
    setter((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  };

  const clearAll = () => {
    setBrandsSelected([]);
    setGendersSelected([]);
    setCategoriesSelected([]);
    setFamiliesSelected([]);
    setConcentrations([]);
    setSizeSelected([]);
    setPriceRanges([]);
    setMinRating(0);
    setAvailability('all');
    setSaleOnly(false);
    setSort('Featured');
    setPage(1);
    setSearchParams({});
  };

  const FilterContent = (
    <React.Fragment>
      <div className="shop-filters__active">
        <span>{activeFilterCount} filters active</span>
        {activeFilterCount > 0 && (
          <button className="link-arrow" onClick={clearAll}>
            Clear all
          </button>
        )}
      </div>

      <FilterGroup title="Brand">
        <div className="filter-scroll">
          {BRAND_OPTIONS.map((b) => (
            <CheckFilter
              key={b}
              label={b}
              checked={brandsSelected.includes(b)}
              onChange={() => toggleMulti(setBrandsSelected, b)}
              count={facetCounts.brand[b] || 0}
            />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Gender">
        {GENDER_OPTIONS.map((g) => (
          <CheckFilter
            key={g.value}
            label={g.label}
            checked={gendersSelected.includes(g.value)}
            onChange={() => toggleMulti(setGendersSelected, g.value)}
            count={facetCounts.gender[g.value]}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Category">
        {CATEGORY_OPTIONS.map((c) => (
          <CheckFilter
            key={c}
            label={c}
            checked={categoriesSelected.includes(c)}
            onChange={() => toggleMulti(setCategoriesSelected, c)}
            count={facetCounts.category[c] || 0}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Fragrance Family">
        {[
          ['woody', 'Woody & Earthy'],
          ['floral', 'Floral'],
          ['fresh', 'Fresh & Aquatic'],
          ['oriental', 'Oriental & Amber'],
          ['smoky', 'Smoky & Leather'],
          ['gourmand', 'Gourmand'],
        ].map(([slug, label]) => (
          <CheckFilter
            key={slug}
            label={label}
            checked={familiesSelected.includes(slug)}
            onChange={() => toggleMulti(setFamiliesSelected, slug)}
            count={facetCounts.family[slug]}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Concentration">
        {Array.from(new Set(products.map((p) => p.concentration))).map((c) => (
          <CheckFilter
            key={c}
            label={c}
            checked={concentrations.includes(c)}
            onChange={() => toggleMulti(setConcentrations, c)}
            count={facetCounts.concentration[c] || 0}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Size">
        {['30', '50', '60', '90', '100'].map((s) => (
          <CheckFilter
            key={s}
            label={`${s} ml`}
            checked={sizeSelected.includes(s)}
            onChange={() => toggleMulti(setSizeSelected, s)}
            count={facetCounts.size[s] || 0}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Price">
        {PRICE_BUCKETS.map((b) => (
          <CheckFilter
            key={b.id}
            label={b.label}
            checked={priceRanges.includes(b.id)}
            onChange={() => toggleMulti(setPriceRanges, b.id)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Rating" defaultOpen={false}>
        {RATING_OPTIONS.map((r) => (
          <label className="check-filter" key={r}>
            <input
              type="radio"
              className="check-filter__input"
              checked={minRating === r}
              onChange={() => {
                setPage(1);
                setMinRating((prev) => (prev === r ? 0 : r));
              }}
            />
            <span className="check-filter__radio" />
            <span className="check-filter__label">★ {r} & above</span>
          </label>
        ))}
      </FilterGroup>

      <FilterGroup title="Availability" defaultOpen={false}>
        {[
          ['all', 'All'],
          ['in_stock', 'In Stock'],
          ['low_stock', 'Low Stock'],
          ['out_of_stock', 'Out of Stock'],
        ].map(([v, label]) => (
          <label className="check-filter" key={v}>
            <input
              type="radio"
              className="check-filter__input"
              checked={availability === v}
              onChange={() => {
                setPage(1);
                setAvailability(v);
              }}
            />
            <span className="check-filter__radio" />
            <span className="check-filter__label">{label}</span>
          </label>
        ))}
      </FilterGroup>
    </React.Fragment>
  );

  return (
    <div className="shop-page">
      <div className="page-hero page-hero--shop">
        <div className="container">
          <Breadcrumbs />
          <h1 className="page-hero__title">
            {categoriesSelected[0] === 'Niche'
              ? 'Niche Fragrances'
              : categoriesSelected[0] === 'Gift Sets'
                ? 'Gift Sets'
                : saleOnly
                  ? 'Sale'
                  : 'All Fragrances'}
          </h1>
          <p className="page-hero__subtitle">
            {filtered.length} fragrances from the world's most celebrated houses.
          </p>
        </div>
      </div>

      <div className="container">
        <div className="shop-layout">
          <aside className="shop-filters" aria-label="Filters">
            {FilterContent}
          </aside>

          <div className="shop-content">
            <div className="shop-toolbar">
              <button
                className="btn btn--ghost shop-toolbar__filters-btn"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <FilterIcon width={16} height={16} />
                Filters
                {activeFilterCount > 0 && (
                  <span className="shop-toolbar__count">{activeFilterCount}</span>
                )}
              </button>

              <div className="shop-toolbar__results">
                Showing {paged.length} of {filtered.length}
              </div>

              <div className="shop-toolbar__sort">
                <label htmlFor="sort">Sort:</label>
                <div className="sort-select">
                  <select
                    id="sort"
                    value={sort}
                    onChange={(e) => {
                      setSort(e.target.value);
                      setPage(1);
                    }}
                  >
                    {SORT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown width={14} height={14} />
                </div>
              </div>
            </div>

            {loading ? (
              <SkeletonGrid count={8} />
            ) : paged.length === 0 ? (
              <EmptyState
                title="No fragrances match"
                message="Try adjusting or removing some filters to find what you're looking for."
                actionLabel="Clear all filters"
                onAction={clearAll}
              />
            ) : (
              <>
                <div className="product-grid">
                  {paged.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                <Pagination
                  page={safePage}
                  totalPages={totalPages}
                  onChange={(p) => {
                    setPage(p);
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                />
              </>
            )}
          </div>
        </div>
      </div>

      <div
        className={cx('mobile-filters-overlay', mobileFiltersOpen && 'is-open')}
      >
        <div
          className="mobile-filters-overlay__backdrop"
          onClick={() => setMobileFiltersOpen(false)}
        />
        <div className="mobile-filters" role="dialog" aria-label="Filters" aria-modal="true">
          <div className="mobile-filters__header">
            <h2>Filters</h2>
            <button
              className="icon-btn"
              onClick={() => setMobileFiltersOpen(false)}
              aria-label="Close filters"
            >
              <CloseIcon />
            </button>
          </div>
          <div className="mobile-filters__body">{FilterContent}</div>
          <div className="mobile-filters__footer">
            <button
              className="btn btn--primary btn--block"
              onClick={() => setMobileFiltersOpen(false)}
            >
              Show {filtered.length} results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}