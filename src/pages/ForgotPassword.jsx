import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BookOpen, Mail, ArrowLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword, resetAuthSlice } from "../store/slices/authSlice";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  // const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  // const [error, setError] = useState("");

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { loading, error, message, user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(forgotPassword(email));

    // try {
    //   const success = await forgotPassword(email);
    //   if (success) {
    //     setIsSuccess(true);
    //   } else {
    //     setError("Email not found. Please check your email address.");
    //   }
    // } catch (err) {
    //   setError("An error occurred. Please try again.");
    // } finally {
    //   setIsLoading(false);
    // }
  };

  if (false) {
    // dispatch(resetAuthSlice());
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
                <Mail className="w-8 h-8 text-green-600" />
              </div>

              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Check Your Email
              </h3>
              <p className="text-gray-600 mb-6">
                We've sent a password reset link to <strong>{email}</strong>
              </p>

              <div className="space-y-4">
                <Link
                  to="/login"
                  className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-3 rounded-lg hover:from-emerald-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
                >
                  Back to Login
                </Link>

                <button
                  onClick={() => {
                    setIsSuccess(false);
                    setEmail("");
                  }}
                  className="w-full text-gray-600 hover:text-gray-800 py-2"
                >
                  Try different email
                </button>
              </div>
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
            Forgot Password?
          </h3>
          <p className="text-gray-600">
            Enter your email to receive a reset link
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
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  placeholder="Enter your email address"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            {message?.success && (
              <div className="text-green-600 text-sm text-center bg-green-50 p-3 rounded-lg">
                {message.message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-3 rounded-lg hover:from-emerald-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Remember your password?{" "}
              <Link
                to="/login"
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
