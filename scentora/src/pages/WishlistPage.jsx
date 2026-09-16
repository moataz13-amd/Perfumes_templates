import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { formatPrice, discountPercent } from '../utils/helpers';
import StarRating from '../components/common/StarRating';
import EmptyState from '../components/common/EmptyState';
import Breadcrumbs from '../components/common/Breadcrumbs';
import { TrashIcon, PlusIcon, BagIcon, HeartIcon } from '../components/common/icons';
import { products } from '../data/products';

export default function Wishlist() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addItem, openCart } = useCart();
  const { success } = useToast();

  const moveToCart = (item) => {
    const product = products.find((p) => p.id === item.id) || item;
    addItem(product, { size: product.size?.[0] || '50' });
    removeFromWishlist(item.id);
    success('Moved to cart');
    openCart();
  };

  if (wishlist.length === 0) {
    return (
      <div className="container container--page">
        <Breadcrumbs items={[{ label: 'Wishlist' }]} />
        <EmptyState
          icon={<HeartIcon width={36} height={36} />}
          title="Your wishlist is empty"
          message="Save fragrances you love and buy them later."
          actionLabel="Browse fragrances"
          actionTo="/shop"
        />
      </div>
    );
  }

  return (
    <div className="container container--page">
      <Breadcrumbs items={[{ label: 'Wishlist' }]} />
      <div className="section__heading">
        <div>
          <span className="section__eyebrow">{wishlist.length} items</span>
          <h1 className="page-title">Your Wishlist</h1>
        </div>
        <button className="btn btn--ghost btn--sm" onClick={clearWishlist}>
          Clear all
        </button>
      </div>

      <div className="wishlist-grid">
        {wishlist.map((item) => {
          const full = products.find((p) => p.id === item.id);
          return (
            <div className="wishlist-card" key={item.id}>
              <Link to={`/product/${item.slug}`} className="wishlist-card__image">
                <img src={item.image} alt={item.name} />
                {item.compareAtPrice && (
                  <span className="badge badge--sale">-{discountPercent(item)}%</span>
                )}
              </Link>
              <div className="wishlist-card__body">
                <p className="wishlist-card__brand">{item.brand}</p>
                <Link to={`/product/${item.slug}`} className="wishlist-card__name">
                  {item.name}
                </Link>
                <StarRating rating={item.rating} size={12} count={item.reviewCount} />
                <div className="wishlist-card__price">
                  <span>{formatPrice(item.price)}</span>
                  {item.compareAtPrice && (
                    <span className="price price--compare">
                      {formatPrice(item.compareAtPrice)}
                    </span>
                  )}
                </div>
              </div>
              <div className="wishlist-card__actions">
                <button
                  className="btn btn--primary btn--sm"
                  onClick={() => moveToCart(item)}
                >
                  <BagIcon width={14} height={14} /> Move to Cart
                </button>
                <button
                  className="icon-btn icon-btn--sm"
                  onClick={() => {
                    removeFromWishlist(item.id);
                    success('Removed from wishlist');
                  }}
                  aria-label="Remove from wishlist"
                >
                  <TrashIcon width={15} height={15} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}