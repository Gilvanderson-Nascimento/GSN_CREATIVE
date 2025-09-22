import { products } from '@/lib/data';
import { PageHeader } from '@/components/shared/page-header';
import { ProductTable } from '@/components/stock/product-table';

export default function StockPage() {
  // In a real app, you'd fetch this data from your database.
  const initialProducts = products;

  return (
      <ProductTable initialProducts={initialProducts} />
  );
}
