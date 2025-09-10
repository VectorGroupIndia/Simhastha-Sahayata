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
        <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400">TH11983</h2>
        <div className="space-y-2">
          <p>
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">Team Name:</span>{' '}
            <span className="font-bold text-indigo-600 dark:text-indigo-400">Transfigure</span>
          </p>
          <p>
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">Presented by:</span>{' '}
            <span className="font-bold text-indigo-600 dark:text-indigo-400">Sujit Babar</span>
          </p>
          <p className="font-semibold mt-2 text-indigo-600 dark:text-indigo-400">Transfigure Technologies Pvt Ltd</p>
        </div>
        <p className="text-xl font-bold pt-4 border-t mt-4 dark:border-gray-600 text-teal-600 dark:text-teal-400">
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