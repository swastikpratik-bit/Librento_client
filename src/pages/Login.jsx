import React, { useEffect, useState } from "react";
import { useNavigate, Link, Navigate, useLocation } from "react-router-dom";
import { BookOpen, Mail, Lock, ArrowLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/slices/authSlice";
import { getBooks } from "../store/slices/bookSlice";
import LoaderSpinner from "../components/extra/LoaderSpinner";

const Login = () => {
  const location = useLocation();
  const { loading, error, message, user, isAuthenticated } = useSelector(
    (state) => state.auth
  );
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (
    isAuthenticated &&
    user.role === "User" &&
    location.pathname === "/login"
  ) {
    // dispatch(getBooks());
    return <Navigate to="/user/dashboard" replace />;
  }

  if (
    isAuthenticated &&
    user.role === "Admin" &&
    location.pathname === "/login"
  ) {
    // dispatch(getBooks());
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (loading) {
    return <LoaderSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>

          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Librento</h2>
          </div>

          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Welcome Back
          </h3>
          <p className="text-gray-600">
            Sign in to access your library account
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link
                  to="/password/forgot"
                  className="text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-3 rounded-lg hover:from-emerald-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Create one here
              </Link>
            </p>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 text-center">
              Demo user credentials:
            </p>
            <p className="text-sm text-gray-800 text-center font-medium">
              Email: <span className="text-emerald-600">user@gmail.com</span> |
              Password: <span className="text-emerald-600">user1@gmail</span>
            </p>
            <p className="text-sm text-gray-800 text-center font-medium">
              Email: <span className="text-emerald-600">admin@gmail.com</span> |
              Password: <span className="text-emerald-600">admin@gmail</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
