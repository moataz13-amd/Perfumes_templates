import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { products, getProductBySlug, getRelatedProducts, formatPrice } from '../data/products';
import { getBrandSlug } from '../data/brands';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import { demoReviews } from '../data/reviews';
import StarRating from '../components/common/StarRating';
import QuantitySelector from '../components/common/QuantitySelector';
import Accordion from '../components/common/Accordion';
import Breadcrumbs from '../components/common/Breadcrumbs';
import ProductCard from '../components/common/ProductCard';
import EmptyState from '../components/common/EmptyState';
import {
  HeartIcon,
  BagIcon,
  CheckIcon,
  TruckIcon,
  RotateIcon,
  ShieldIcon,
  ArrowRight,
  SparkleIcon,
} from '../components/common/icons';
import { cx, discountPercent, isOnSale } from '../utils/helpers';

export default function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const product = getProductBySlug(slug);
  const { addItem, openCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { success } = useToast();
  const { addRecentlyViewed } = useRecentlyViewed();

  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState(product?.size?.[0] || '50');
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [activeTab, setActiveTab] = useState('reviews');

  useEffect(() => {
    if (product) {
      setActiveImage(0);
      setSize(product.size[0]);
      setQuantity(1);
      addRecentlyViewed(product);
    }
  }, [product, addRecentlyViewed]);

  if (!product) {
    return (
      <div className="container container--page">
        <EmptyState
          title="Product not found"
          message="The fragrance you're looking for may have been moved."
          actionLabel="Shop all fragrances"
          actionTo="/shop"
        />
      </div>
    );
  }

  const onSale = isOnSale(product);
  const discount = discountPercent(product);
  const inWishlist = isInWishlist(product.id);
  const outOfStock = product.stock <= 0;
  const lowStock = !outOfStock && product.stock <= 10;
  const related = getRelatedProducts(product, 4);
  const reviews = demoReviews.filter((r) => r.productId === product.id);
  const allReviews =
    reviews.length > 0
      ? reviews
      : [products.find((p) => p.id === product.id)].filter(Boolean).length
        ? [
            {
              id: 'gen',
              author: 'Verified Buyer',
              rating: product.rating,
              date: '2026-08-20',
              title: 'Genuine and stunning',
              body: product.shortDescription + ' Arrived beautifully packaged and smells exactly as promised.',
              verified: true,
            },
          ]
        : [];

  

  const handleAddToCart = (buyNow = false) => {
    if (outOfStock) return;
    setAdding(true);
    setTimeout(() => {
      addItem(product, { size, quantity });
      setAdding(false);
      success(`${product.name} added to cart`);
      if (buyNow) {
        openCart();
        navigate('/checkout');
      } else {
        openCart();
      }
    }, 400);
  };

  const handleWishlist = () => {
    const added = toggleWishlist(product);
    success(added ? 'Added to wishlist' : 'Removed from wishlist');
  };

  const accordionItems = [
    {
      title: 'Description',
      content: product.description,
    },
    {
      title: 'Scent Notes',
      content: (
        <div className="notes-text">
          <p>
            <strong>Top:</strong> {product.topNotes}
          </p>
          <p>
            <strong>Heart:</strong> {product.heartNotes}
          </p>
          <p>
            <strong>Base:</strong> {product.baseNotes}
          </p>
        </div>
      ),
    },
    {
      title: 'Ingredients',
      content:
        'Alcohol Denat., Parfum (Fragrance), Aqua (Water), Limonene, Linalool, Coumarin, Citral, Geraniol, Citronellol. Full ingredient list printed on carton. SCENTORA provides genuine products sourced from the brand.',
    },
    {
      title: 'Shipping & Delivery',
      content:
        'Free standard shipping on orders over $100 (3\u20135 business days). Express delivery available at checkout. Every parcel is securely packed with signature wrapping and fully insured.',
    },
    {
      title: 'Returns',
      content:
        'Unused and sealed products can be returned within 30 days of delivery for a full refund. Contact support@thedcal to start a return.',
    },
  ];

  return (
    <div className="pdp">
      <div className="container">
        <Breadcrumbs
          items={[
            { label: 'Shop', to: '/shop' },
            { label: product.brand, to: `/brand/${getBrandSlug(product.brand)}` },
            { label: product.name },
          ]}
        />
      </div>

      <div className="container">
        <div className="pdp__layout">
          <div className="pdp__gallery">
            <div className="pdp__gallery-main">
              {product.images.length > 1 && (
                <div className="pdp__gallery-thumbs">
                  {product.images.map((img, i) => (
                    <button
                      key={img}
                      className={cx('pdp__thumb', i === activeImage && 'is-active')}
                      onClick={() => setActiveImage(i)}
                      aria-label={`View image ${i + 1}`}
                    >
                      <img src={img} alt={`${product.name} image ${i + 1}`} />
                    </button>
                  ))}
                </div>
              )}
              <img
                className="pdp__gallery-image"
                src={product.images[activeImage]}
                alt={product.name}
              />
            </div>
          </div>

          <div className="pdp__info">
            <div className="pdp__badges">
              {onSale && <span className="badge badge--sale">-{discount}%</span>}
              {product.isNew && <span className="badge badge--new">New</span>}
              {product.isBestSeller && (
                <span className="badge badge--bestseller">Best seller</span>
              )}
            </div>

            <p className="pdp__brand">
              <Link to={`/brand/${getBrandSlug(product.brand)}`}>
                {product.brand}
              </Link>
            </p>
            <h1 className="pdp__name">{product.name}</h1>

            <div className="pdp__rating-row">
              <StarRating rating={product.rating} size={15} showValue />
              <span className="pdp__reviews">
                {product.reviewCount} reviews
              </span>
              <button
                className="pdp__write-review"
                onClick={() => setActiveTab('reviews')}
              >
                Write a review
              </button>
            </div>

            <div className="pdp__price">
              <span className="price price--large">{formatPrice(product.price)}</span>
              {onSale && (
                <span className="price price--compare">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>
            {onSale && (
              <p className="pdp__save">
                Save {formatPrice(product.compareAtPrice - product.price)} · Limited
                time offer
              </p>
            )}

            <p className="pdp__desc-short">{product.shortDescription}</p>

            <div className="pdp__stock">
              {outOfStock ? (
                <span className="stock-pill stock-pill--out">Out of stock</span>
              ) : lowStock ? (
                <span className="stock-pill stock-pill--low">
                  Only {product.stock} left in stock
                </span>
              ) : (
                <span className="stock-pill stock-pill--in">
                  <CheckIcon width={13} height={13} /> In stock, ready to ship
                </span>
              )}
            </div>

            <div className="pdp__variant">
              <label className="pdp__variant-label" htmlFor="size">
                Size
              </label>
              <div className="pdp__sizes">
                {product.size.map((s) => (
                  <button
                    key={s}
                    className={cx('size-btn', size === s && 'is-active')}
                    onClick={() => setSize(s)}
                    aria-pressed={size === s}
                  >
                    {s} ml
                  </button>
                ))}
              </div>
            </div>

            <div className="pdp__qty-row">
              <QuantitySelector
                value={quantity}
                onChange={setQuantity}
                max={product.stock > 0 ? Math.min(99, product.stock) : 1}
                label="Qty"
              />
              <span className="pdp__size-note">{size} ml per bottle</span>
            </div>

            <div className="pdp__cta-row">
              <button
                className="btn btn--primary btn--lg pdp__add"
                onClick={() => handleAddToCart(false)}
                disabled={outOfStock || adding}
              >
                <BagIcon width={18} height={18} />
                {adding ? 'Adding…' : outOfStock ? 'Out of stock' : 'Add to Cart'}
              </button>
              <button
                className="btn btn--dark btn--lg"
                onClick={() => handleAddToCart(true)}
                disabled={outOfStock || adding}
              >
                Buy Now
              </button>
              <button
                className={cx('icon-btn pdp__wishlist', inWishlist && 'is-active')}
                onClick={handleWishlist}
                aria-label="Toggle wishlist"
                title="Wishlist"
              >
                <HeartIcon filled={inWishlist} />
              </button>
            </div>

            <div className="pdp__perks">
              <p>
                <TruckIcon width={16} height={16} /> Free shipping over $100
              </p>
              <p>
                <RotateIcon width={16} height={16} /> 30-day returns
              </p>
              <p>
                <ShieldIcon width={16} height={16} /> 100% authentic
              </p>
            </div>

            <Accordion items={accordionItems} />
          </div>
        </div>
      </div>

      <section className="container pdp__notes-section">
        <div className="section__heading">
          <div>
            <span className="section__eyebrow">The composition</span>
            <h2 className="section__title">Fragrance Notes</h2>
          </div>
          <span className="pdp__family">
            <SparkleIcon /> {product.scentFamily}
          </span>
        </div>

        <div className="notes-grid">
          <div className="note-card">
            <span className="note-card__phase">Top Notes</span>
            <ul>
              {String(product.topNotes).split(',').map((n) => (
                <li key={n}>{n.trim()}</li>
              ))}
            </ul>
          </div>
          <div className="note-card">
            <span className="note-card__phase">Heart Notes</span>
            <ul>
              {String(product.heartNotes).split(',').map((n) => (
                <li key={n}>{n.trim()}</li>
              ))}
            </ul>
          </div>
          <div className="note-card">
            <span className="note-card__phase">Base Notes</span>
            <ul>
              {String(product.baseNotes).split(',').map((n) => (
                <li key={n}>{n.trim()}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="perf-grid">
          {[
            ['Concentration', product.concentration],
            ['Longevity', product.longevity],
            ['Sillage', product.sillage],
            ['Season', Array.isArray(product.season) ? product.season.join(', ') : product.season],
            ['Occasion', product.occasion],
            ['Year Launched', 'Iconic collection'],
          ].map(([label, value]) => (
            <div className="perf-chip" key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="container pdp__reviews-section">
        <div className="pdp__reviews">
          <div className="pdp__reviews-summary">
            <span className="section__eyebrow">Reviews</span>
            <h2>What people think</h2>
            <div className="pdp__reviews-score">
              <span className="price price--large">{product.rating}</span>
              <StarRating rating={product.rating} size={16} />
              <span>{product.reviewCount} verified reviews</span>
            </div>
            <Link to="/shop" className="btn btn--ghost btn--sm">
              Ask a question
            </Link>
          </div>
          <div className="pdp__reviews-list">
            {allReviews.length === 0 ? (
              <p>No reviews yet. Be the first to review this fragrance.</p>
            ) : (
              allReviews.map((r) => (
                <article className="review" key={r.id}>
                  <div className="review__head">
                    <span className="review__avatar" aria-hidden="true">
                      {r.author[0]}
                    </span>
                    <div>
                      <strong>{r.author}</strong>
                      {r.verified && (
                        <span className="review__verified">
                          <CheckIcon width={12} height={12} /> Verified buyer
                        </span>
                      )}
                    </div>
                    <StarRating rating={r.rating} size={13} />
                  </div>
                  <h4 className="review__title">{r.title}</h4>
                  <p className="review__body">{r.body}</p>
                  <p className="review__helpful">Was this helpful?</p>
                </article>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section__heading">
            <div>
              <span className="section__eyebrow">You may also like</span>
              <h2 className="section__title">Complete the edit</h2>
            </div>
            <Link to="/shop" className="link-arrow">
              Shop all <ArrowRight width={14} height={14} />
            </Link>
          </div>
          <div className="product-grid">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}