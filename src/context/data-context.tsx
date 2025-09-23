
import { createContext } from 'react';
import type { Product, Customer, Sale, SaleItem } from '@/lib/types';

type SaleData = {
  items: SaleItem[];
  customerId?: string;
  subtotal: number;
  discount: number;
  total: number;
}

type DataContextType = {
  products: Product[];
  setProducts: (products: Product[]) => void;
  customers: Customer[];
  setCustomers: (customers: Customer[]) => void;
  sales: Sale[];
  setSales: (sales: Sale[]) => void;
  completeSale: (saleData: SaleData) => void;
};

export const DataContext = createContext<DataContextType>({
  products: [],
  setProducts: () => {},
  customers: [],
  setCustomers: () => {},
  sales: [],
  setSales: () => {},
  completeSale: () => {},
});
