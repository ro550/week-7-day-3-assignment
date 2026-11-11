import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./components/Dashboard";

import { useAuth } from "./context/AuthContext";

import "./App.css";

function Home() {
  const { isAuthenticated } = useAuth();

  // If already logged in, display the dashboard.
  if (isAuthenticated) {
    return <Dashboard />;
  }

  // Otherwise, display the login and registration forms.
  return (
    <main className="auth-page">
      <h1>Authentication System</h1>

      <div className="auth-layout">
        <RegisterForm />
        <LoginForm />
      </div>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;