'use client';
import { useState, useEffect } from 'react';
import { AuthContext, type AuthUser } from '@/context/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { users as initialUsers } from '@/lib/data'; // Import users directly
import { Skeleton } from '@/components/ui/skeleton';

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
         if (pathname === '/login') {
            router.replace('/dashboard');
        }
      }
    } catch (e) {
        console.error("Failed to parse user from session storage", e);
        sessionStorage.removeItem('user');
    }
    setIsLoading(false);
  }, [pathname, router]);

  const login = async (username: string, pass: string): Promise<void> => {
    // Check against the directly imported list of users
    const foundUser = initialUsers.find(u => u.username === username && u.password === pass);

    if (foundUser) {
      sessionStorage.setItem('user', JSON.stringify(foundUser));
      setUser(foundUser);
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

  // This check prevents flickering on the login page if the user is already authenticated.
  // It shows a loader while verifying the session, then redirects if necessary.
  if (isLoading && pathname === '/login') {
      return (
        <div className="flex h-screen w-screen items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                 <Skeleton className="h-16 w-[250px]" />
                 <Skeleton className="h-8 w-[200px]" />
            </div>
        </div>
      );
  }

  const value = { user, isAuthenticated, isLoading, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
