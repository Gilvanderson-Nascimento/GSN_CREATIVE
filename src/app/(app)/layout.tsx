import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { SidebarWrapper } from './sidebar-wrapper';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={false}>
      <SidebarWrapper />
      <SidebarInset>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
