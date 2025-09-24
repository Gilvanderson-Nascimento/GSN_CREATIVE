import { SidebarWrapper } from './sidebar-wrapper';
import { PrivateRoute } from '@/components/shared/private-route';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <PrivateRoute>
        <div className="bg-gray-50 text-gray-800 font-sans">
            <SidebarWrapper>{children}</SidebarWrapper>
        </div>
    </PrivateRoute>
  );
}

    