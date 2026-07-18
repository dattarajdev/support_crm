import { createContext, useContext, useState, useEffect } from "react";
import { login as apiLogin, getMe } from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          const userData = await getMe();
          setUser(userData);
          setToken(storedToken);
        } catch (error) {
          // Token is invalid/expired; clear local cache
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const loginAction = async (email, password) => {
    setIsLoading(true);
    try {
      const authData = await apiLogin(email, password);
      localStorage.setItem("token", authData.access_token);
      setToken(authData.access_token);
      
      // Fetch user profile from /auth/me after successful login
      const userData = await getMe();
      setUser(userData);
      return userData;
    } catch (error) {
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logoutAction = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user,
        login: loginAction,
        logout: logoutAction,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
