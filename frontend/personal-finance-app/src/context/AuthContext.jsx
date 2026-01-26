import { createContext, useEffect, useState } from "react";
import { apiRequest } from "../utils/api";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user on app refresh
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await apiRequest("/auth/me");
        if (data && data.user) {
          setUser(data.user);
        }
      } catch (err) {
        // Silently handle auth errors - token might be expired
        // Don't remove token here as apiRequest already handles it
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
