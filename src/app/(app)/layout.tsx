import { SidebarWrapper } from './sidebar-wrapper';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
      <SidebarWrapper>
          {children}
      </SidebarWrapper>
  );
}
