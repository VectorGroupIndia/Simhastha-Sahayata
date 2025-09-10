import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useLocalization } from '../../hooks/useLocalization';

interface BroadcastAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (message: string) => void;
}

export const BroadcastAlertModal: React.FC<BroadcastAlertModalProps> = ({ isOpen, onClose, onConfirm }) => {
    const { translations } = useLocalization();
    const t = translations.dashboard.broadcastModal;
    const [message, setMessage] = useState('');

    const handleConfirm = () => {
        onConfirm(message);
        setMessage('');
    };

    const handleClose = () => {
        setMessage('');
        onClose();
    }

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title={t.title}>
            <div className="space-y-4">
                <p className="text-gray-600">{t.description}</p>
                <div>
                    <label htmlFor="broadcast-message" className="sr-only">Alert Message</label>
                    <textarea
                        id="broadcast-message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={3}
                        placeholder={t.placeholder}
                        className="w-full p-2 border rounded-md focus:ring-orange-500 focus:border-orange-500"
                    />
                </div>
                <div className="flex justify-end gap-4 pt-2">
                    <Button variant="secondary" onClick={handleClose}>{t.cancel}</Button>
                    <Button variant="danger" onClick={handleConfirm}>
                        {t.confirm}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};