"use client";
// context/AuthContext.tsx

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { AuthSession, getSession, logoutUser } from "@/lib/auth";
import { useRouter } from "next/navigation";

interface AuthContextType {
  session: AuthSession | null;
  loading: boolean;
  logout: () => void;
  setSession: (session: AuthSession | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
  logout: () => {},
  setSession: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const s = getSession();
    setSession(s);
    setLoading(false);
  }, []);

  function logout() {
    logoutUser();
    setSession(null);
    router.push("/login");
  }

  return (
    <AuthContext.Provider value={{ session, loading, logout, setSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
