export const formatPrice = (amount, currency = 'EGP') =>
  new Intl.NumberFormat('en-EG', {
    style: 'currency',
    currency: 'EGP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

export const cx = (...classNames) => classNames.filter(Boolean).join(' ');

export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export const discountPercent = (product) => {
  if (!product.compareAtPrice || product.compareAtPrice <= product.price) return 0;
  return Math.round((1 - product.price / product.compareAtPrice) * 100);
};

export const isOnSale = (product) => discountPercent(product) > 0;

export const normalize = (value) =>
  value
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

export const slugify = (value) =>
  normalize(value).trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const searchProducts = (products, query) => {
  const q = normalize(query).trim();
  if (!q) return [];
  return products.filter((p) => {
    const haystack = [
      p.name,
      p.brand,
      p.category,
      p.gender,
      p.scentFamily,
      p.topNotes,
      p.heartNotes,
      p.baseNotes,
      p.tags.join(' '),
      p.shortDescription,
    ]
      .join(' ')
      .toLowerCase();
    return normalize(haystack).includes(q);
  });
};

export const getProductInStockStatus = (stock) =>
  stock <= 0 ? 'out' : stock <= 10 ? 'low' : 'in';

export const STOCK_LABELS = {
  in: 'In Stock',
  low: 'Low Stock',
  out: 'Out of Stock',
};

export const STORAGE_KEYS = {
  cart: 'scentora_cart_v1',
  wishlist: 'scentora_wishlist_v1',
  recentlyViewed: 'scentora_recently_viewed_v1',
  user: 'scentora_user_v1',
  orders: 'scentora_orders_v1',
  searchHistory: 'scentora_search_history_v1',
  adminProducts: 'scentora_admin_products_v1',
};

export const summaryStats = (items) => ({
  subtotal: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
  count: items.reduce((sum, i) => sum + i.quantity, 0),
});