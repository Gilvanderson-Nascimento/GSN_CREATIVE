'use client';
import { useState, useEffect, useContext } from 'react';
import { AuthContext, type AuthUser } from '@/context/auth-context';
import { DataContext } from '@/context/data-context';
import { useRouter } from 'next/navigation';
import { useFirebase } from '@/firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword } from 'firebase/auth';
import { users as staticUsers } from '@/lib/data'; // Import static users
import { UserFormValues } from '@/components/users/user-form';
import { allPermissions } from '@/lib/types';
import { firebaseConfig } from '@/firebase/config';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { auth, isUserLoading: isFirebaseUserLoading } = useFirebase();
  const { users, setUsers } = useContext(DataContext);
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
    const userList = users.length > 0 ? users : staticUsers;
    const userToLogin = userList.find(u => u.username === username);

    let emailToAuth: string | undefined;

    if (userToLogin) {
        emailToAuth = userToLogin.email;
    } else if(username.includes('@')) {
        // Fallback for email login if username not found
        emailToAuth = username;
    }
    
    // Hardcoded check for GSN_CREATIVE if not found yet (e.g. on first load)
    if (username === 'GSN_CREATIVE' && !userToLogin) {
        const gsnUser = staticUsers.find(u => u.username === 'GSN_CREATIVE');
        emailToAuth = gsnUser?.email;
    }


    if (!emailToAuth) {
        throw new Error('Usuário não encontrado ou configuração de e-mail incompleta.');
    }
    
    await attemptLogin(emailToAuth, pass);
  };
  
  const attemptLogin = async (email: string, pass: string) => {
      try {
        await signInWithEmailAndPassword(auth, email, pass);
        router.push('/dashboard');
      } catch (error: any) {
        console.error("Login failed:", error);
        throw new Error('Usuário ou senha inválidos.');
      }
  }

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    router.push('/login');
  };
  
  const createUser = async (userData: UserFormValues) => {
    if (!userData.email || !userData.password) {
        throw new Error('E-mail e senha são obrigatórios para criar um usuário.');
    }

    // 1. Create user in Firebase Auth
    try {
        await createUserWithEmailAndPassword(auth, userData.email, userData.password);
    } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
            throw new Error('Este e-mail já está em uso por outra conta.');
        }
        console.error('Error creating user in Firebase Auth:', error);
        throw new Error('Ocorreu um erro ao criar a credencial de acesso.');
    }

    // 2. Create user profile in local state (DataContext)
    const newUser: AuthUser = {
      id: `USER${Date.now()}`,
      createdAt: new Date().toISOString(),
      permissions: userData.role === 'admin' ? 
        Object.keys(allPermissions).reduce((acc, key) => ({...acc, [key]: true}), {}) : 
        { dashboard: true }, // Default permissions for non-admins
      ...userData,
    };
    setUsers([...users, newUser]);
  };
  
  const isAuthenticated = !!user;
  
  const value = { user, isAuthenticated, isLoading, login, logout, createUser };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
