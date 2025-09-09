import React from 'react';

interface ImageZoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  altText?: string;
}

/**
 * A simple modal for displaying a zoomed-in image.
 * It darkens the background to focus on the image content.
 */
export const ImageZoomModal: React.FC<ImageZoomModalProps> = ({ isOpen, onClose, imageUrl, altText = 'Zoomed Image' }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 z-[60] flex justify-center items-center animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image zoom view"
    >
      <div className="relative p-4" onClick={(e) => e.stopPropagation()}>
        <img src={imageUrl} alt={altText} className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg" />
        <button 
            onClick={onClose} 
            className="absolute -top-2 -right-2 bg-white rounded-full p-1 text-gray-800 hover:bg-gray-200 text-3xl leading-none w-10 h-10 flex items-center justify-center shadow-lg"
            aria-label="Close image zoom"
        >
            &times;
        </button>
      </div>
    </div>
  );
};