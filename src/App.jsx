import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import OTP from "./pages/OTP";
import UserDashboard from "./pages/UserDashboard";
import UserBooks from "./pages/UserBooks";
import Dashboard from "./components/admin/pages/Dashboard/Dashboard";
import Books from "./components/admin/pages/Books/Books";
import Members from "./components/admin/pages/Members/Members";
import BorrowRecords from "./components/admin/pages/BorrowReturn/BorrowReturn";
import NotFound from "./components/extra/NotFound";
import LoaderSpinner from "./components/extra/LoaderSpinner";
import Sidebar from "./layout/Sidebar";
import Navbar from "./layout/Navbar";
import { getUser } from "./store/slices/authSlice";

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRole }) => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  if (loading) return <LoaderSpinner />;

  if (!isAuthenticated) return <Navigate to="/login" />;

  if (allowedRole && user.role !== allowedRole) return <Navigate to="/login" />;

  return children;
};

// Admin Layout
const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

// User Layout
const UserLayout = ({ children }) => (
  <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-white">
    {children}
  </div>
);

const App = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  if (loading) {
    return <LoaderSpinner />;
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />
        <Route path="/otp-verification/:email" element={<OTP />} />
        <Route path="/login" element={<Login />} />

        {/* User Protected Routes */}
        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute allowedRole="User">
              <UserLayout>
                <UserDashboard />
              </UserLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/books"
          element={
            <ProtectedRoute allowedRole="User">
              <UserLayout>
                <UserBooks />
              </UserLayout>
            </ProtectedRoute>
          }
        />

        {/* Admin Protected Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRole="Admin">
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/books"
          element={
            <ProtectedRoute allowedRole="Admin">
              <AdminLayout>
                <Books />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/members"
          element={
            <ProtectedRoute allowedRole="Admin">
              <AdminLayout>
                <Members />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/borrow-records"
          element={
            <ProtectedRoute allowedRole="Admin">
              <AdminLayout>
                <BorrowRecords />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
};

export default App;
