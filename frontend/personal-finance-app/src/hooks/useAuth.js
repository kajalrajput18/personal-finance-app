import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { apiRequest, API_PATHS } from "../utils/api";

const useAuth = () => {
  const { user, setUser } = useContext(AuthContext);

  // Login
  const login = async (email, password) => {
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (data.token) {
      localStorage.setItem("token", data.token);
      setUser(data.user);
    }

    return data;
  };

  // Signup
  const signup = async (name, email, password) => {
    return apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return {
    user,
    login,
    signup,
    logout,
    isAuthenticated: !!localStorage.getItem("token"),
  };
};

export default useAuth;
