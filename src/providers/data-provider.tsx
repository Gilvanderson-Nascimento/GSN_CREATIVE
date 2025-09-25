'use client';
import { useState, useEffect } from 'react';
import { DataContext, type AppSettings } from '@/context/data-context';
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

const initialSettings: AppSettings = {
    sistema: {
      nome_empresa: "GSN Gestor",
      idioma: "pt-BR",
      moeda: "BRL",
    },
    precificacao: {
      margem_lucro: 20,
      imposto_padrao: 10,
      arredondar_valores: true,
      permitir_venda_abaixo_custo: false,
    },
    estoque: {
      notificar_estoque_minimo: true,
      estoque_minimo_padrao: 10,
      permitir_estoque_negativo: false,
    },
    vendas: {
      venda_sem_cliente: true,
      desconto_maximo_percentual: 15,
      associar_vendedor: true,
    },
    usuarios: {
      multiusuario: true,
      autenticacao_2_etapas: false,
    },
    backup_exportacao: {
      frequencia: "semanal",
      permitir_importacao: true,
    },
    integracoes: {
      api_nfe: false,
      webhooks: false,
      impressora_cupom: false,
    },
    ambiente_teste: {
      modo_teste: false,
    },
};

const getInitialState = <T,>(key: string, fallback: T): T => {
    if (typeof window === 'undefined') {
      return fallback;
    }
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error(`Failed to parse ${key} from localStorage`, e);
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
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setProductsState(getInitialState('app_products', initialProducts));
    setCustomersState(getInitialState('app_customers', initialCustomers));
    setSalesState(getInitialState('app_sales', initialSales));
    setUsersState(getInitialState('app_users', initialUsersData));
    setSettingsState(getInitialState('app_settings', initialSettings));
    setPriceSimulationsState(getInitialState('app_price_simulations', []));
    setIsLoaded(true);
  }, []);
  
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('app_products', JSON.stringify(products));
    }
  }, [products, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('app_customers', JSON.stringify(customers));
    }
  }, [customers, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('app_sales', JSON.stringify(sales));
    }
  }, [sales, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('app_users', JSON.stringify(users));
    }
  }, [users, isLoaded]);
  
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('app_settings', JSON.stringify(settings));
    }
  }, [settings, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('app_price_simulations', JSON.stringify(priceSimulations));
    }
  }, [priceSimulations, isLoaded]);

  const setProducts = (newProducts: Product[]) => setProductsState(newProducts);
  const setCustomers = (newCustomers: Customer[]) => setCustomersState(newCustomers);
  const setSales = (newSales: Sale[]) => setSalesState(newSales);
  const setUsers = (newUsers: User[]) => setUsersState(newUsers);
  const setSettings = (newSettings: AppSettings) => setSettingsState(newSettings);

  const addPriceSimulation = (simulation: Omit<PriceSimulation, 'id' | 'createdAt'>) => {
    const newSimulation: PriceSimulation = {
      ...simulation,
      id: `SIM${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setPriceSimulationsState(prev => [newSimulation, ...prev]);
  };

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


  const value = { products, setProducts, customers, setCustomers, sales, setSales, users, setUsers, priceSimulations, addPriceSimulation, completeSale, cancelSale, settings, setSettings, updateSale };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}
