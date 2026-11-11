
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch fresh user information when the Dashboard loads.
  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser(response.data.user);
      } catch (error) {
        setError(
          error.response?.data?.error ||
            "Unable to load user information."
        );

        // If the backend rejects the token, log out.
        if (error.response?.status === 401) {
          logout();
          navigate("/", { replace: true });
        }
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [token, logout, navigate]);

  // Clear authentication data and return to login.
  function handleLogout() {
    logout();
    navigate("/", { replace: true });
  }

  // Display a loading message while fetching user information.
  if (loading) {
    return (
      <main className="auth-page">
        <div className="dashboard-container">
          <div className="auth-header">
            <h1>My Dashboard</h1>
            <p>Loading your account information...</p>
          </div>

          <div className="auth-card dashboard-card">
            <p className="dashboard-loading">
              Please wait while we load your profile.
            </p>
          </div>
        </div>
      </main>
    );
  }

  // Display an error if the user information could not be loaded.
  if (error || !user) {
    return (
      <main className="auth-page">
        <div className="dashboard-container">
          <div className="auth-header">
            <h1>My Dashboard</h1>
            <p>There was a problem accessing your account.</p>
          </div>

          <div className="auth-card dashboard-card">
            <p className="error api-error" role="alert">
              {error || "User information is unavailable."}
            </p>

            <button
              type="button"
              className="dashboard-logout"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Format the account creation date for display.
  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-KE", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Not available";

  return (
    <main className="auth-page">
      <div className="dashboard-container">

        {/* Dashboard heading */}
        <header className="auth-header">
          <h1>Welcome, {user.name}!</h1>
          <p>
            Manage your account and view your profile information.
          </p>
        </header>

        {/* User profile card */}
        <section className="auth-card dashboard-card">
          <div className="dashboard-card-header">
            <div className="profile-avatar">
              {user.name?.charAt(0).toUpperCase()}
            </div>

            <div>
              <h2>Account Overview</h2>
              <p className="dashboard-subtitle">
                Your personal account details
              </p>
            </div>
          </div>

          <div className="dashboard-details">

            <div className="detail-item">
              <span className="detail-label">Full Name</span>
              <span className="detail-value">{user.name}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Email Address</span>
              <span className="detail-value">{user.email}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Member Since</span>
              <span className="detail-value">{memberSince}</span>
            </div>

          </div>

          {/* Log out button */}
          <button
            type="button"
            className="dashboard-logout"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </section>

        <p className="dashboard-footer">
          Your account information is securely retrieved from the server.
        </p>

      </div>
    </main>
  );
}

export default Dashboard;
