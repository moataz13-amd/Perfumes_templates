import React from 'react';
import Hero from '../components/home/Hero';
import ValueProps from '../components/home/ValueProps';
import CategoryShowcase from '../components/home/CategoryShowcase';
import BrandShowcase from '../components/home/BrandShowcase';
import ProductRail from '../components/home/ProductRail';
import FragranceFamilies from '../components/home/FragranceFamilies';
import EditorialCampaign from '../components/home/EditorialCampaign';
import Testimonials from '../components/home/Testimonials';
import { products } from '../data/products';

export default function Home() {
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 8);
  const newArrivals = products.filter((p) => p.isNew).slice(0, 8);

  return (
    <div className="home-page">
      <Hero />
      <ValueProps />
      <CategoryShowcase />
      
      <ProductRail
        title="Best Sellers"
        eyebrow="Most Coveted"
        products={bestSellers}
        viewAllTo="/shop?sort=Best+Selling"
      />

      <FragranceFamilies />
      
      <EditorialCampaign />

      <ProductRail
        title="New Arrivals"
        eyebrow="Freshly Crafted"
        products={newArrivals}
        viewAllTo="/shop?sort=Newest"
      />

      <BrandShowcase />
      <Testimonials />
    </div>
  );
}