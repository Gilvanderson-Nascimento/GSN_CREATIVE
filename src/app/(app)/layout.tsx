import { DataProvider } from '@/providers/data-provider';
import { AuthProvider } from '@/providers/auth-provider';
import { SidebarWrapper } from './sidebar-wrapper';
import { PrivateRoute } from '@/components/shared/private-route';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <PrivateRoute>
        <DataProvider>
          <SidebarWrapper>{children}</SidebarWrapper>
        </DataProvider>
      </PrivateRoute>
    </AuthProvider>
  );
}
