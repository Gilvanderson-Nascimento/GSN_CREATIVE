import { PrivateRoute } from '@/components/shared/private-route';
import { SidebarWrapper } from './sidebar-wrapper';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <PrivateRoute>
        <div className="bg-gray-50 text-gray-800 font-sans dark:bg-background">
            <SidebarWrapper>{children}</SidebarWrapper>
        </div>
    </PrivateRoute>
  );
}
