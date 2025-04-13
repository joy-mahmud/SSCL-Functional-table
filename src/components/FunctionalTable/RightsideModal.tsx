import React, { ReactNode, useEffect } from "react";

interface RightSideModalProps {
  isOpen: boolean;
  onClose: () => void;
  height?: string; // e.g. "h-[400px]"
  children: ReactNode;
}

const RightSideModal: React.FC<RightSideModalProps> = ({
  isOpen,
  onClose,
  children,
  height = "h-[500px]", // default height
}) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-transparent flex justify-end items-center">
      {/* Overlay click */}
      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      {/* Centered right-side modal */}
      <div
        className={`relative bg-white shadow-xl p-6 w-full max-w-[400px] rounded-md ${height} transition-transform duration-300 ease-in-out`}
      >
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};

export default RightSideModal;

