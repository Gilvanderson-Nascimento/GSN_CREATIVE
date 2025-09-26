import type { Product, Customer, Sale, User } from './types';

export const products: Product[] = [];

export const customers: Customer[] = [];

export const users: User[] = [
    {
        id: 'USER001',
        name: 'Admin GSN',
        username: 'GSN_CREATIVE',
        email: 'dev@gsn.com',
        password: 'Gsn@6437#',
        role: 'admin',
        createdAt: new Date().toISOString(),
        permissions: {
            dashboard: true,
            stock: true,
            sales: true,
            customers: true,
            pricing: true,
            users: true,
            settings: true,
        },
    }
]

export const sales: Sale[] = [];
