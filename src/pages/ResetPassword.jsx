import { ArrowLeft, BookOpen, CheckCircle, Lock } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../store/slices/authSlice";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [tokenValid, setTokenValid] = useState(true);

  const navigate = useNavigate();

  const { token } = useParams();

  const dispatch = useDispatch();

  const { user, error, message } = useSelector((state) => state.auth);

  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      return;
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (formData.password !== formData.confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8 || formData.confirmPassword.length > 16) {
      setLocalError("Password must be between 8 and 16 characters long");
      return;
    }

    dispatch(resetPassword(formData.password, token));
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Librento</h2>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                Invalid Reset Link
              </h3>
              <p className="text-gray-600 mb-6">
                This password reset link is invalid or has expired. Please
                request a new one.
              </p>

              <Link
                to="/forgot-password"
                className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-3 rounded-lg hover:from-emerald-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                Request New Reset Link
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (message) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Librento</h2>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>

              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Password Reset Successful
              </h3>
              <p className="text-gray-600 mb-6">
                Your password has been successfully reset. You can now sign in
                with your new password.
              </p>

              <Link
                to="/login"
                className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-3 rounded-lg hover:from-emerald-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                Sign In Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>

          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Librento</h2>
          </div>

          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Reset Your Password
          </h3>
          <p className="text-gray-600">Enter your new password below</p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                New Password
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
                  placeholder="Enter new password"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  placeholder="Confirm new password"
                  required
                />
              </div>
            </div>

            {(error || localError) && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
                {error || localError}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-3 rounded-lg hover:from-emerald-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
