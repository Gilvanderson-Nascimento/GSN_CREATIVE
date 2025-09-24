import { SidebarWrapper } from './sidebar-wrapper';
import { PrivateRoute } from '@/components/shared/private-route';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <PrivateRoute>
        <div className="bg-gray-50 text-gray-800 font-sans dark:bg-background">
            <SidebarWrapper>{children}</SidebarWrapper>
        </div>
    </PrivateRoute>
  );
}

    