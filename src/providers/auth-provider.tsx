'use client';
import { useState, useEffect } from 'react';
import { AuthContext, type AuthUser } from '@/context/auth-context';
import { useRouter, usePathname } from 'next/navigation';

// Hardcoded master user
const MASTER_USER = {
  username: 'GSN_CREATIVE',
  password: 'Gsn@6437#',
  role: 'admin' as const,
};

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
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
        console.error("Failed to parse user from session storage", e);
        sessionStorage.removeItem('user');
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, pass: string): Promise<void> => {
    // Simple hardcoded check
    if (username === MASTER_USER.username && pass === MASTER_USER.password) {
      const userData: AuthUser = { username: MASTER_USER.username, role: MASTER_USER.role };
      sessionStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      router.push('/dashboard');
    } else {
      throw new Error('Usuário ou senha inválidos.');
    }
  };

  const logout = () => {
    sessionStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  const isAuthenticated = !!user;

  // If user is authenticated and tries to access /login, redirect to dashboard
  useEffect(() => {
    if (!isLoading && isAuthenticated && pathname === '/login') {
      router.push('/dashboard');
    }
  }, [isLoading, isAuthenticated, pathname, router]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
