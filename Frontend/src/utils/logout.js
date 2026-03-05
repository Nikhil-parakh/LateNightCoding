export const logoutUser = (navigate) => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");

  navigate("/login");
};
