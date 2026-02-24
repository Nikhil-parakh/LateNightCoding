import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div style={styles.nav}>
      <div style={styles.left}>
        <h3>Student Portal</h3>
      </div>

      <div style={styles.center}>
        <button onClick={() => navigate("/dashboard")} style={styles.btn}>
          Dashboard
        </button>

        {(role === "manager") && (
          <button onClick={() => navigate("/register")} style={styles.btn}>
            Create User
          </button>
        )}
      </div>

      <div style={styles.right}>
        <span style={styles.role}>{role}</span>
        <button onClick={handleLogout} style={styles.logout}>
          Logout
        </button>
      </div>
    </div>
  );
};

const styles = {
  nav: {
    height: "60px",
    background: "#0b0b0f",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
  },
  left: { flex: 1 },
  center: { flex: 1, display: "flex", gap: "10px", justifyContent: "center" },
  right: { flex: 1, display: "flex", gap: "10px", justifyContent: "flex-end" },
  btn: {
    background: "#a855f7",
    border: "none",
    color: "#fff",
    padding: "6px 12px",
    cursor: "pointer",
    borderRadius: "6px",
  },
  logout: {
    background: "#ef4444",
    border: "none",
    color: "#fff",
    padding: "6px 12px",
    cursor: "pointer",
    borderRadius: "6px",
  },
  role: { textTransform: "uppercase", fontSize: "12px", opacity: 0.8 },
};

export default Navbar;
