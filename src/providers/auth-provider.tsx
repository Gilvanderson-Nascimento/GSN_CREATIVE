'use client';
import { useState, useEffect, useContext } from 'react';
import { AuthContext, type AuthUser } from '@/context/auth-context';
import { DataContext } from '@/context/data-context';
import { useRouter } from 'next/navigation';
import { useFirebase } from '@/firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { users as staticUsers } from '@/lib/data'; // Import static users

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { auth, isUserLoading: isFirebaseUserLoading } = useFirebase();
  const { users } = useContext(DataContext);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isFirebaseUserLoading) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          // Use the most current user list (from context if loaded, otherwise static)
          const userList = users.length > 0 ? users : staticUsers;
          const appUser = userList.find(u => u.email === firebaseUser.email) || null;
          setUser(appUser);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      });
      return () => unsubscribe();
    }
  }, [auth, isFirebaseUserLoading, router, users]);

  const login = async (username: string, pass: string): Promise<void> => {
    // Find the user from the static list first to ensure dev user is always available
    const userToLogin = staticUsers.find(u => u.username === username);

    if (!userToLogin || !userToLogin.email) {
      throw new Error('Usuário não encontrado ou sem e-mail configurado.');
    }
    
    try {
      await signInWithEmailAndPassword(auth, userToLogin.email, pass);
      router.push('/dashboard');
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error('Usuário ou senha inválidos.');
    }
  };

  const logout = async () => {
    await signOut(auth);
    router.push('/login');
  };
  
  if (isLoading) {
    return (
        <div className="flex h-screen w-screen items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                 <p>Carregando...</p>
            </div>
        </div>
    );
  }

  const isAuthenticated = !!user;
  
  const value = { user, isAuthenticated, isLoading, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
