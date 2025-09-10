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
import React from 'react';

// Props for the Button component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
}

/**
 * A reusable button component with consistent styling.
 * This promotes UI consistency and reduces code duplication.
 */
export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseClasses = 'px-6 py-2 rounded-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-orange-500 hover:bg-orange-600 text-white focus:ring-orange-500',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-400',
    danger: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};