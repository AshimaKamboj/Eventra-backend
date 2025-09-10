// src/components/OrganizerRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function OrganizerRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "organizer") {
    return <Navigate to="/" replace />; // redirect normal users
  }

  return children;
}

export default OrganizerRoute;
