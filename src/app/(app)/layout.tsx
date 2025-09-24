import { SidebarWrapper } from './sidebar-wrapper';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-50 text-gray-800 font-sans dark:bg-background">
        <SidebarWrapper>{children}</SidebarWrapper>
    </div>
  );
}

    