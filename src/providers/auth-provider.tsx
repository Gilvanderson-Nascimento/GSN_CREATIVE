'use client';
import { useState, useEffect } from 'react';
import { AuthContext, type AuthUser } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useFirebase } from '@/firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import type { User } from '@/lib/types';

const findUserByUid = (users: User[], uid: string): AuthUser | null => {
    // This is a placeholder. In a real app, you might fetch user profile from Firestore
    // For this app, we find the user in the static list by a matching 'id' which we'll treat as uid.
    // This assumes the user 'id' in your local data corresponds to a Firebase Auth UID.
    // This part might need to be more robust, e.g. fetching a 'users' collection document by UID.
    return users.find(u => u.id === uid) || null;
}


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { auth, isUserLoading: isFirebaseUserLoading } = useFirebase();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isFirebaseUserLoading) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          // Here, you would typically fetch a user profile from Firestore using firebaseUser.uid
          // For now, we'll use a placeholder logic.
          // This is a simplified example. A real app would fetch user roles and permissions from a database.
           const appUser: AuthUser = {
                id: firebaseUser.uid,
                name: firebaseUser.displayName || 'Usuário',
                username: firebaseUser.email || 'user',
                email: firebaseUser.email || '',
                role: 'admin', // Placeholder role
                createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
                permissions: {
                    dashboard: true,
                    stock: true,
                    sales: true,
                    customers: true,
                    pricing: true,
                    users: true,
                    settings: true,
                },
           };
          setUser(appUser);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      });
      return () => unsubscribe();
    }
  }, [auth, isFirebaseUserLoading, router]);

  const login = async (email: string, pass: string): Promise<void> => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      // onAuthStateChanged will handle setting the user and redirecting
      router.push('/dashboard');
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error('Email ou senha inválidos.');
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
