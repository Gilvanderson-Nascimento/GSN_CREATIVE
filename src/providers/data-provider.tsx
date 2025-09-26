'use client';
import { useState, useEffect } from 'react';
import { DataContext, type AppSettings, initialSettings } from '@/context/data-context';
import type { Product, Customer, Sale, SaleItem, User, PriceSimulation } from '@/lib/types';
import { 
    products as initialProducts, 
    customers as initialCustomers, 
    sales as initialSales,
    users as initialUsersData
} from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

type SaleData = {
  items: SaleItem[];
  customerId?: string;
  subtotal: number;
  discount: number;
  total: number;
  sellerId?: string;
  sellerName?: string;
}

const getInitialState = <T,>(key: string, fallback: T): T => {
    if (typeof window === 'undefined') {
      return fallback;
    }
    try {
      const stored = sessionStorage.getItem(key);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error(`Failed to parse ${key} from sessionStorage`, e);
    }
    return fallback;
};


export function DataProvider({ children }: { children: React.ReactNode }) {
  const [products, setProductsState] = useState<Product[]>([]);
  const [customers, setCustomersState] = useState<Customer[]>([]);
  const [sales, setSalesState] = useState<Sale[]>([]);
  const [users, setUsersState] = useState<User[]>([]);
  const [settings, setSettingsState] = useState<AppSettings>(initialSettings);
  const [priceSimulations, setPriceSimulationsState] = useState<PriceSimulation[]>([]);
  
  // Cart state
  const [cart, setCartState] = useState<SaleItem[]>([]);
  const [discount, setDiscountState] = useState<number>(0);
  const [selectedCustomer, setSelectedCustomerState] = useState<string | undefined>(undefined);

  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadedSettings = getInitialState<AppSettings>('app_settings', initialSettings);
    
    setProductsState(getInitialState('app_products', initialProducts));
    setCustomersState(getInitialState('app_customers', initialCustomers));
    setSalesState(getInitialState('app_sales', initialSales));
    setUsersState(getInitialState('app_users', initialUsersData));
    setSettingsState(loadedSettings);
    setPriceSimulationsState(getInitialState('app_price_simulations', []));
    
    // Load cart from session storage
    setCartState(getInitialState('app_cart', []));
    setDiscountState(getInitialState('app_cart_discount', 0));
    setSelectedCustomerState(getInitialState('app_cart_customer', undefined));

    // Apply font on initial load
    if (typeof window !== 'undefined') {
      document.body.style.fontFamily = `var(--font-${loadedSettings.aparência?.font || 'inter'})`;
    }

    setIsLoaded(true);
  }, []);
  
  useEffect(() => {
    if (isLoaded) {
      sessionStorage.setItem('app_products', JSON.stringify(products));
    }
  }, [products, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      sessionStorage.setItem('app_customers', JSON.stringify(customers));
    }
  }, [customers, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      sessionStorage.setItem('app_sales', JSON.stringify(sales));
    }
  }, [sales, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      sessionStorage.setItem('app_users', JSON.stringify(users));
    }
  }, [users, isLoaded]);
  
  useEffect(() => {
    if (isLoaded) {
      sessionStorage.setItem('app_settings', JSON.stringify(settings));
       // Also update the font on the body
      if (typeof window !== 'undefined') {
        document.body.style.fontFamily = `var(--font-${settings.aparência?.font || 'inter'})`;
      }
    }
  }, [settings, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      sessionStorage.setItem('app_price_simulations', JSON.stringify(priceSimulations));
    }
  }, [priceSimulations, isLoaded]);
  
  // Save cart state to session storage
  useEffect(() => {
    if (isLoaded) sessionStorage.setItem('app_cart', JSON.stringify(cart));
  }, [cart, isLoaded]);
  useEffect(() => {
    if (isLoaded) sessionStorage.setItem('app_cart_discount', JSON.stringify(discount));
  }, [discount, isLoaded]);
  useEffect(() => {
    if (isLoaded) sessionStorage.setItem('app_cart_customer', JSON.stringify(selectedCustomer));
  }, [selectedCustomer, isLoaded]);

  const setProducts = (newProducts: Product[]) => setProductsState(newProducts);
  const setCustomers = (newCustomers: Customer[]) => setCustomersState(newCustomers);
  const setSales = (newSales: Sale[]) => setSalesState(newSales);
  const setUsers = (newUsers: User[]) => setUsersState(newUsers);
  const setSettings = (newSettings: AppSettings) => setSettingsState(newSettings);

  const setCart = (newCart: SaleItem[]) => setCartState(newCart);
  const setDiscount = (newDiscount: number) => setDiscountState(newDiscount);
  const setSelectedCustomer = (id: string | undefined) => setSelectedCustomerState(id);

  const addPriceSimulation = (simulation: Omit<PriceSimulation, 'id' | 'createdAt'>) => {
    const newSimulation: PriceSimulation = {
      ...simulation,
      id: `SIM${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setPriceSimulationsState(prev => [newSimulation, ...prev]);
  };
  
  const clearCart = () => {
    setCartState([]);
    setDiscountState(0);
    setSelectedCustomerState(undefined);
  }

  const completeSale = (saleData: SaleData): Sale => {
    const newSale: Sale = {
      id: `SALE${Date.now()}`,
      date: new Date().toISOString(),
      status: 'completed',
      ...saleData,
    };

    const updatedProducts = [...products];
    newSale.items.forEach(cartItem => {
      const productIndex = updatedProducts.findIndex(p => p.id === cartItem.productId);
      if (productIndex !== -1) {
        updatedProducts[productIndex].quantity -= cartItem.quantity;
      }
    });

    const updatedCustomers = [...customers];
    if (newSale.customerId) {
        const customerIndex = updatedCustomers.findIndex(c => c.id === newSale.customerId);
        if (customerIndex !== -1) {
            updatedCustomers[customerIndex].salesCount += 1;
            updatedCustomers[customerIndex].totalSpent += newSale.total;
        }
    }

    setProducts(updatedProducts);
    setCustomers(updatedCustomers);
    setSales(prevSales => [newSale, ...prevSales]);
    
    // Clear cart after sale
    clearCart();

    return newSale;
  };
  
  const cancelSale = (saleId: string) => {
    let saleToCancel: Sale | undefined;
    const updatedSales = sales.map(s => {
      if (s.id === saleId) {
        saleToCancel = s;
        return { ...s, status: 'cancelled' as const };
      }
      return s;
    });

    if (saleToCancel && saleToCancel.status !== 'cancelled') {
      // Return items to stock
      const updatedProducts = [...products];
      saleToCancel.items.forEach(item => {
        const productIndex = updatedProducts.findIndex(p => p.id === item.productId);
        if (productIndex !== -1) {
          updatedProducts[productIndex].quantity += item.quantity;
        }
      });
      setProducts(updatedProducts);

      // Revert customer stats
      if (saleToCancel.customerId) {
        const updatedCustomers = customers.map(c => {
          if (c.id === saleToCancel?.customerId) {
            return {
              ...c,
              salesCount: c.salesCount - 1,
              totalSpent: c.totalSpent - saleToCancel.total
            }
          }
          return c;
        });
        setCustomers(updatedCustomers);
      }
      setSales(updatedSales);
      toast({
        title: "Venda Cancelada",
        description: `A venda ${saleId} foi cancelada e os itens retornaram ao estoque.`
      });
    } else {
        toast({
            variant: "destructive",
            title: "Erro",
            description: "Esta venda não pôde ser cancelada ou já foi cancelada."
        });
    }
  }

  const updateSale = (saleId: string, updatedData: Partial<SaleData>) => {
    const originalSale = sales.find(s => s.id === saleId);
    if (!originalSale) return;

    let stockChanges: Record<string, number> = {};

    // Calculate stock changes
    originalSale.items.forEach(item => {
        stockChanges[item.productId] = (stockChanges[item.productId] || 0) + item.quantity;
    });

    updatedData.items?.forEach(item => {
        stockChanges[item.productId] = (stockChanges[item.productId] || 0) - item.quantity;
    });

    // Update products stock
    const updatedProducts = products.map(p => {
        if (stockChanges[p.id]) {
            return { ...p, quantity: p.quantity + stockChanges[p.id] };
        }
        return p;
    });
    
    // Update sale
    const updatedSales = sales.map(s => s.id === saleId ? { ...s, ...updatedData, date: new Date().toISOString() } : s);

    setProducts(updatedProducts);
    setSales(updatedSales);
    
     toast({
        title: "Venda Atualizada",
        description: `A venda ${saleId} foi atualizada com sucesso.`
      });
  }


  const value = { 
      products, setProducts, 
      customers, setCustomers, 
      sales, setSales, 
      users, setUsers, 
      priceSimulations, addPriceSimulation, 
      completeSale, cancelSale, 
      settings, setSettings, 
      updateSale,
      cart, setCart,
      discount, setDiscount,
      selectedCustomer, setSelectedCustomer,
      clearCart,
    };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}
