import { SidebarInset } from '@/components/ui/sidebar';
import { SidebarWrapper } from './sidebar-wrapper';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SidebarWrapper />
      <SidebarInset>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </>
  );
}
