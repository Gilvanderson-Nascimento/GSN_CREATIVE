import { DataProvider } from '@/providers/data-provider';
import { SidebarWrapper } from './sidebar-wrapper';
import { PrivateRoute } from '@/components/shared/private-route';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <DataProvider>
      <PrivateRoute>
        <SidebarWrapper>{children}</SidebarWrapper>
      </PrivateRoute>
    </DataProvider>
  );
}
