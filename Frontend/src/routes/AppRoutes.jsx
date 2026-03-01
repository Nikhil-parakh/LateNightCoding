import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "../pages/Login/LoginPage";
import RegisterPage from "../pages/Register/RegisterPage";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import Unauthorized from "../pages/Unauthorized/Unauthorized";
import OtpVerify from "../components/auth/OtpVerify";
import TestConnection from "../pages/Test/TestConnection";

import ProtectedRoute from "./ProtectedRoute";
import RoleProtectedRoute from "./RoleProtectedRoute";

import CompaniesPage from "../pages/Dashboard/CompaniesPage";
import AuditLogsPage from "../pages/Dashboard/AuditLogsPage";
import EmployeeUpload from "../pages/Dashboard/EmployeeUpload";
import ManagerEmployeesPage from "../pages/Dashboard/ManagerEmployeesPage";
import ManagerDashboard from "../pages/Dashboard/ManagerDashboard";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* ROOT REDIRECT */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* AUTH ROUTES */}
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/register"
          element={
            <RoleProtectedRoute allowedRoles={["manager", "user", "admin"]}>
              <RegisterPage />
            </RoleProtectedRoute>
          }
        />

        <Route path="/verify-otp" element={<OtpVerify />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* COMPANIES */}
        <Route
          path="/companies"
          element={
            <ProtectedRoute>
              <CompaniesPage />
            </ProtectedRoute>
          }
        />

        {/* AUDIT LOGS */}
        <Route
          path="/audit-logs"
          element={
            <ProtectedRoute>
              <AuditLogsPage />
            </ProtectedRoute>
          }
        />

        {/* UPLOAD */}
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <EmployeeUpload />
            </ProtectedRoute>
          }
        />

        {/* TEST BACKEND */}
        <Route path="/test-backend" element={<TestConnection />} />
      

        <Route
          path="/manager/employees"
          element={
            <ProtectedRoute>
              <ManagerEmployeesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager/dashboard"
          element={
            <ProtectedRoute>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;