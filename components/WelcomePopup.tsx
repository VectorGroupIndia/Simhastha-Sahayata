import React from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';

interface WelcomePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const WelcomePopup: React.FC<WelcomePopupProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center p-4 space-y-4">
        <h2 className="text-2xl font-bold text-orange-600">TH11983</h2>
        <div className="text-gray-700 dark:text-gray-300 space-y-2">
          <p><span className="font-semibold">Team Name:</span> <span className="text-indigo-600 dark:text-indigo-400">Transfigure</span></p>
          <p><span className="font-semibold">Presented by:</span> <span className="text-indigo-600 dark:text-indigo-400">Sujit Babar</span></p>
          <p className="font-semibold mt-2 text-indigo-600 dark:text-indigo-400">Transfigure Technologies Pvt Ltd</p>
        </div>
        <p className="text-xl font-bold text-orange-500 pt-4 border-t mt-4 dark:border-gray-600">
          Ujjain Simhastha Mahakumbha 2028
        </p>
        <div className="pt-4">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </Modal>
  );
};

export default WelcomePopup;