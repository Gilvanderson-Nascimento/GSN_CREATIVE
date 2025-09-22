'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Boxes, LayoutDashboard, Settings, ShoppingCart, Tags, Users } from 'lucide-react';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';

export function SidebarNavigation() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <Link href="/dashboard" passHref>
            <SidebarMenuButton asChild isActive={isActive('/dashboard')}>
              <span>
                <LayoutDashboard />
                Dashboard
              </span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <Link href="/stock" passHref>
            <SidebarMenuButton asChild isActive={isActive('/stock')}>
              <span>
                <Boxes />
                Estoque
              </span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <Link href="/sales" passHref>
            <SidebarMenuButton asChild isActive={isActive('/sales')}>
              <span>
                <ShoppingCart />
                Vendas
              </span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <Link href="/customers" passHref>
            <SidebarMenuButton asChild isActive={isActive('/customers')}>
              <span>
                <Users />
                Clientes
              </span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <Link href="/pricing" passHref>
            <SidebarMenuButton asChild isActive={isActive('/pricing')}>
              <span>
                <Tags />
                Precificação
              </span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      </SidebarMenu>
      <div className="flex-grow" />
      <SidebarMenu>
        <SidebarMenuItem>
          <Link href="/settings" passHref>
            <SidebarMenuButton asChild isActive={isActive('/settings')}>
              <span>
                <Settings />
                Configurações
              </span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  );
}
