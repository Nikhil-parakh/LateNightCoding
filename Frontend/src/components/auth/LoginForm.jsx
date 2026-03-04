import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import FullScreenLoader from "../../components/common/FullScreenLoader";

const LoginForm = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [redirectLoading, setRedirectLoading] = useState(false);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await loginUser({ email, password });

      let role = response.role?.toLowerCase();

      // 🔥 normalize backend roles
      if (role === "company manager") {
        role = "manager";
      }

      if (role === "admin") {
        role = "admin";
      }

      if (role === "employee") {
        role = "employee";
      }

      localStorage.setItem("token", response.token);
      localStorage.setItem("role", role);

      setRedirectLoading(true);

      setTimeout(() => {
        if (role === "admin") {
          navigate("/dashboard");
        } else if (role === "manager") {
          navigate("/manager/dashboard");
        } else if (role === "employee") {
          navigate("/user/dashboard");
        }
      }, 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {redirectLoading && <FullScreenLoader />}
      <div className="auth-container">
        {/* LEFT SIDE */}
        <div className="auth-left">
          <div className="auth-left-inner">
            <h2 className="auth-heading">Sign In</h2>
            <p className="auth-desc">
              Enter your email and password to sign in!
            </p>

            {error && <p className="error-text">{error}</p>}
            <div className="social-buttons">
              <button className="google-btn">
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  width="18"
                />
                Sign in with Google
              </button>
            </div>

            <div className="divider">Or</div>

            <form onSubmit={handleSubmit}>
              <label className="input-label">Email *</label>
              <input
                className="auth-input"
                type="email"
                placeholder="info@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <label className="input-label">Password *</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="auth-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <span
                  className="eye-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "🙈" : "👀"}
                </span>
              </div>

              <div className="auth-options">
                <label>
                  <input type="checkbox" />
                  <span>Keep me logged in</span>
                </label>

                <span className="forgot-text">Forgot password?</span>
              </div>

              <button className="auth-btn" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <p className="bottom-text">
              Don’t have an account?{" "}
              <span onClick={() => navigate("/register")}>Sign Up</span>
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="auth-right">
          <div className="grid-bg"></div>
          <div className="grid-fade"></div>
          <div className="highlight-square square1"></div>
          <div className="highlight-square square2"></div>

          <div className="branding-content">
            <h1>Salesify</h1>
            <p>Smart Sales Dashboard Platform</p>
          </div>
          <div className="theme-toggle" onClick={toggleTheme}>
            🌙
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
