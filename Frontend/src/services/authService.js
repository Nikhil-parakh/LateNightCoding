// const API_BASE_URL = "http://127.0.0.1:5000";
// // ⚠️ yahan backend ka base URL hoga (confirm karo)

// export const loginUser = async (data) => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/login`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     });

//     const result = await response.json();

//     if (!response.ok) {
//       throw new Error(result.message || "Login failed");
//     }

//     return result;
//   } catch (error) {
//     throw error;
//   }
// };

// export const registerUser = async (data) => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/register`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     });

//     const result = await response.json();

//     if (!response.ok) {
//       throw new Error(result.message || "Registration failed");
//     }

//     return result;
//   } catch (error) {
//     throw error;
//   }
// };
import apiClient from "./apiClient";

// LOGIN
export const loginUser = async (data) => {
  const response = await apiClient.post("/login", data);
  return response.data;
};

// REGISTER
export const registerUser = async (data) => {
  const response = await apiClient.post("/register", data);
  return response.data;
};