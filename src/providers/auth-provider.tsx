'use client';
import { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext, type AuthUser } from '@/context/auth-context';
import { DataContext } from '@/context/data-context';
import { useRouter } from 'next/navigation';
import { UserFormValues } from '@/components/users/user-form';
import { allPermissions } from '@/lib/types';

const SESSION_KEY = 'session_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { users, setUsers } = useContext(DataContext);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for a logged-in user in session storage on initial load
    try {
      const storedUser = sessionStorage.getItem(SESSION_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error('Could not parse user from session storage', e);
      sessionStorage.removeItem(SESSION_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const login = useCallback(async (username: string, pass: string): Promise<void> => {
    if (!users || users.length === 0) {
      throw new Error("A lista de usuários não está disponível.");
    }
    
    const userToLogin = users.find(u => u.username === username);

    if (userToLogin && userToLogin.password === pass) {
      setUser(userToLogin);
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(userToLogin));
      router.push('/dashboard');
    } else {
      throw new Error('Usuário ou senha inválidos.');
    }
  }, [users, router]);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem(SESSION_KEY);
    router.push('/login');
  }, [router]);
  
  const createUser = useCallback(async (userData: UserFormValues): Promise<AuthUser | undefined> => {
    if (!userData.username || !userData.password) {
        throw new Error('Nome de usuário e senha são obrigatórios.');
    }
    
    const existingUser = users.find(u => u.username === userData.username);
    if(existingUser) {
        throw new Error('Este nome de usuário já está em uso.');
    }

    const newUser: AuthUser = {
      id: `USER${Date.now()}`,
      createdAt: new Date().toISOString(),
      permissions: userData.role === 'admin' ? 
        Object.keys(allPermissions).reduce((acc, key) => ({...acc, [key]: true}), {}) : 
        { dashboard: true },
      ...userData,
    };
    
    setUsers([...users, newUser]);
    return newUser;
  }, [users, setUsers]);
  
  const isAuthenticated = !!user;
  
  const value = { user, isAuthenticated, isLoading, login, logout, createUser };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
