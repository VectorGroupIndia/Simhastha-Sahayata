import React from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';

interface InfoPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfoPopup: React.FC<InfoPopupProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-4 space-y-6">
        {/* Header Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-orange-600 dark:text-orange-400">
            Simhastha Sahayata
          </h2>
          <p className="text-xl text-gray-800 dark:text-gray-300 mt-1">
            Lost & Found Platform for Simhastha 2028
          </p>
        </div>

        {/* Details Section - Simplified */}
        <div className="space-y-5 text-lg text-gray-800 dark:text-gray-200 text-center">
          <div>
            <h4 className="font-semibold text-gray-600 dark:text-gray-400 text-sm uppercase tracking-wider">Theme</h4>
            <p>Safety, Security & Surveillance</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-600 dark:text-gray-400 text-sm uppercase tracking-wider">Registration Number</h4>
            <p className="font-mono text-xl bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md inline-block">TH11983</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-600 dark:text-gray-400 text-sm uppercase tracking-wider">Team Transfigure</h4>
            <p>Sujit Babar (Founder CEO)</p>
            <p>Raosaheb Babar (Co-Founder)</p>
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-8 text-center">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </Modal>
  );
};
