import React from 'react';

export function SkeletonCard() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <div className="skeleton skeleton--image" />
      <div className="skeleton skeleton--line w-40" />
      <div className="skeleton skeleton--line w-70" />
      <div className="skeleton skeleton--line w-30" />
    </div>
  );
}

export function SkeletonGrid({ count = 8 }) {
  return (
    <div className="product-grid" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonText({ lines = 3, width = 80 }) {
  return (
    <div className="skeleton-text" aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton skeleton--line"
          style={{ width: `${width - i * 10}%` }}
        />
      ))}
    </div>
  );
}

export function SkeletonPage() {
  return (
    <div className="page-skeleton">
      <SkeletonText />
      <SkeletonGrid />
    </div>
  );
}