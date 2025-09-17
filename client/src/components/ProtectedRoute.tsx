import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type Props = {
  children: JSX.Element;
  adminOnly?: boolean;
};

const ProtectedRoute = ({ children, adminOnly = false }: Props) => {
  const { user, loading } = useAuth();

  if (loading) return <p className="text-center">Loading...</p>;

  // Agar login hi nahi hai
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Agar admin-only route hai aur user admin nahi hai
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
