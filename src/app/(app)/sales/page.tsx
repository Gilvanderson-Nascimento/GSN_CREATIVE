import { PageHeader } from '@/components/shared/page-header';
import { PosSystem } from '@/components/sales/pos-system';

export default function SalesPage() {
  return (
    <div>
      <PageHeader title="Ponto de Venda (PDV)" />
      <PosSystem />
    </div>
  );
}
