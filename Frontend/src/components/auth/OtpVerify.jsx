import { useState } from "react";
import { useNavigate } from "react-router-dom";

const OtpVerify = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleVerify = (e) => {
    e.preventDefault();

    // MOCK OTP CHECK
    if (otp === "123456") {
      localStorage.setItem("token", "mock-token");
      localStorage.setItem("role", "manager");
      navigate("/dashboard");
    } else {
      setError("Invalid OTP");
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
