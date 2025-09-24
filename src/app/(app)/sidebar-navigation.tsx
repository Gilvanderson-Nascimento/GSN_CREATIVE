'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Boxes, LayoutDashboard, LogOut, Settings, ShoppingCart, Tags, Users, UserCog } from 'lucide-react';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/use-auth';
import { useTranslation } from '@/providers/translation-provider';

export function SidebarNavigation() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { t } = useTranslation();
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
              <SidebarMenuButton asChild isActive={isActive('/dashboard')} tooltip={t('sidebar.dashboard')}>
                <span>
                  <LayoutDashboard />
                  {t('sidebar.dashboard')}
                </span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        )}
        {canAccess('stock') && (
          <SidebarMenuItem>
            <Link href="/stock" passHref>
              <SidebarMenuButton asChild isActive={isActive('/stock')} tooltip={t('sidebar.stock')}>
                <span>
                  <Boxes />
                  {t('sidebar.stock')}
                </span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        )}
        {canAccess('sales') && (
          <SidebarMenuItem>
            <Link href="/sales" passHref>
              <SidebarMenuButton asChild isActive={isActive('/sales')} tooltip={t('sidebar.sales')}>
                <span>
                  <ShoppingCart />
                  {t('sidebar.sales')}
                </span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        )}
        {canAccess('customers') && (
          <SidebarMenuItem>
            <Link href="/customers" passHref>
              <SidebarMenuButton asChild isActive={isActive('/customers')} tooltip={t('sidebar.customers')}>
                <span>
                  <Users />
                  {t('sidebar.customers')}
                </span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        )}
        {canAccess('pricing') && (
          <SidebarMenuItem>
            <Link href="/pricing" passHref>
              <SidebarMenuButton asChild isActive={isActive('/pricing')} tooltip={t('sidebar.pricing')}>
                <span>
                  <Tags />
                  {t('sidebar.pricing')}
                </span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        )}
        {canAccess('users') && (
          <SidebarMenuItem>
            <Link href="/users" passHref>
              <SidebarMenuButton asChild isActive={isActive('/users')} tooltip={t('sidebar.users')}>
                <span>
                  <UserCog />
                  {t('sidebar.users')}
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
              <SidebarMenuButton asChild isActive={isActive('/settings')} tooltip={t('sidebar.settings')}>
                <span>
                  <Settings />
                  {t('sidebar.settings')}
                </span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        )}
        <SidebarMenuItem>
           <SidebarMenuButton onClick={logout} tooltip={t('sidebar.logout')}>
              <span>
                <LogOut />
                {t('sidebar.logout')}
              </span>
            </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  );
}

    