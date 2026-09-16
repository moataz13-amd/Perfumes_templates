import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cx, discountPercent, isOnSale, formatPrice } from '../../utils/helpers';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import StarRating from './StarRating';
import { HeartIcon, PlusIcon } from './icons';

export default function ProductCard({ product, className }) {
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addItem, openCart } = useCart();
  const { success } = useToast();
  const [imageIndex, setImageIndex] = useState(0);
  const [quickAddLoading, setQuickAddLoading] = useState(false);

  const onSale = isOnSale(product);
  const discount = discountPercent(product);
  const inWishlist = isInWishlist(product.id);
  const outOfStock = product.stock <= 0;
  const hasSecondImage = product.images?.length > 1;

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleWishlist(product);
    success(
      added
        ? `${product.name} added to wishlist`
        : `${product.name} removed from wishlist`
    );
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;
    setQuickAddLoading(true);
    setTimeout(() => {
      addItem(product, { size: product.size?.[0], quantity: 1 });
      setQuickAddLoading(false);
      success(`${product.name} added to cart`);
      openCart();
    }, 350);
  };

  return (
    <article className={cx('product-card', className)}>
      <div 
        className="product-card__media-wrap"
        onMouseEnter={() => hasSecondImage && setImageIndex(1)}
        onMouseLeave={() => setImageIndex(0)}
      >
        <Link
          to={`/product/${product.slug}`}
          className="product-card__media"
          aria-label={`View ${product.name}`}
        >
          <img
            className="product-card__image"
            src={product.images?.[imageIndex] || product.images?.[0]}
            alt={product.name}
            loading="lazy"
          />

          <div className="product-card__badges">
            {outOfStock ? (
              <span className="badge badge--soldout">Out of stock</span>
            ) : (
              <>
                {product.isNew && !onSale && <span className="badge badge--new">New</span>}
                {product.isBestSeller && !onSale && !product.isNew && (
                  <span className="badge badge--bestseller">Best seller</span>
                )}
                {onSale && <span className="badge badge--sale">-{discount}%</span>}
              </>
            )}
          </div>
        </Link>

        <button
          className={cx('product-card__wishlist-btn', inWishlist && 'is-active')}
          onClick={handleWishlist}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <HeartIcon filled={inWishlist} width={16} height={16} />
        </button>

        {!outOfStock && (
          <button
            className="product-card__quick-add"
            onClick={handleQuickAdd}
            disabled={quickAddLoading}
            aria-label={`Quick add ${product.name} to cart`}
          >
            {quickAddLoading ? (
              <span>Adding…</span>
            ) : (
              <>
                <PlusIcon width={14} height={14} />
                <span>Quick Add</span>
              </>
            )}
          </button>
        )}
      </div>

      <div className="product-card__info">
        <p className="product-card__brand">{product.brand}</p>
        <h3 className="product-card__name">
          <Link to={`/product/${product.slug}`}>{product.name}</Link>
        </h3>
        
        <div className="product-card__meta">
          <span>{product.size?.[0] ? `${product.size[0]} ml` : product.category}</span>
          <span className="product-card__dot" aria-hidden="true">·</span>
          <span>{product.concentration}</span>
        </div>

        <div className="product-card__footer">
          <div className="product-card__price">
            {onSale && (
              <span className="price price--compare">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
            <span className="price">{formatPrice(product.price)}</span>
          </div>

          <div className="product-card__rating">
            <StarRating rating={product.rating} size={12} />
            <span className="product-card__reviews">({product.reviewCount})</span>
          </div>
        </div>
      </div>
    </article>
  );
}