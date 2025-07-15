import React from "react";

const LoaderSpinner = ({ size = 24, color = "text-emerald-500" }) => {
  return (
    <div className="flex items-center justify-center py-6">
      <div
        className={`animate-spin rounded-full border-4 border-gray-200 border-t-transparent ${color}`}
        style={{ width: size, height: size }}
      ></div>
    </div>
  );
};

export default LoaderSpinner;
