import React from 'react';
import { ChevronDown } from '../common/icons';
import { cx } from '../../utils/helpers';
import { brands } from '../../data/brands';
import { products } from '../../data/products';

export const SORT_OPTIONS = [
  { value: 'Featured', label: 'Featured' },
  { value: 'Best Selling', label: 'Best Selling' },
  { value: 'Newest', label: 'Newest' },
  { value: 'Price: Low to High', label: 'Price: Low to High' },
  { value: 'Price: High to Low', label: 'Price: High to Low' },
  { value: 'Highest Rated', label: 'Highest Rated' },
];

export const BRAND_OPTIONS = brands.map((b) => b.name);
export const GENDER_OPTIONS = [
  { value: 'Men', label: 'Men' },
  { value: 'Women', label: 'Women' },
  { value: 'Unisex', label: 'Unisex' },
];
export const CATEGORY_OPTIONS = [
  'Men',
  'Women',
  'Unisex',
  'Niche',
  'Gift Sets',
];

export const FAMILY_KEYWORDS = {
  woody: ['woody', 'amber', 'cedar', 'oud', 'sandalwood', 'vetiver'],
  floral: ['floral', 'rose', 'jasmine', 'peony'],
  fresh: ['aquatic', 'fresh', 'citrus', 'marine'],
  oriental: ['oriental', 'amber', 'vanilla', 'spicy'],
  smoky: ['smoky', 'leather', 'tobacco', 'incense'],
  gourmand: ['gourmand', 'caramel', 'honey', 'coffee', 'chocolate', 'cacao'],
};

export function matchesFamily(product, familySlug, productList = products) {
  const keywords = FAMILY_KEYWORDS[familySlug];
  if (!keywords) return true;
  const haystack = (
    product.scentFamily +
    ' ' +
    product.topNotes +
    ' ' +
    product.heartNotes +
    ' ' +
    product.baseNotes +
    ' ' +
    product.tags.join(' ')
  ).toLowerCase();
  return keywords.some((k) => haystack.includes(k));
}

export function FilterGroup({ title, children, defaultOpen = true }) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div className={cx('filter-group', open && 'is-open')}>
      <button
        className="filter-group__trigger"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span>{title}</span>
        <ChevronDown width={14} height={14} />
      </button>
      <div className="filter-group__panel" hidden={!open}>
        {children}
      </div>
    </div>
  );
}

export function CheckFilter({
  label,
  checked,
  onChange,
  count,
}) {
  return (
    <label className="check-filter">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="check-filter__input"
      />
      <span className="check-filter__box" />
      <span className="check-filter__label">{label}</span>
      {count != null && <span className="check-filter__count">{count}</span>}
    </label>
  );
}

export function RadioFilter({ label, checked, onChange, count }) {
  return (
    <label className="check-filter">
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        className="check-filter__input"
      />
      <span className="check-filter__radio" />
      <span className="check-filter__label">{label}</span>
      {count != null && <span className="check-filter__count">{count}</span>}
    </label>
  );
}

export function getFacetCounts(productList) {
  const counts = {
    brand: {},
    gender: { Men: 0, Women: 0, Unisex: 0 },
    category: {},
    concentration: {},
    size: {},
    family: {
      woody: 0,
      floral: 0,
      fresh: 0,
      oriental: 0,
      smoky: 0,
      gourmand: 0,
    },
  };
  productList.forEach((p) => {
    counts.brand[p.brand] = (counts.brand[p.brand] || 0) + 1;
    if (counts.gender[p.gender] != null) counts.gender[p.gender] += 1;
    counts.category[p.category] = (counts.category[p.category] || 0) + 1;
    counts.concentration[p.concentration] =
      (counts.concentration[p.concentration] || 0) + 1;
    p.size.forEach((s) => {
      counts.size[s] = (counts.size[s] || 0) + 1;
    });
    Object.keys(FAMILY_KEYWORDS).forEach((slug) => {
      if (matchesFamily(p, slug)) counts.family[slug] += 1;
    });
  });
  return counts;
}

export { products as allProducts };