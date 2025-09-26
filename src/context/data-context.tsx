
import { createContext } from 'react';
import type { Product, Customer, Sale, SaleItem, User, PriceSimulation } from '@/lib/types';

type SaleData = {
  items: SaleItem[];
  customerId?: string;
  subtotal: number;
  discount: number;
  total: number;
  sellerId?: string;
  sellerName?: string;
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
  priceSimulations: PriceSimulation[];
  addPriceSimulation: (simulation: Omit<PriceSimulation, 'id' | 'createdAt'>) => void;
  completeSale: (saleData: SaleData) => Sale;
  cancelSale: (saleId: string) => void;
  settings: AppSettings;
  setSettings: (settings: AppSettings) => void;
  updateSale: (saleId: string, updatedData: Partial<SaleData>) => void;
  
  // POS Cart State
  cart: SaleItem[];
  setCart: (cart: SaleItem[]) => void;
  discount: number;
  setDiscount: (discount: number) => void;
  selectedCustomer: string | undefined;
  setSelectedCustomer: (id: string | undefined) => void;
  clearCart: () => void;
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
  priceSimulations: [],
  addPriceSimulation: () => {},
  completeSale: () => ({} as Sale),
  cancelSale: () => {},
  updateSale: () => {},
  settings: {
    estoque: {
      notificar_estoque_minimo: true,
      estoque_minimo_padrao: 10,
      permitir_estoque_negativo: false,
    },
  },
  setSettings: () => {},
  cart: [],
  setCart: () => {},
  discount: 0,
  setDiscount: () => {},
  selectedCustomer: undefined,
  setSelectedCustomer: () => {},
  clearCart: () => {},
});
