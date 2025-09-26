'use client';
import { useState, useEffect } from 'react';
import { AuthContext, type AuthUser } from '@/context/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import type { PagePermission } from '@/lib/types';
import { users as initialUsersData } from '@/lib/data';

const getInitialUsers = () => {
  if (typeof window === 'undefined') return initialUsersData;
  try {
    // For auth, always use localStorage to know about existing users across sessions
    const storedUsers = localStorage.getItem('app_users');
    if(storedUsers) return JSON.parse(storedUsers);
  } catch (error) {
    console.error("Error reading users from local storage", error);
  }
  // This is a simplified approach. A real app would have a more robust user provisioning.
  localStorage.setItem('app_users', JSON.stringify(initialUsersData));
  return initialUsersData;
}

const orderedPages: PagePermission[] = ['dashboard', 'stock', 'sales', 'customers', 'pricing', 'users', 'settings'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check for user session on initial load
    try {
      const storedUser = sessionStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      }
    } catch (e) {
        console.error("Failed to parse user from session storage", e);
        sessionStorage.removeItem('user');
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, pass: string): Promise<void> => {
    const users = getInitialUsers();
    const foundUser = users.find(u => u.username === username && u.password === pass);

    if (foundUser) {
      sessionStorage.setItem('user', JSON.stringify(foundUser));
      setUser(foundUser);
      
      const firstAllowedPage = orderedPages.find(page => foundUser.permissions?.[page]) || 'dashboard';

      // Use location.replace to force a full reload and re-initialization of DataProvider
      // This ensures that all session data is correctly loaded from sessionStorage after login.
      window.location.replace(`/${firstAllowedPage}`);
    } else {
      throw new Error('Usuário ou senha inválidos.');
    }
  };

  const logout = () => {
    sessionStorage.clear();
    setUser(null);
    router.push('/login');
  };

  const isAuthenticated = !!user;
  
  const value = { user, isAuthenticated, isLoading, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
