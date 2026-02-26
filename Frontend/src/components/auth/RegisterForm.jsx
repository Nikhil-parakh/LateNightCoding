import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerCompany } from "../../services/authService";

const RegisterForm = () => {
  
  const navigate = useNavigate();

  

  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [managerName, setManagerName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await registerCompany({
        company_name: companyName,
        industry,
        manager_name: managerName,
        email,
        password,
      });

      localStorage.setItem("otp_email", email);
      navigate("/verify-otp");

    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Registration failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card new-auth">

        <h2 className="auth-title">Register Manager</h2>
        <p className="auth-subtitle">Create your company account</p>

        {error && <p className="error-text">{error}</p>}

        <form onSubmit={handleSubmit}>

          <input
            className="auth-input"
            type="text"
            placeholder="Company Name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />

          <input
            className="auth-input"
            type="text"
            placeholder="Industry"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
          />

          <input
            className="auth-input"
            type="text"
            placeholder="Manager Name"
            value={managerName}
            onChange={(e) => setManagerName(e.target.value)}
          />

          <input
            className="auth-input"
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="auth-input"
            type="password"
            placeholder="Create Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="auth-btn" disabled={loading}>
            {loading ? "Creating..." : "Create Manager"}
          </button>

        </form>

        <p className="bottom-text">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Login</span>
        </p>

      </div>
    </div>
  );
};

export default RegisterForm;
