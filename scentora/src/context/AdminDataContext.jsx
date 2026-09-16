import { createContext, useContext, useMemo, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { products as seedProducts } from '../data/products';
import { brands as seedBrands, getBrandSlug } from '../data/brands';
import { allOrdersForAdmin, coupons as seedCoupons } from '../data/reviews';

const AdminDataContext = createContext(null);

export function AdminDataProvider({ children }) {
  const [catalog, setCatalog] = useLocalStorage('scentora_admin_catalog_v1', seedProducts);
  const [brandList, setBrandList] = useLocalStorage('scentora_admin_brands_v1', seedBrands);
  const [orders, setOrders] = useLocalStorage('scentora_admin_orders_v1', allOrdersForAdmin.orders);
  const [customers] = useLocalStorage('scentora_admin_customers_v1', allOrdersForAdmin.customers);
  const [coupons, setCoupons] = useLocalStorage('scentora_admin_coupons_v1', seedCoupons);
  const [reviews, setReviews] = useLocalStorage('scentora_admin_reviews_v1', []);

  const getProductById = useCallback(
    (id) => catalog.find((p) => p.id === Number(id)),
    [catalog]
  );

  const addProduct = useCallback(
    (product, { publish = true } = {}) => {
      const id = Math.max(0, ...catalog.map((p) => p.id)) + 1;
      const next = {
        ...product,
        id,
        slug: product.slug || getBrandSlug(product.brand) + '-' + product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        sku: product.sku || `SCN-ADM-${String(id).padStart(3, '0')}`,
        stock: product.stock ?? 0,
        rating: product.rating ?? 0,
        reviewCount: product.reviewCount ?? 0,
        isNew: product.isNew ?? publish,
        currency: 'USD',
        images: product.images?.length ? product.images : ['https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=600&auto=format&fit=crop'],
        season: product.season || ['All Seasons'],
        tags: product.tags || [],
      };
      setCatalog((prev) => [next, ...prev]);
      return next;
    },
    [catalog, setCatalog]
  );

  const updateProduct = useCallback(
    (id, patch) => {
      setCatalog((prev) =>
        prev.map((p) => (p.id === Number(id) ? { ...p, ...patch, id: p.id } : p))
      );
    },
    [setCatalog]
  );

  const removeProducts = useCallback(
    (ids) => setCatalog((prev) => prev.filter((p) => !ids.includes(p.id))),
    [setCatalog]
  );

  const bulkUpdateStatus = useCallback(
    (ids, status) => {
      setCatalog((prev) =>
        prev.map((p) =>
          ids.includes(p.id)
            ? {
                ...p,
                status: status,
                isNew: status === 'active' ? p.isNew : true,
              }
            : p
        )
      );
    },
    [setCatalog]
  );

  const adjustStock = useCallback(
    (id, delta) => {
      setCatalog((prev) =>
        prev.map((p) =>
          p.id === Number(id)
            ? { ...p, stock: Math.max(0, (p.stock || 0) + delta) }
            : p
        )
      );
    },
    [setCatalog]
  );

  const setStock = useCallback(
    (id, value) => {
      setCatalog((prev) =>
        prev.map((p) =>
          p.id === Number(id) ? { ...p, stock: Math.max(0, Number(value) || 0) } : p
        )
      );
    },
    [setCatalog]
  );

  const updateBrand = useCallback(
    (slug, patch) => {
      setBrandList((prev) =>
        prev.map((b) => (b.slug === slug ? { ...b, ...patch } : b))
      );
    },
    [setBrandList]
  );

  const addBrand = useCallback(
    (brand) => {
      const slug = getBrandSlug(brand.name);
      if (brandList.some((b) => b.slug === slug)) return { error: 'Brand already exists' };
      const next = { ...brand, slug, featured: false };
      setBrandList((prev) => [...prev, next]);
      return { brand: next };
    },
    [brandList, setBrandList]
  );

  const updateOrderStatus = useCallback(
    (id, status) => {
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    },
    [setOrders]
  );

  const cancelOrder = useCallback(
    (id) => {
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: 'Cancelled' } : o)));
    },
    [setOrders]
  );

  const refundOrder = useCallback(
    (id) => {
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: 'Refunded' } : o)));
    },
    [setOrders]
  );

  const addCoupon = useCallback(
    (coupon) => {
      if (coupons.some((c) => c.code.toUpperCase() === coupon.code.toUpperCase())) {
        return { error: 'Coupon code already exists' };
      }
      const next = { ...coupon, status: 'active', used: 0 };
      setCoupons((prev) => [next, ...prev]);
      return { coupon: next };
    },
    [coupons, setCoupons]
  );

  const updateCoupon = useCallback(
    (code, patch) => {
      setCoupons((prev) =>
        prev.map((c) => (c.code === code ? { ...c, ...patch } : c))
      );
    },
    [setCoupons]
  );

  const removeCoupon = useCallback(
    (code) => setCoupons((prev) => prev.filter((c) => c.code !== code)),
    [setCoupons]
  );

  const updateReviewStatus = useCallback(
    (id, status) => {
      setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    },
    [setReviews]
  );

  const removeReview = useCallback(
    (id) => setReviews((prev) => prev.filter((r) => r.id !== id)),
    [setReviews]
  );

  const value = useMemo(
    () => ({
      catalog,
      brandList,
      orders,
      customers,
      coupons,
      reviews,
      getProductById,
      addProduct,
      updateProduct,
      removeProducts,
      bulkUpdateStatus,
      adjustStock,
      setStock,
      updateBrand,
      addBrand,
      updateOrderStatus,
      cancelOrder,
      refundOrder,
      addCoupon,
      updateCoupon,
      removeCoupon,
      updateReviewStatus,
      removeReview,
    }),
    [
      catalog, brandList, orders, customers, coupons, reviews,
      getProductById, addProduct, updateProduct, removeProducts, bulkUpdateStatus,
      adjustStock, setStock, updateBrand, addBrand, updateOrderStatus,
      cancelOrder, refundOrder, addCoupon, updateCoupon, removeCoupon,
      updateReviewStatus, removeReview,
    ]
  );

  return (
    <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>
  );
}

export const useAdminData = () => {
  const ctx = useContext(AdminDataContext);
  if (!ctx) throw new Error('useAdminData must be used within AdminDataProvider');
  return ctx;
};

export default AdminDataContext;