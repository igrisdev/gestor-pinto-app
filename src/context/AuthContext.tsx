import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { login } from '../services/auth';
import { clearUser, loadUser, saveUser } from '../store/auth';
import type { User } from '../types';

interface AuthContextData {
  user: User | null;
  loading: boolean;
  error?: string;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    loadUser()
      .then((storedUser) => {
        if (storedUser) {
          setUser(storedUser);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const signIn = async (email: string, password: string) => {
    setError(undefined);

    const response = await login(email.trim(), password.trim());

    if (!response.success) {
      setError(response.error);
      return false;
    }

    setUser(response.user);
    await saveUser(response.user);
    return true;
  };

  const signOut = async () => {
    setUser(null);
    await clearUser();
  };

  const value = useMemo(
    () => ({ user, loading, error, signIn, signOut }),
    [user, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
