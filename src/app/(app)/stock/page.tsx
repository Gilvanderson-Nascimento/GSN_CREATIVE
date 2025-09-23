'use client';
import { useContext } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { ProductTable } from '@/components/stock/product-table';
import { DataContext } from '@/context/data-context';

export default function StockPage() {
  const { products, setProducts } = useContext(DataContext);

  return (
      <ProductTable initialProducts={products} setProducts={setProducts} />
  );
}
