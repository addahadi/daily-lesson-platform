import { useEffect } from "react";

export const Toast = ({ type = "info", message, onClose } : {
    type : "success" | "error" | "info",
    message : string, 
    onClose : () => void
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Auto-close after 3s
    return () => clearTimeout(timer);
  }, [onClose]);

  const getStyle = () => {
    switch (type) {
      case "success":
        return "bg-green-500 text-white";
      case "error":
        return "bg-red-500 text-white";
      case "info":
      default:
        return "bg-blue-500 text-white";
    }
  };

  return (
    <div
      className={`fixed top-5 right-5 z-50 px-4 py-2 rounded shadow-lg ${getStyle()}`}
    >
      {message}
    </div>
  );
};
