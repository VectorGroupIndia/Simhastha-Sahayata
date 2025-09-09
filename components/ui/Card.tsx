import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * A simple, reusable card component for consistent content containers.
 */
export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden p-6 ${className}`}>
      {children}
    </div>
  );
};