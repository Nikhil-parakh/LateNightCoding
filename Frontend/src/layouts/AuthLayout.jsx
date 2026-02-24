const AuthLayout = ({ children }) => {
  return (
    <div className="auth-page-wrapper">
      {/* PAGE LEFT BACKGROUND */}
      <div className="auth-page-left"></div>

      {/* PAGE RIGHT BACKGROUND */}
      <div className="auth-page-right"></div>

      {/* CENTER CARD */}
      <div className="auth-card-wrapper">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;