'use client';
import { useState, useEffect } from 'react';
import { DataContext, type AppSettings } from '@/context/data-context';
import type { Product, Customer, Sale, SaleItem, User } from '@/lib/types';
import { 
    products as initialProducts, 
    customers as initialCustomers, 
    sales as initialSales,
    users as initialUsersData
} from '@/lib/data';

type SaleData = {
  items: SaleItem[];
  customerId?: string;
  subtotal: number;
  discount: number;
  total: number;
}

const initialSettings: AppSettings = {
    sistema: {
      nome_empresa: "Minha Empresa",
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

const getInitialUsers = (): User[] => {
    if (typeof window === 'undefined') {
      return initialUsersData;
    }
    try {
      const storedUsers = localStorage.getItem('app_users');
      if (storedUsers) {
        return JSON.parse(storedUsers);
      }
    } catch (e) {
      console.error("Failed to parse users from localStorage", e);
    }
    return initialUsersData;
};


export function DataProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [sales, setSales] = useState<Sale[]>(initialSales);
  const [users, setUsersState] = useState<User[]>(getInitialUsers);
  const [settings, setSettings] = useState<AppSettings>(initialSettings);
  
  const setUsers = (newUsers: User[] | ((prevUsers: User[]) => User[])) => {
    setUsersState(prevUsers => {
      const updatedUsers = typeof newUsers === 'function' ? newUsers(prevUsers) : newUsers;
      try {
        localStorage.setItem('app_users', JSON.stringify(updatedUsers));
      } catch (e) {
        console.error("Failed to save users to localStorage", e);
      }
      return updatedUsers;
    });
  };

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
    <DataContext.Provider value={{ products, setProducts, customers, setCustomers, sales, setSales, users, setUsers, completeSale, settings, setSettings }}>
      {children}
    </DataContext.Provider>
  );
}
