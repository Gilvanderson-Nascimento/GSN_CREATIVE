import { PageHeader } from '@/components/shared/page-header';
import { PricingTool } from '@/components/pricing/pricing-tool';

export default function PricingPage() {
  return (
    <div>
      <PageHeader title="Precificação Inteligente" />
      <PricingTool />
    </div>
  );
}
