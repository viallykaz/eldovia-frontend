'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { firebaseAuth } from '@/lib/firebase';
import { getToken, setToken, clearToken, type AuthUser } from '@/lib/auth';
import { exchangeFirebaseToken } from '@/lib/api';

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  logout: () => Promise<void>;
  refresh: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: true,
  logout: async () => {},
  refresh: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

function decodeUser(token: string, firebaseUid = '', displayName: string | null = null): AuthUser | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp && payload.exp * 1000 < Date.now()) return null;
    return {
      id: payload.sub,
      email: payload.email ?? '',
      firstName: payload.firstName || displayName?.split(' ')[0] || '',
      lastName: payload.lastName || displayName?.split(' ').slice(1).join(' ') || '',
      roles: payload.roles ?? [],
      firebaseUid: firebaseUid || payload.firebaseUid || '',
    };
  } catch {
    return null;
  }
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(() => {
    const token = getToken();
    if (token) {
      const decoded = decodeUser(token);
      setUserState(decoded);
    } else {
      setUserState(null);
    }
  }, []);

  const logout = useCallback(async () => {
    await firebaseSignOut(firebaseAuth).catch(() => {});
    clearToken();
    setUserState(null);
    window.location.href = '/';
  }, []);

  useEffect(() => {
    // Check for an existing platform JWT (email/password login path)
    const existingToken = getToken();
    if (existingToken) {
      const decoded = decodeUser(existingToken);
      if (decoded) {
        setUserState(decoded);
        setIsLoading(false);
        // Still listen to Firebase in background, but don't block
      }
    }

    const unsubscribe = onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
      if (firebaseUser) {
        // Firebase user present — always exchange for a fresh platform token
        try {
          const idToken = await firebaseUser.getIdToken();
          const res = await exchangeFirebaseToken(idToken);
          setToken(res.accessToken);
          const platformUser = decodeUser(res.accessToken, firebaseUser.uid, firebaseUser.displayName);
          setUserState(platformUser);
        } catch {
          // Backend unavailable — show Firebase identity with no platform roles
          setUserState({
            id: firebaseUser.uid,
            email: firebaseUser.email ?? '',
            firstName: firebaseUser.displayName?.split(' ')[0] ?? '',
            lastName: firebaseUser.displayName?.split(' ').slice(1).join(' ') ?? '',
            roles: [],
            firebaseUid: firebaseUser.uid,
          });
        }
        setIsLoading(false);
      } else {
        // No Firebase user — check if there's a valid platform JWT (email/password login)
        const token = getToken();
        if (token) {
          const decoded = decodeUser(token);
          if (decoded) {
            setUserState(decoded);
            setIsLoading(false);
            return;
          }
        }
        // No valid session at all
        clearToken();
        setUserState(null);
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}
