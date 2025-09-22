'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Boxes, LayoutDashboard, Settings, ShoppingCart, Tags, Users } from 'lucide-react';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/dashboard" passHref>
                <SidebarMenuButton asChild isActive={isActive('/dashboard')}>
                  <>
                    <LayoutDashboard />
                    Dashboard
                  </>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/stock" passHref>
                <SidebarMenuButton asChild isActive={isActive('/stock')}>
                  <>
                    <Boxes />
                    Estoque
                  </>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
               <Link href="/sales" passHref>
                <SidebarMenuButton asChild isActive={isActive('/sales')}>
                  <>
                    <ShoppingCart />
                    Vendas
                  </>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/customers" passHref>
                <SidebarMenuButton asChild isActive={isActive('/customers')}>
                  <>
                    <Users />
                    Clientes
                  </>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/pricing" passHref>
                <SidebarMenuButton asChild isActive={isActive('/pricing')}>
                  <>
                    <Tags />
                    Precificação
                  </>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Settings />
                Configurações
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
