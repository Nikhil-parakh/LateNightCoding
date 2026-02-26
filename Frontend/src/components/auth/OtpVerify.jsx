import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyCompanyOtp } from "../../services/authService";

const OtpVerify = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");

    const email = localStorage.getItem("otp_email");

    try {
      const res = await verifyCompanyOtp({
        email,
        otp,
      });

      alert(res.message);

      // OTP success → go to login
      localStorage.removeItem("otp_email");

      navigate("/login");

    } catch (err) {
        if (err.response?.data?.error) {
          setError(err.response.data.error);
        } else {
          setError("OTP verification failed.");
        }
      }
  };

  return (
  <div className="auth-page-wrapper">
    <div className="otp-card">
      <h2>Verify OTP</h2>
      <p className="sub-text">Enter 6 digit code sent to your email</p>

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

              // auto focus next
              if (value && e.target.nextSibling) {
                e.target.nextSibling.focus();
              }
            }}
          />
        ))}
      </div>

      {error && <p className="error-text">{error}</p>}

      <button className="auth-btn" onClick={handleVerify}>
        Verify OTP
      </button>

      <p className="resend-text">
        Didn’t receive code? <span>Resend</span>
      </p>
    </div>
  </div>
);

};

export default OtpVerify;
