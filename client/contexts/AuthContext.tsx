import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { apiClient } from "@shared/api";

export type Role = "user" | "admin";
export type AuthUser = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: Role;
};

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  backendConnected: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [backendConnected, setBackendConnected] = useState(false);

  useEffect(() => {
    // Check backend connection
    const checkBackend = async () => {
      try {
        await apiClient.health();
        setBackendConnected(true);
        console.log("✅ Backend connected");
      } catch (error) {
        setBackendConnected(false);
        console.warn("⚠️ Backend not available:", error);
      }
    };

    // Load saved user
    const raw = localStorage.getItem("auth:user");
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch (e) {
        localStorage.removeItem("auth:user");
      }
    }

    checkBackend();
    setLoading(false);

    // Handle OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const userParam = urlParams.get('user');
    
    if (token && userParam) {
      try {
        const userData = JSON.parse(decodeURIComponent(userParam));
        const authUser: AuthUser = {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          avatarUrl: userData.avatar_url,
          role: userData.role === 'admin' ? 'admin' : 'user',
        };
        
        setUser(authUser);
        localStorage.setItem("auth:user", JSON.stringify(authUser));
        apiClient.setToken(token);
        
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (e) {
        console.error("Failed to parse OAuth callback:", e);
      }
    }
  }, []);

  const signInWithGoogle = async () => {
    // Always use backend OAuth if backend is connected
    if (backendConnected) {
      console.log("🚀 Redirecting to Google OAuth via backend...");
      // Redirect to backend Google OAuth
      window.location.href = `${apiClient.baseURL}/api/v1/auth/google`;
      return;
    }

    // Use mock authentication only if backend is not connected
    console.log("Using demo authentication - backend not connected");
    const demoUser: AuthUser = {
      id: crypto.randomUUID(),
      name: "Demo User",
      email: "user@demo.com",
      avatarUrl: `https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff`,
      role: "user",
    };
    setUser(demoUser);
    localStorage.setItem("auth:user", JSON.stringify(demoUser));
    
    // Show success message
    if (typeof window !== 'undefined') {
      alert(`✅ Signed in as ${demoUser.name}\n\nNote: This is demo authentication. Backend is not connected.`);
    }
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem("auth:user");
    apiClient.clearToken();
  };

  const value = useMemo(
    () => ({ user, loading, signInWithGoogle, signOut, backendConnected }),
    [user, loading, backendConnected],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
