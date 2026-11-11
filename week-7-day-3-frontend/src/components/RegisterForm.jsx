
import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [apiError, setApiError] = useState("");

  // Get the login function from AuthContext.
  const { login } = useAuth();

  // Get the function used to navigate to another page.
  const navigate = useNavigate();

  // Validate all registration fields before submitting.
  const validateForm = () => {
    const newErrors = {};

    if (name.trim().length < 2) {
      newErrors.name =
        "Name is required and must be at least 2 characters.";
    }

    // Validate the email format.
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!emailPattern.test(email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Validate the password length.
    if (password.length < 8) {
      newErrors.password =
        "Password must be at least 8 characters.";
    } else if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter and one number.";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);

    // Return true if no validation errors were found.
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccessMessage("");
    setApiError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:4000/api/auth/register",
        {
          name: name.trim(),
          email: email.trim(),
          password,
        }
      );

      const data = response.data;

      // Make sure the backend returned both required values.
      if (!data.token || !data.user) {
        setApiError(
          "Registration succeeded, but the server did not return the required authentication information."
        );
        return;
      }

      // Update shared authentication state.
      // AuthContext saves the token and user in localStorage.
      login(data.token, data.user);

      setSuccessMessage(
        data.message || "Registration successful!"
      );

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setErrors({});

      // Redirect the newly registered user to the Dashboard.
      navigate("/dashboard");
    } catch (error) {
      // Handle errors returned by the backend.
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        if (status === 409) {
          setApiError(
            data.message ||
            data.error ||
            "This email is already registered."
          );
        } else if (status === 400) {
          setApiError(
            data.message ||
            data.error ||
            "Please check your registration details."
          );
        } else {
          setApiError(
            data.message ||
            data.error ||
            "Registration failed. Please try again."
          );
        }
      } else if (error.request) {
        setApiError(
          "Unable to connect to the server. Please check that the backend is running."
        );
      } else {
        // Handle other unexpected errors.
        setApiError("An unexpected error occurred.");
      }
    } finally {
      // Stop the loading state whether the request succeeds or fails.
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <form onSubmit={handleSubmit}>
        <h2>Create an Account</h2>

        <p className="form-description">
          Fill in the details below to register.
        </p>

        <div className="form-group">
          <label htmlFor="name">Full Name</label>

          <input
            id="name"
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />

          {errors.name && (
            <p className="error">{errors.name}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>

          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />

          {errors.email && (
            <p className="error">{errors.email}</p>
          )}
        </div>

        {/* Password field */}
        <div className="form-group">
          <label htmlFor="password">Password</label>

          <input
            id="password"
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />

          {errors.password && (
            <p className="error">{errors.password}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">
            Confirm Password
          </label>

          <input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />

          {errors.confirmPassword && (
            <p className="error">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Display backend or connection errors. */}
        {apiError && (
          <p className="error api-error" role="alert">
            {apiError}
          </p>
        )}

        {/* Display registration success. */}
        {successMessage && (
          <p className="success-message" role="status">
            {successMessage}
          </p>
        )}

        {/* Disable the button while registration is processing. */}
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}

export default RegisterForm;
