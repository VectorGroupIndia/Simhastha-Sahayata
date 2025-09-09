import React, { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onDismiss: () => void;
}

const InfoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const SuccessIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ErrorIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;


export const Toast: React.FC<ToastProps> = ({ message, type, onDismiss }) => {
    const [isExiting, setIsExiting] = useState(false);

    const handleDismiss = () => {
        setIsExiting(true);
        setTimeout(onDismiss, 300); // Wait for animation to finish
    };

    const typeStyles = {
        success: {
            icon: <SuccessIcon />,
            classes: 'bg-green-500 text-white',
        },
        error: {
            icon: <ErrorIcon />,
            classes: 'bg-red-500 text-white',
        },
        info: {
            icon: <InfoIcon />,
            classes: 'bg-blue-500 text-white',
        },
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            handleDismiss();
        }, 4700); // Auto-dismiss slightly before context removes it

        return () => clearTimeout(timer);
    }, []);

    return (
        <div
            className={`flex items-center p-4 rounded-lg shadow-2xl transition-all duration-300 ${typeStyles[type].classes} ${isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'}`}
            role="alert"
        >
            <div className="flex-shrink-0">{typeStyles[type].icon}</div>
            <p className="flex-grow mx-3 font-medium">{message}</p>
            <button
                onClick={handleDismiss}
                className="flex-shrink-0 opacity-70 hover:opacity-100"
                aria-label="Dismiss"
            >
                &times;
            </button>
        </div>
    );
};