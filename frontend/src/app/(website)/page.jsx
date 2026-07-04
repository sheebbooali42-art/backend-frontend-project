import CategorySection from '@/components/website/CategorySection';

import Hero from '@/components/website/Hero';
import Slider from '@/components/website/Slider';
import { fetchCategory, fetchProduct } from '@/utils/api';
import React from 'react'


export const metadata = {
  title: "Nestro — Curated Furniture",
  description: "Nestro — Curated Furniture Description",
};

export default async function page() {

  const products = await fetchProduct({ status: true });
  const categories = await fetchCategory({ status: true });
  return (
    <>
      <Hero />
      <CategorySection categories={categories.data} />
      <Slider products={products.data} />
    </>
  )
}
