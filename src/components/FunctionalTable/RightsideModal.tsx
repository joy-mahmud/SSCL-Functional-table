// components/RightSideModal.tsx
"use client"
import React, { ReactNode, useEffect } from "react";

interface RightSideModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const RightSideModal: React.FC<RightSideModalProps> = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    // Prevent background scroll when modal is open
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-transparent">
      {/* Click outside to close */}
      <div
        className="absolute inset-0 top-1/2"
        onClick={onClose}
      />
      
      {/* Slide-in panel */}
      <div
        className="relative w-full max-w-md h-1/3 bg-white shadow-xl p-6 transform transition-transform duration-300 ease-in-out translate-x-0"
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
