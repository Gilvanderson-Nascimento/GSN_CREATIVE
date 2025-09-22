import type { Product, Customer, Sale } from './types';

export const products: Product[] = [
  { id: 'PROD001', name: 'Arroz Parboilizado', category: 'Grãos', quantity: 100, purchasePrice: 3.5, salePrice: 5.0, barcode: '7890123456789', imageUrl: 'https://picsum.photos/seed/PROD001/200/200' },
  { id: 'PROD002', name: 'Feijão Carioca', category: 'Grãos', quantity: 80, purchasePrice: 5.0, salePrice: 7.5, barcode: '7890123456790', imageUrl: 'https://picsum.photos/seed/PROD002/200/200' },
  { id: 'PROD003', name: 'Óleo de Soja', category: 'Óleos', quantity: 120, purchasePrice: 4.0, salePrice: 6.0, barcode: '7890123456791', imageUrl: 'https://picsum.photos/seed/PROD003/200/200' },
  { id: 'PROD004', name: 'Leite Integral', category: 'Laticínios', quantity: 50, purchasePrice: 2.5, salePrice: 4.0, barcode: '7890123456792', imageUrl: 'https://picsum.photos/seed/PROD004/200/200' },
  { id: 'PROD005', name: 'Pão de Forma', category: 'Padaria', quantity: 30, purchasePrice: 3.0, salePrice: 5.5, barcode: '7890123456793', imageUrl: 'https://picsum.photos/seed/PROD005/200/200' },
  { id: 'PROD006', name: 'Café em Pó', category: 'Mercearia', quantity: 5, purchasePrice: 8.0, salePrice: 12.0, barcode: '7890123456794', imageUrl: 'https://picsum.photos/seed/PROD006/200/200' },
  { id: 'PROD007', name: 'Refrigerante Cola', category: 'Bebidas', quantity: 200, purchasePrice: 2.0, salePrice: 3.5, barcode: '7890123456795', imageUrl: 'https://picsum.photos/seed/PROD007/200/200' },
];

export const customers: Customer[] = [
  { id: 'CUST001', name: 'João da Silva', nickname: 'João', phone: '(11) 98765-4321', address: 'Rua das Flores, 123', salesCount: 3, totalSpent: 150.75 },
  { id: 'CUST002', name: 'Maria Oliveira', nickname: 'Maria', phone: '(21) 91234-5678', address: 'Avenida Principal, 456', salesCount: 5, totalSpent: 320.50 },
  { id: 'CUST003', name: 'Pedro Souza', nickname: 'Pedrinho', phone: '(31) 99999-8888', address: 'Praça da Matriz, 789', salesCount: 2, totalSpent: 80.00 },
];

export const sales: Sale[] = [
  {
    id: 'SALE001',
    customerId: 'CUST001',
    customer: customers[0],
    items: [
      { productId: 'PROD001', productName: 'Arroz Parboilizado', quantity: 2, unitPrice: 5.0, totalPrice: 10.0 },
      { productId: 'PROD002', productName: 'Feijão Carioca', quantity: 1, unitPrice: 7.5, totalPrice: 7.5 },
    ],
    subtotal: 17.5,
    discount: 0,
    total: 17.5,
    date: '2023-10-26T10:00:00Z',
  },
  {
    id: 'SALE002',
    customerId: 'CUST002',
    customer: customers[1],
    items: [
      { productId: 'PROD004', productName: 'Leite Integral', quantity: 6, unitPrice: 4.0, totalPrice: 24.0 },
      { productId: 'PROD005', productName: 'Pão de Forma', quantity: 2, unitPrice: 5.5, totalPrice: 11.0 },
      { productId: 'PROD007', productName: 'Refrigerante Cola', quantity: 4, unitPrice: 3.5, totalPrice: 14.0 },
    ],
    subtotal: 49.0,
    discount: 5.0,
    total: 44.0,
    date: '2023-10-27T14:30:00Z',
  },
  {
    id: 'SALE003',
    items: [
      { productId: 'PROD003', productName: 'Óleo de Soja', quantity: 3, unitPrice: 6.0, totalPrice: 18.0 },
    ],
    subtotal: 18.0,
    discount: 0,
    total: 18.0,
    date: '2023-10-28T09:15:00Z',
  },
];
