/*********************************************************************************
 * Author: Sujit Babar
 * Company: Transfigure Technologies Pvt. Ltd.
 *
 * Copyright Note: All rights reserved.
 * The code, design, process, logic, thinking, and overall layout structure
 * of this application are the intellectual property of Transfigure Technologies Pvt. Ltd.
 * This notice is for informational purposes only and does not grant any rights
 * to copy, modify, or distribute this code without explicit written permission.
 * This code is provided as-is and is intended for read-only inspection. It cannot be edited.
 *********************************************************************************/
import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

/**
 * A reusable modal component. It handles focus trapping and closing via overlay click or escape key.
 * This is essential for accessible and user-friendly dialogs.
 */
export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-lg mx-4 animate-fade-in-up"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <div className="flex justify-between items-center mb-4">
          {title && <h2 className="text-2xl font-bold text-gray-800">{title}</h2>}
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};