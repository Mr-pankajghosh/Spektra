import { createContext, useContext, useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await axiosInstance.get("/auth/me", { withCredentials: true });
      if (res.data?.user) {
        setUser(res.data.user);
        setIsAuthenticated(true);
        setIsOnboarded(!!res.data.user.isOnboarded);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error("❌ Error fetching user:", err.message);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout error:", err.message);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setIsOnboarded(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        isOnboarded,
        setIsOnboarded,
        loading,
        fetchUser, 
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
