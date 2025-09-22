import { customers } from '@/lib/data';
import { CustomerTable } from '@/components/customers/customer-table';

export default function CustomersPage() {
  const initialCustomers = customers;

  return (
    <CustomerTable initialCustomers={initialCustomers} />
  );
}
