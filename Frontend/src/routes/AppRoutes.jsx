import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "../pages/Login/LoginPage";
import RegisterPage from "../pages/Register/RegisterPage";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import Unauthorized from "../pages/Unauthorized/Unauthorized";
import OtpVerify from "../components/auth/OtpVerify";
import TestConnection from "../pages/Test/TestConnection";

import ProtectedRoute from "./ProtectedRoute";
import RoleProtectedRoute from "./RoleProtectedRoute";
import UserLayout from "../layouts/UserLayout";
import CompaniesPage from "../pages/Dashboard/CompaniesPage";
import AuditLogsPage from "../pages/Dashboard/AuditLogsPage";
import EmployeeUpload from "../pages/Dashboard/EmployeeUpload";
import UserDashboard from "../pages/Dashboard/UserDashboard";
import UserCharts from "../pages/Dashboard/UserCharts";
import ManagerEmployeesPage from "../pages/Dashboard/ManagerEmployeesPage";
import ManagerDashboard from "../pages/Dashboard/ManagerDashboard";

const AppRoutes = ({ darkMode, toggleDarkMode }) => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ROOT REDIRECT */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* AUTH ROUTES */}
        <Route path="/login" element={<LoginPage />} />

        <Route path="/register" element={<RegisterPage />} />

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

        {/* TEST BACKEND */}
        <Route path="/test-backend" element={<TestConnection />} />

        <Route
          path="/manager/employees"
          element={
            <ProtectedRoute>
              <ManagerEmployeesPage
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager/dashboard"
          element={
            <ProtectedRoute>
              <ManagerDashboard
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/upload"
          element={
            <ProtectedRoute>
              <UserLayout>
                <EmployeeUpload />
              </UserLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/charts"
          element={
            <ProtectedRoute>
              <UserCharts />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
