import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { products } from '../../data/products';
import { formatPrice } from '../../utils/helpers';
import StarRating from '../../components/common/StarRating';
import EmptyState from '../../components/common/EmptyState';
import { BagIcon, TrashIcon } from '../../components/common/icons';

export default function AccountWishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addItem, openCart } = useCart();
  const { success } = useToast();

  if (wishlist.length === 0) {
    return (
      <div>
        <h1 className="page-title">Your Wishlist</h1>
        <EmptyState
          title="Nothing saved yet"
          message="Tap the heart on any product to save it here."
          actionLabel="Discover fragrances"
          actionTo="/shop"
        />
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">Your Wishlist ({wishlist.length})</h1>
      <div className="wishlist-grid">
        {wishlist.map((item) => (
          <div className="wishlist-card" key={item.id}>
            <Link to={`/product/${item.slug}`} className="wishlist-card__image">
              <img src={item.image} alt={item.name} />
            </Link>
            <div className="wishlist-card__body">
              <p className="wishlist-card__brand">{item.brand}</p>
              <Link to={`/product/${item.slug}`} className="wishlist-card__name">
                {item.name}
              </Link>
              <StarRating rating={item.rating} size={12} count={item.reviewCount} />
              <div className="wishlist-card__price">
                <span>{formatPrice(item.price)}</span>
              </div>
            </div>
            <div className="wishlist-card__actions">
              <button
                className="btn btn--primary btn--sm"
                onClick={() => {
                  const product = products.find((p) => p.id === item.id) || item;
                  addItem(product, { size: product.size?.[0] });
                  openCart();
                }}
              >
                <BagIcon width={14} height={14} /> Add to cart
              </button>
              <button
                className="icon-btn icon-btn--sm"
                onClick={() => removeFromWishlist(item.id)}
                aria-label="Remove"
              >
                <TrashIcon width={15} height={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}