
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function GoogleCallback() {
  const { login } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [error, setError] = useState("");

  // Prevent duplicate callback processing in development StrictMode.
  const hasStarted = useRef(false);

  useEffect(() => {
    if (hasStarted.current) {
      return;
    }

    hasStarted.current = true;

    async function completeGoogleLogin() {
      // Read the token and possible error from the callback URL.
      const params = new URLSearchParams(location.search);

      const token = params.get("token");
      const googleError = params.get("error");

      // Remove the token from the visible browser URL.
      window.history.replaceState(
        {},
        document.title,
        window.location.pathname
      );

      // Check whether Google authentication failed.
      if (googleError) {
        setError("Google authentication failed. Please try again.");
        return;
      }

      // Check whether the backend returned a token.
      if (!token) {
        setError("No authentication token was received.");
        return;
      }

      try {
        // Ask our backend for fresh user information.
        const response = await axios.get(
          "http://localhost:4000/api/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Store the JWT and user information in AuthContext.
        login(token, response.data.user);

        // Redirect the user to the Dashboard.
        navigate("/dashboard", { replace: true });
      } catch (error) {
        console.error("Google login error:", error);

        setError(
          "Unable to complete Google login. Please try again."
        );
      }
    }

    completeGoogleLogin();
  }, [location.search, login, navigate]);

  return (
    <main className="auth-page">
      <div className="dashboard-container">
        <div className="auth-card">
          {error ? (
            <>
              <h2>Google Login Failed</h2>

              <p className="error api-error">
                {error}
              </p>

              <button
                type="button"
                onClick={() => navigate("/", { replace: true })}
              >
                Return to Login
              </button>
            </>
          ) : (
            <>
              <h2>Completing Google Login</h2>

              <p className="form-description">
                Please wait while we securely retrieve your account
                information.
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default GoogleCallback;
