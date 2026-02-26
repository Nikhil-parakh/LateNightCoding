import apiClient from "./apiClient";

// LOGIN (used by Admin, Manager, Employee)
export const loginUser = async (data) => {
  const response = await apiClient.post("/login", data);
  return response.data;
};

// COMPANY REGISTER (Manager Registration)
export const registerCompany = async (data) => {
  const response = await apiClient.post(
    "/company/register-company",
    data
  );
  return response.data;
};

// VERIFY OTP
export const verifyCompanyOtp = async (data) => {
  const response = await apiClient.post(
    "/company/verify-otp",
    data
  );
  return response.data;
};