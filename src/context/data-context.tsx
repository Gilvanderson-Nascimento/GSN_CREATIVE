
import { createContext } from 'react';
import type { Product, Customer, Sale, SaleItem, User } from '@/lib/types';

type SaleData = {
  items: SaleItem[];
  customerId?: string;
  subtotal: number;
  discount: number;
  total: number;
}

// Defining a simplified settings type for the context
export type AppSettings = {
  estoque: {
    notificar_estoque_minimo: boolean;
    estoque_minimo_padrao: number;
    permitir_estoque_negativo: boolean;
  };
  // Add other settings sections as needed
  [key: string]: any; 
};


type DataContextType = {
  products: Product[];
  setProducts: (products: Product[]) => void;
  customers: Customer[];
  setCustomers: (customers: Customer[]) => void;
  sales: Sale[];
  setSales: (sales: Sale[]) => void;
  users: User[];
  setUsers: (users: User[]) => void;
  completeSale: (saleData: SaleData) => void;
  settings: AppSettings;
  setSettings: (settings: AppSettings) => void;
};

export const DataContext = createContext<DataContextType>({
  products: [],
  setProducts: () => {},
  customers: [],
  setCustomers: () => {},
  sales: [],
  setSales: () => {},
  users: [],
  setUsers: () => {},
  completeSale: () => {},
  settings: {
    estoque: {
      notificar_estoque_minimo: true,
      estoque_minimo_padrao: 10,
      permitir_estoque_negativo: false,
    },
  },
  setSettings: () => {},
});
