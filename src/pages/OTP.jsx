import React, { useState, useEffect } from "react";
import {
  useNavigate,
  useLocation,
  Link,
  useParams,
  Navigate,
} from "react-router-dom";
import { BookOpen, ArrowLeft, RefreshCw } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { otpVerification, resetAuthSlice } from "../store/slices/authSlice";

// import { useLibrary } from '../../context/LibraryContext';

const OTP = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();

  // take email from params;

  const { email } = useParams();

  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (error) {
      setOtp(["", "", "", "", "", ""]);
    }

    if (!email) {
      navigate("/register");
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [email, navigate, error]);

  if (isAuthenticated) {
    return <Navigate to={"/user/dashboard"} />;
  }

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }

    dispatch(resetAuthSlice());
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    dispatch(otpVerification(email, otpCode));
    dispatch(resetAuthSlice());
  };

  // const handleResendOtp = async () => {
  //   if (!canResend) return;

  //   setIsLoading(true);

  //   try {
  //     // await resendOtp(email);

  //     setTimeLeft(300);
  //     setCanResend(false);
  //     setOtp(["", "", "", "", "", ""]);
  //   } catch (err) {
  //     setError("Failed to resend OTP. Please try again.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Librento</h2>
          </div>

          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Verify Your Email
          </h3>
          <p className="text-gray-600 mb-4">
            We've sent a 6-digit verification code to
          </p>
          <p className="text-emerald-600 font-medium">{email}</p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                Enter Verification Code
              </label>
              <div className="flex gap-2 justify-center">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    required
                  />
                ))}
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
              {loading ? "Verifying..." : "Verify Email"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-2">
              {timeLeft > 0 ? (
                <>Code expires in {formatTime(timeLeft)}</>
              ) : (
                <>Code has expired</>
              )}
            </p>

            {/* <button
              onClick={handleResendOtp}
              disabled={!canResend || isLoading}
              className="inline-flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className="w-4 h-4" />
              {canResend ? "Resend Code" : "Resend Available Soon"}
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTP;
