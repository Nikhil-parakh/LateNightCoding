import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import profileImg from "../../assets/icons/profile.png";
import editIcon from "../../assets/icons/edit.png";
import settingsIcon from "../../assets/icons/setting.png";
import logoutIcon from "../../assets/icons/logout.png";
import bellIcon from "../../assets/icons/bell.png";
import moonIcon from "../../assets/icons/moon.png";
import menuIcon from "../../assets/icons/menu.png";
import sunIcon from "../../assets/icons/sun.png";

const ManagerTopbar = ({ toggleSidebar, darkMode, toggleDarkMode }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("manager_name");
    localStorage.removeItem("manager_email");

    navigate("/login");
  };

  const managerName = localStorage.getItem("manager_name") || "Manager";
  const managerEmail =
    localStorage.getItem("manager_email") || "manager@email.com";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="topbar">
      {/* LEFT SIDE */}
      <div className="topbar-left">
        <img
          src={menuIcon}
          alt=""
          className="icon-btn"
          onClick={toggleSidebar}
        />

        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search or type command..."
            className="topbar-search"
          />
          <span className="shortcut">⌘K</span>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="topbar-right" ref={dropdownRef}>
        <img
          src={darkMode ? sunIcon : moonIcon}
          alt=""
          className="icon-btn"
          onClick={toggleDarkMode}
        />
        <img src={bellIcon} alt="" className="icon-btn" />

        <div className="profile-trigger" onClick={() => setOpen(!open)}>
          <img src={profileImg} alt="" className="profile-avatar" />
          <span>{managerName}</span>
          <span className="profile-arrow">{open ? "▲" : "▼"}</span>
        </div>

        {open && (
          <div className="profile-dropdown">
            <div className="dropdown-header">
              <img src={profileImg} alt="" />
              <div>
                <strong>{managerName}</strong>
                <p>{managerEmail}</p>
              </div>
            </div>

            <div
              className="dropdown-item"
              onClick={() => navigate("/manager/profile")}
            >
              <img src={editIcon} alt="" />
              Edit Profile
            </div>

            <div className="dropdown-item">
              <img src={settingsIcon} alt="" />
              Account Settings
            </div>

            <div className="dropdown-item logout" onClick={handleLogout}>
              <img src={logoutIcon} alt="" />
              Sign Out
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerTopbar;
