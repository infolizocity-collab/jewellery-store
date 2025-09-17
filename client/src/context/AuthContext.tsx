import  { createContext, useState, useEffect, useContext } from "react";
import type { ReactNode } from "react";

// 🔹 User type
interface User {
  _id: string;
  name: string;
  email: string;  
  role: "user" | "admin";
  profilePic?: string; // ✅ Cloudinary photo URL
}

// 🔹 Context type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateProfile: (updatedUser: Partial<User>) => void; // ✅ new feature
}

// 🔹 Context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 🔹 Provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login
  const login = (user: User, token: string) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    setUser(user);
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  // ✅ Update profile (name / photo etc)
  const updateProfile = (updatedUser: Partial<User>) => {
    if (!user) return;
    const newUser = { ...user, ...updatedUser };
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

// 🔹 Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
