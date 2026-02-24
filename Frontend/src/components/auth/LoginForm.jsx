import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";

const LoginForm = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await loginUser({ email, password });

      let role = response.role.toLowerCase();

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

      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card new-auth">
        <div className="brand-section">
          <h1 className="brand-title">Salesify</h1>
          <p className="brand-subtitle">Smart Sales Dashboard</p>
        </div>

        <h2 className="auth-title">Welcome Back 👋</h2>
        <p className="auth-subtitle">Please enter your credentials</p>

        {error && <p className="error-text">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label className="input-label">Email Address</label>
          <input
            className="auth-input"
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
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
              <span>Remember me</span>
            </label>

            <span className="forgot-text">Forgot password?</span>
          </div>

          <button className="auth-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="bottom-text">
          Don’t have an account?{" "}
          <span onClick={() => navigate("/register")}>Sign up</span>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
