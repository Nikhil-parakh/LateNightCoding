import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerCompany, verifyCompanyOtp } from "../../services/authService";
import FullScreenLoader from "../../components/common/FullScreenLoader";

const RegisterForm = () => {
  const navigate = useNavigate();

  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [managerName, setManagerName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [otp, setOtp] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [redirectLoading, setRedirectLoading] = useState(false);
  const [step, setStep] = useState("register");

  // ================= REGISTER =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await registerCompany({
        company_name: companyName,
        industry,
        manager_name: managerName,
        email,
        password,
      });

      localStorage.setItem("otp_email", email);

      setRedirectLoading(true);

      setTimeout(() => {
        setRedirectLoading(false);
        setStep("otp");
      }, 1200);
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

  // ================= OTP VERIFY =================
  const handleVerifyOtp = async () => {
    setError("");

    try {
      setRedirectLoading(true);

      await verifyCompanyOtp({
        email,
        otp,
      });

      setTimeout(() => {
        localStorage.removeItem("otp_email");
        navigate("/login");
      }, 1200);
    } catch (err) {
      setRedirectLoading(false);

      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("OTP verification failed.");
      }
    }
  };

  return (
    <>
      {redirectLoading && <FullScreenLoader />}

      <div className="auth-container">
        {/* LEFT SIDE */}
        <div className="auth-left">
          <div className="auth-left-inner">
            {step === "register" ? (
              <>
                <h2 className="auth-heading">Register Manager</h2>
                <p className="auth-desc">Create your company account</p>

                {error && <p className="error-text">{error}</p>}

                <form onSubmit={handleSubmit}>
                  <div className="input-group">
                    <label className="input-label">Company Name *</label>
                    <input
                      className="auth-input"
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Industry *</label>
                    <input
                      className="auth-input"
                      type="text"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Manager Name *</label>
                    <input
                      className="auth-input"
                      type="text"
                      value={managerName}
                      onChange={(e) => setManagerName(e.target.value)}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Email *</label>
                    <input
                      className="auth-input"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Password *</label>
                    <input
                      className="auth-input"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <button className="auth-btn" disabled={loading}>
                    {loading ? "Creating..." : "Create Manager"}
                  </button>
                </form>

                <p className="bottom-text">
                  Already have an account?{" "}
                  <span onClick={() => navigate("/login")}>Login</span>
                </p>
              </>
            ) : (
              <>
                <h2 className="auth-heading">Verify OTP</h2>
                <p className="auth-desc">
                  Enter 6 digit code sent to your email
                </p>

                {error && <p className="error-text">{error}</p>}

                <div className="otp-inputs">
                  {[...Array(6)].map((_, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      className="otp-box"
                      value={otp[index] || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (!/^[0-9]?$/.test(value)) return;

                        const newOtp = otp.split("");
                        newOtp[index] = value;
                        setOtp(newOtp.join(""));

                        if (value && e.target.nextSibling) {
                          e.target.nextSibling.focus();
                        }
                      }}
                    />
                  ))}
                </div>

                <button className="auth-btn" onClick={handleVerifyOtp}>
                  Verify OTP
                </button>
              </>
            )}
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

          <div
            className="theme-toggle"
            onClick={() => document.body.classList.toggle("dark")}
          >
            🌙
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterForm;
