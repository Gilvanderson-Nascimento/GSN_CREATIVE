'use client';

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import { SidebarNavigation } from './sidebar-navigation';

export function SidebarWrapper() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Logo />
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        <SidebarNavigation />
      </SidebarContent>
      <SidebarFooter>{/* Footer content can be added here */}</SidebarFooter>
    </Sidebar>
  );
}
