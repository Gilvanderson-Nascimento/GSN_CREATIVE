import { createContext } from 'react';
import type { User } from '@/lib/types';
import { UserFormValues } from '@/components/users/user-form';

export type AuthUser = User;

type AuthContextType = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, pass: string) => Promise<void>;
  logout: () => void;
  createUser: (userData: UserFormValues) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: () => {},
  createUser: async () => {},
});
