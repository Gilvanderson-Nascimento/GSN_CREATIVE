export type Product = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  purchasePrice: number;
  salePrice: number;
  barcode: string;
  imageUrl?: string;
};

export type ExtractedProduct = {
  name: string;
  quantity: number;
  purchasePrice: number;
  barcode?: string;
};

export type SaleItem = {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

export type SaleStatus = 'completed' | 'cancelled';

export type Sale = {
  id: string;
  items: SaleItem[];
  customer?: Customer;
  customerId?: string;
  sellerId?: string;
  sellerName?: string;
  subtotal: number;
  discount: number;
  total: number;
  date: string;
  status?: SaleStatus;
};

export type Customer = {
  id: string;
  name: string;
  nickname: string;
  phone: string;
  address: string;
  salesCount: number;
  totalSpent: number;
};

export type PagePermission = 
  | 'dashboard' 
  | 'stock' 
  | 'sales' 
  | 'customers' 
  | 'pricing' 
  | 'users' 
  | 'settings_system'
  | 'settings_appearance'
  | 'settings_pricing'
  | 'settings_stock'
  | 'settings_sales'
  | 'settings_users'
  | 'settings_backup'
  | 'settings_integrations'
  | 'settings_test';

export const allPermissions: Record<PagePermission, string> = {
  dashboard: 'Dashboard',
  stock: 'Estoque',
  sales: 'Vendas',
  customers: 'Clientes',
  pricing: 'Precificação',
  users: 'Usuários',
  settings_system: 'Configurações (Sistema)',
  settings_appearance: 'Configurações (Aparência)',
  settings_pricing: 'Configurações (Precificação)',
  settings_stock: 'Configurações (Estoque)',
  settings_sales: 'Configurações (Vendas)',
  settings_users: 'Configurações (Usuários)',
  settings_backup: 'Configurações (Backup)',
  settings_integrations: 'Configurações (Integrações)',
  settings_test: 'Configurações (Ambiente de Teste)',
};


export type UserRole = 'admin' | 'gerente' | 'vendedor' | 'estoquista';

export type User = {
  id: string;
  name: string;
  username: string;
  password?: string; // Should be handled securely, not stored plaintext
  email?: string;
  role: UserRole | string; // Allow custom roles
  createdAt: string;
  permissions: Partial<Record<PagePermission, boolean>>;
}

export type PriceSimulation = {
  id: string;
  purchasePrice: number;
  taxRate: number;
  profitMargin: number;
  suggestedSalesPrice: number;
  createdAt: string;
};
