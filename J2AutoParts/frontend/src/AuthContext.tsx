import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api, getToken, setToken, setOn401, type AuthPayload, type UserProfile } from "./api";

type AuthContextValue = {
  user: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    const t = getToken();
    if (!t) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get<UserProfile>("/auth/me");
      setUser(data);
    } catch {
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshProfile();
    setOn401(() => {
      setToken(null);
      setUser(null);
    });
  }, [refreshProfile]);

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await api.post<AuthPayload>("/auth/login", { email, password });
    setToken(data.token);
    await refreshProfile();
  }, [refreshProfile]);

  const register = useCallback(async (email: string, password: string, fullName: string) => {
    const { data } = await api.post<AuthPayload>("/auth/register", {
      email,
      password,
      fullName,
    });
    setToken(data.token);
    await refreshProfile();
  }, [refreshProfile]);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  const isAdmin = useMemo(() => !!user?.roles?.includes("ROLE_ADMIN"), [user]);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAdmin,
      login,
      register,
      logout,
      refreshProfile,
    }),
    [user, loading, isAdmin, login, register, logout, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth phải dùng trong AuthProvider");
  return ctx;
}
