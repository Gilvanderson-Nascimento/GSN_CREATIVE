'use client';
import { CustomerTable } from '@/components/customers/customer-table';
import { DataContext } from '@/context/data-context';
import { useContext } from 'react';

export default function CustomersPage() {
  const { customers, setCustomers } = useContext(DataContext);

  return (
    <CustomerTable initialCustomers={customers} setCustomers={setCustomers} />
  );
}
