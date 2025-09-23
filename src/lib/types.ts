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

export type SaleItem = {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

export type Sale = {
  id: string;
  items: SaleItem[];
  customer?: Customer;
  customerId?: string;
  subtotal: number;
  discount: number;
  total: number;
  date: string;
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

export type PagePermission = 'dashboard' | 'stock' | 'sales' | 'customers' | 'pricing' | 'users' | 'settings';

export const allPermissions: Record<PagePermission, string> = {
  dashboard: 'Dashboard',
  stock: 'Estoque',
  sales: 'Vendas',
  customers: 'Clientes',
  pricing: 'Precificação',
  users: 'Usuários',
  settings: 'Configurações',
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
