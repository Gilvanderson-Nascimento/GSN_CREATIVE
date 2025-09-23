'use client';
import { useState } from 'react';
import { DataContext } from '@/context/data-context';
import type { Product, Customer, Sale, SaleItem } from '@/lib/types';
import { products as initialProducts, customers as initialCustomers, sales as initialSales } from '@/lib/data';

type SaleData = {
  items: SaleItem[];
  customerId?: string;
  subtotal: number;
  discount: number;
  total: number;
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [sales, setSales] = useState<Sale[]>(initialSales);

  const completeSale = (saleData: SaleData) => {
    // 1. Create the new sale object
    const newSale: Sale = {
      id: `SALE${Date.now()}`,
      date: new Date().toISOString(),
      ...saleData,
    };

    // 2. Update product quantities
    const updatedProducts = [...products];
    let inventoryWasUpdated = false;
    newSale.items.forEach(cartItem => {
      const productIndex = updatedProducts.findIndex(p => p.id === cartItem.productId);
      if (productIndex !== -1) {
        updatedProducts[productIndex].quantity -= cartItem.quantity;
        inventoryWasUpdated = true;
      }
    });

    // 3. Update customer sales data
    const updatedCustomers = [...customers];
    if (newSale.customerId) {
        const customerIndex = updatedCustomers.findIndex(c => c.id === newSale.customerId);
        if (customerIndex !== -1) {
            updatedCustomers[customerIndex].salesCount += 1;
            updatedCustomers[customerIndex].totalSpent += newSale.total;
        }
    }

    // 4. Update state
    if (inventoryWasUpdated) {
        setProducts(updatedProducts);
    }
    setCustomers(updatedCustomers);
    setSales(prevSales => [newSale, ...prevSales]);
  };

  return (
    <DataContext.Provider value={{ products, setProducts, customers, setCustomers, sales, setSales, completeSale }}>
      {children}
    </DataContext.Provider>
  );
}
