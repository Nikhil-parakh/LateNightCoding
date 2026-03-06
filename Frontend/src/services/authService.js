import apiClient from "./apiClient";

// LOGIN (used by Admin, Manager, Employee)
export const loginUser = async (data) => {
  try {
    const response = await apiClient.post("/login", data);
    return response.data;
  } catch (error) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }

    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    throw new Error("Invalid email or password");
  }
};

// COMPANY REGISTER (Manager Registration)
export const registerCompany = async (data) => {
  try {
    const response = await apiClient.post("/company/register-company", data);
    return response.data;
  } catch (error) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }

    throw new Error("Registration failed");
  }
};

// VERIFY OTP
export const verifyCompanyOtp = async (data) => {
  try {
    const response = await apiClient.post("/company/verify-otp", data);
    return response.data;
  } catch (error) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }

    throw new Error("OTP verification failed");
  }
};
