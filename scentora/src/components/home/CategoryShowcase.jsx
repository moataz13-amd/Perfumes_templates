import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from '../common/icons';

const CATEGORIES = [
  {
    name: 'Men',
    description: 'Bold, fresh & woody signatures',
    query: '?gender=Men',
    image:
      'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1000&auto=format&fit=crop',
  },
  {
    name: 'Women',
    description: 'Florals, orientals & musks',
    query: '?gender=Women',
    image:
      'https://images.unsplash.com/photo-1610461888750-10bfc601b874?q=80&w=1000&auto=format&fit=crop',
  },
  {
    name: 'Unisex',
    description: 'Modern, genderless icons',
    query: '?gender=Unisex',
    image:
      'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=1000&auto=format&fit=crop',
  },
  {
    name: 'Niche',
    description: 'Boutique & rare finds',
    query: '?category=Niche',
    image:
      'https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=1000',
  },
  {
    name: 'Gift Sets',
    description: 'Coffrets & discovery',
    query: '?category=Gift Sets',
    image:
      'https://images.pexels.com/photos/1137379/pexels-photo-1137379.jpeg?auto=compress&cs=tinysrgb&w=1000',
  },
];

export default function CategoryShowcase() {
  return (
    <section className="section section--categories">
      <div className="container">
        <div className="section__heading">
          <div>
            <span className="section__eyebrow">Curated</span>
            <h2 className="section__title">Shop by Category</h2>
          </div>
          <Link to="/shop" className="link-arrow">
            View all <ArrowRight width={14} height={14} />
          </Link>
        </div>

        <div className="category-grid">
          {CATEGORIES.map((cat, i) => (
            <Link
              to={`/shop${cat.query}`}
              key={cat.name}
              className={`category-card category-card--${i + 1}`}
            >
              <img src={cat.image} alt={`${cat.name} fragrances`} loading="lazy" />
              <span className="category-card__shade" aria-hidden="true" />
              <div className="category-card__content">
                <h3>{cat.name}</h3>
                <p>{cat.description}</p>
                <span className="category-card__link">
                  Shop {cat.name} <ArrowRight width={14} height={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}