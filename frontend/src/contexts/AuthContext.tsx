import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import type { CurrentUser } from '../types/auth';
import { UserRole } from '../types/auth';

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  exp: number;
}

interface AuthContextValue {
  currentUser: CurrentUser | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (rawToken: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('token');
    if (!stored) return;

    try {
      const payload = jwtDecode<JwtPayload>(stored);
      if (payload.exp * 1000 < Date.now()) {
        localStorage.removeItem('token');
        return;
      }
      setToken(stored);
      setCurrentUser({
        id: payload.sub,
        email: payload.email,
        role: payload.role as UserRole,
      });
    } catch {
      localStorage.removeItem('token');
    }
  }, []);

  const login = useCallback((rawToken: string) => {
    try {
      const payload = jwtDecode<JwtPayload>(rawToken);
      localStorage.setItem('token', rawToken);
      setToken(rawToken);
      setCurrentUser({ id: payload.sub, email: payload.email, role: payload.role as UserRole });
    } catch {
      // ignore malformed token
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setCurrentUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated: !!currentUser, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
