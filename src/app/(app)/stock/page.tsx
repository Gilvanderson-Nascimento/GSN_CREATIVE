'use client';
import { PageHeader } from '@/components/shared/page-header';
import { ProductTable } from '@/components/stock/product-table';
import { DataContext } from '@/context/data-context';
import { useContext } from 'react';

export default function StockPage() {
  const { products, setProducts } = useContext(DataContext);

  return (
      <ProductTable initialProducts={products} setProducts={setProducts} />
  );
}
