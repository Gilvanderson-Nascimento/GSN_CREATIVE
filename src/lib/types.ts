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
