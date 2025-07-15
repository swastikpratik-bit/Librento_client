import React from "react";
import { CheckCircle, XCircle, Info } from "lucide-react";
import { useLibrary } from "../../../context/LibraryContext";

const Toast = () => {
  const { toast } = useLibrary();

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "info":
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBackgroundColor = () => {
    switch (toast.type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "error":
        return "bg-red-50 border-red-200";
      case "info":
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg ${getBackgroundColor()}`}
      >
        {getIcon()}
        <span className="text-sm font-medium text-gray-800">
          {toast.message}
        </span>
      </div>
    </div>
  );
};

export default Toast;
