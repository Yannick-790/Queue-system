import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type { ReactNode } from "react";

import { AuthService } from "../services/auth.service";

// ============================================================
// USER TYPES
// ============================================================

export type UserRole =
  | "ADMIN"
  | "MANAGER"
  | "SECURITY"
  | "EMPLOYEE";

export interface EmployeeUser {
  id: string;

  departmentId: string;

  serviceId: string | null;

  deskId?: string | null;

  desk?: {
    id: string;
    name: string;
    status?: string;
  };
}

export interface User {
  id: string;

  name: string;

  email: string;

  companyId: string;

  role: UserRole;

  employee?: EmployeeUser;
}

// ============================================================
// AUTH DATA
// ============================================================

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  companyId: string;
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

// ============================================================
// AUTH CONTEXT
// ============================================================

interface AuthContextType {
  user: User | null;

  loading: boolean;

  isAuthenticated: boolean;

  login(
    data: LoginData
  ): Promise<void>;

  register(
    data: RegisterData
  ): Promise<void>;

  logout(): void;

  refreshUser(): Promise<void>;
}

// ============================================================
// CONTEXT
// ============================================================

const AuthContext =
  createContext<AuthContextType>(
    {} as AuthContextType
  );

// ============================================================
// PROVIDER
// ============================================================

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);

  // ==========================================================
  // GET CURRENT USER
  // ==========================================================

  async function refreshUser(): Promise<void> {
    try {
      const me =
        await AuthService.me();

      /*
       * AuthService.me() should return
       * the authenticated user.
       */
      setUser(me);
    } catch (error) {
      console.error(
        "AUTH REFRESH FAILED:",
        error
      );

      setUser(null);
    }
  }

  // ==========================================================
  // LOGIN
  // ==========================================================

  async function login(
    data: LoginData
  ): Promise<void> {
    await AuthService.login(data);

    /*
     * After login, immediately retrieve
     * the complete authenticated user.
     *
     * This is important because the employee,
     * desk and service information comes from
     * the /me endpoint.
     */
    await refreshUser();
  }

  // ==========================================================
  // REGISTER
  // ==========================================================

  async function register(
    data: RegisterData
  ): Promise<void> {
    await AuthService.register(data);
  }

  // ==========================================================
  // LOGOUT
  // ==========================================================

  function logout(): void {
    AuthService.logout();

    setUser(null);
  }

  // ==========================================================
  // INITIAL AUTH CHECK
  // ==========================================================

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      try {
        const me =
          await AuthService.me();

        if (mounted) {
          setUser(me);
        }
      } catch (error) {
        console.error(
          "INITIAL AUTH CHECK FAILED:",
          error
        );

        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, []);

  // ==========================================================
  // PROVIDER
  // ==========================================================

  return (
    <AuthContext.Provider
      value={{
        user,

        loading,

        isAuthenticated:
          !!user,

        login,

        register,

        logout,

        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ============================================================
// USE AUTH
// ============================================================

export function useAuth() {
  return useContext(
    AuthContext
  );
}