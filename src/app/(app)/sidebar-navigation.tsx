'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Boxes, LayoutDashboard, LogOut, Settings, ShoppingCart, Tags, Users, UserCog } from 'lucide-react';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/use-auth';

export function SidebarNavigation() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const isActive = (path: string) => pathname === path;
  
  const canAccess = (page: 'dashboard' | 'stock' | 'sales' | 'customers' | 'pricing' | 'users' | 'settings') => {
      if(user?.role === 'admin') return true;
      return user?.permissions?.[page] ?? false;
  }

  return (
    <>
      <SidebarMenu>
        {canAccess('dashboard') && (
          <SidebarMenuItem>
            <Link href="/dashboard" passHref>
              <SidebarMenuButton asChild isActive={isActive('/dashboard')} tooltip="Dashboard">
                <span>
                  <LayoutDashboard />
                  Dashboard
                </span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        )}
        {canAccess('stock') && (
          <SidebarMenuItem>
            <Link href="/stock" passHref>
              <SidebarMenuButton asChild isActive={isActive('/stock')} tooltip="Estoque">
                <span>
                  <Boxes />
                  Estoque
                </span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        )}
        {canAccess('sales') && (
          <SidebarMenuItem>
            <Link href="/sales" passHref>
              <SidebarMenuButton asChild isActive={isActive('/sales')} tooltip="Vendas">
                <span>
                  <ShoppingCart />
                  Vendas
                </span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        )}
        {canAccess('customers') && (
          <SidebarMenuItem>
            <Link href="/customers" passHref>
              <SidebarMenuButton asChild isActive={isActive('/customers')} tooltip="Clientes">
                <span>
                  <Users />
                  Clientes
                </span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        )}
        {canAccess('pricing') && (
          <SidebarMenuItem>
            <Link href="/pricing" passHref>
              <SidebarMenuButton asChild isActive={isActive('/pricing')} tooltip="Precificação">
                <span>
                  <Tags />
                  Precificação
                </span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        )}
        {canAccess('users') && (
          <SidebarMenuItem>
            <Link href="/users" passHref>
              <SidebarMenuButton asChild isActive={isActive('/users')} tooltip="Usuários">
                <span>
                  <UserCog />
                  Usuários
                </span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        )}
      </SidebarMenu>
      <div className="flex-grow" />
      <SidebarMenu>
        {canAccess('settings') && (
          <SidebarMenuItem>
            <Link href="/settings" passHref>
              <SidebarMenuButton asChild isActive={isActive('/settings')} tooltip="Configurações">
                <span>
                  <Settings />
                  Configurações
                </span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        )}
        <SidebarMenuItem>
           <SidebarMenuButton onClick={logout} tooltip="Sair">
              <span>
                <LogOut />
                Sair
              </span>
            </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  );
}
