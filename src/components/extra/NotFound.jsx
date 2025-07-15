import React from "react";
import { BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="flex items-center justify-center mb-6 w-20 h-20 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full">
        <BookOpen className="w-10 h-10 text-white" />
      </div>
      <h1 className="text-4xl font-bold text-gray-800 mb-2">
        404 - Page Not Found
      </h1>
      <p className="text-gray-600 mb-6 text-center max-w-md">
        Sorry, the page you're looking for doesn’t exist or has been moved.
      </p>
      <button
        onClick={() => navigate("/")}
        className="px-6 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition"
      >
        Go to Home
      </button>
    </div>
  );
};

export default NotFound;
