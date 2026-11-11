
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Get the login function from AuthContext.
  const { login } = useAuth();

  // Get the function used to navigate to another page.
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear messages from the previous attempt.
    setError("");
    setSuccess("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:4000/api/auth/login",
        {
          email: email.trim(),
          password,
        }
      );

      const data = response.data;

      if (!data.token || !data.user) {
        setError(
          "Login response is missing the authentication information."
        );
        return;
      }

      // Update the shared authentication state.
      // AuthContext saves the token and user in localStorage.
      login(data.token, data.user);

      setSuccess(data.message || "Login successful!");
      setPassword("");

      // Redirect the authenticated user to the Dashboard.
      navigate("/dashboard");
    } catch (error) {
      if (error.response) {
        const data = error.response.data;

        setError(
          data.message ||
          data.error ||
          "Login failed. Please check your credentials."
        );
      } else if (error.request) {
        setError(
          "Unable to connect to the server. Please check that the backend is running."
        );
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      // Re-enable the button after the request finishes.
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>

        <p className="form-description">
          Enter your credentials to access your account.
        </p>

        <div className="form-group">
          <label htmlFor="login-email">Email</label>

          <input
            id="login-email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="login-password">Password</label>

          <input
            id="login-password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>

        {error && (
          <p className="error api-error" role="alert">
            {error}
          </p>
        )}

        {success && (
          <p className="success-message" role="status">
            {success}
          </p>
        )}

        {/* Disable the button while login is processing. */}
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
