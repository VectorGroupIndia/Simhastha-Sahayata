import React from 'react';
import { useToast } from '../hooks/useToast';
import { Toast } from './ui/Toast';

/**
 * Renders a container for toast notifications.
 * It positions the toasts at the top-right of the screen.
 */
const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-20 right-4 z-[100] space-y-2 w-full max-w-sm">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onDismiss={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default ToastContainer;