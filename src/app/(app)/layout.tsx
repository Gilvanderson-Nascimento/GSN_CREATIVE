import { DataProvider } from '@/providers/data-provider';
import { AuthProvider } from '@/providers/auth-provider';
import { SidebarWrapper } from './sidebar-wrapper';
import { PrivateRoute } from '@/components/shared/private-route';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <DataProvider>
      <AuthProvider>
        <PrivateRoute>
          <SidebarWrapper>{children}</SidebarWrapper>
        </PrivateRoute>
      </AuthProvider>
    </DataProvider>
  );
}
