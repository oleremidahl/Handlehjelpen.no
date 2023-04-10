import React, { useContext, ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }: { children: ReactElement }) => {
  const user = useContext(AuthContext);

  if (user) {
    return <Navigate to="/" />;
  }
  return children;
};

export default ProtectedRoute;
