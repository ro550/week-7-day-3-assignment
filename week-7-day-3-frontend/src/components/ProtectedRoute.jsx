
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function isTokenValid(token) {
  try {
    // Get the payload from the JWT.
    const payload = JSON.parse(atob(token.split(".")[1]));

    // A token without an expiry value is not accepted.
    if (!payload.exp) {
      return false;
    }

    // Check whether the token is still valid.
    return payload.exp * 1000 > Date.now();
  } catch {
    // A malformed token is invalid.
    return false;
  }
}

function ProtectedRoute({ children }) {
  const { user, token, logout } = useAuth();

  // The user, token and token expiry must all be valid.
  const isValid = Boolean(user && token && isTokenValid(token));

  // Clear authentication information when invalid.
  useEffect(() => {
    if (!isValid) {
      logout();
    }
  }, [isValid, logout]);

  // Redirect unauthenticated users to the home page.
  if (!isValid) {
    return <Navigate to="/" replace />;
  }

  // Display the protected page.
  return children;
}

export default ProtectedRoute;
