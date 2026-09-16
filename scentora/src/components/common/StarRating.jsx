import React from 'react';
import { StarIcon } from './icons';

export default function StarRating({ rating = 0, size = 14, showValue = false, count = null }) {
  const full = Math.floor(rating);
  const roundedHalf = rating - full >= 0.75 ? 1 : rating - full >= 0.25 ? 0.5 : 0;

  return (
    <span className="star-rating">
      <span className="star-rating__stars" aria-label={`Rated ${rating} out of 5 stars`}>
        {[0, 1, 2, 3, 4].map((i) => {
          const filled = i < full;
          const half = !filled && roundedHalf === 0.5 && i === full;
          return (
            <StarIcon
              key={i}
              filled={filled}
              half={half}
              width={size}
              height={size}
            />
          );
        })}
      </span>
      {showValue && <span className="star-rating__value">{rating.toFixed(1)}</span>}
      {count != null && <span className="star-rating__count">({count})</span>}
    </span>
  );
}