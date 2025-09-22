import { customers } from '@/lib/data';
import { PageHeader } from '@/components/shared/page-header';
import { CustomerTable } from '@/components/customers/customer-table';

export default function CustomersPage() {
  const initialCustomers = customers;

  return (
    <div>
      <PageHeader title="Clientes" />
      <CustomerTable initialCustomers={initialCustomers} />
    </div>
  );
}
