import { DataProvider } from '@/providers/data-provider';
import { SidebarWrapper } from './sidebar-wrapper';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <DataProvider>
      <SidebarWrapper>{children}</SidebarWrapper>
    </DataProvider>
  );
}
