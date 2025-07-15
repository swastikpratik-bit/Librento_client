import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { BookOpen, Users, BarChart3, Shield, ArrowRight } from "lucide-react";
import { useSelector } from "react-redux";
import LoaderSpinner from "../components/extra/LoaderSpinner";

const Landing = () => {
  const navigate = useNavigate();

  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  if (isAuthenticated && user.role === "User") {
    return <Navigate to={"/user/dashboard"} />;
  }
  if (isAuthenticated && user.role === "Admin") {
    return <Navigate to={"/admin/dashboard"} />;
  }

  if (loading) {
    return <LoaderSpinner />;
  }

  const features = [
    {
      icon: BookOpen,
      title: "Book Management",
      description:
        "Easily manage your library catalog with advanced search and categorization",
    },
    {
      icon: Users,
      title: "Member Management",
      description:
        "Track member information, membership types, and activity status",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description:
        "Get insights into borrowing trends, popular books, and library statistics",
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Built with security in mind and reliable data management",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Librento</h1>
            </div>

            <button
              onClick={() => navigate("/login")}
              className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-6 py-2 rounded-lg hover:from-emerald-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center ">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 mb-6 ">
              Modern Library
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-500 overflow-y-hidden">
                Management System
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Streamline your library operations with our comprehensive
              management system. Track books, manage members, and analyze
              library usage with ease.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/register")}
                className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-8 py-3 rounded-lg hover:from-emerald-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 justify-center"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => navigate("/user-books")}
                className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Browse Books
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Manage Your Library
            </h2>
            <p className="text-xl text-gray-600">
              Powerful features designed to make library management effortless
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl hover:shadow-lg transition-shadow duration-300 border border-gray-100"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-3xl font-bold text-emerald-600 mb-2">
                10,000+
              </div>
              <div className="text-gray-600">Books Managed</div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                1,000+
              </div>
              <div className="text-gray-600">Active Members</div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                99.9%
              </div>
              <div className="text-gray-600">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold">Librento</h3>
          </div>

          <div className="text-center text-gray-400">
            <p>&copy; 2024 Librento. All rights reserved.</p>
            <p className="mt-2">Modern Library Management System</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
