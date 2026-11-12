
function GoogleAuthButton() {
  return (
    <a
      href="http://localhost:4000/api/auth/google"
      className="google-auth-button"
    >
      <span className="google-icon">G</span>

      Sign in with Google
    </a>
  );
}

export default GoogleAuthButton;
