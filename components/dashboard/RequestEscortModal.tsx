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
import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useLocalization } from '../../hooks/useLocalization';

interface RequestEscortModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (from: string, to: string, message: string) => void;
}

export const RequestEscortModal: React.FC<RequestEscortModalProps> = ({ isOpen, onClose, onConfirm }) => {
    const { translations } = useLocalization();
    const t = translations.escortModal;

    const [fromLocation, setFromLocation] = useState('');
    const [toLocation, setToLocation] = useState('');
    const [message, setMessage] = useState('');

    const handleConfirm = () => {
        if (fromLocation.trim() && toLocation.trim()) {
            onConfirm(fromLocation, toLocation, message);
            // Reset fields after confirming
            setFromLocation('');
            setToLocation('');
            setMessage('');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t.title}>
            <div className="space-y-4">
                <p className="text-gray-600">{t.description}</p>
                <div>
                    <label htmlFor="from-location" className="block text-sm font-medium text-gray-700">{t.fromLabel}</label>
                    <input
                        id="from-location"
                        type="text"
                        value={fromLocation}
                        onChange={(e) => setFromLocation(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                        placeholder={t.fromPlaceholder}
                        required
                    />
                </div>
                 <div>
                    <label htmlFor="to-location" className="block text-sm font-medium text-gray-700">{t.toLabel}</label>
                    <input
                        id="to-location"
                        type="text"
                        value={toLocation}
                        onChange={(e) => setToLocation(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                        placeholder={t.toPlaceholder}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="escort-message" className="block text-sm font-medium text-gray-700">{t.messageLabel}</label>
                     <textarea
                        id="escort-message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={2}
                        placeholder={t.messagePlaceholder}
                        className="mt-1 w-full p-2 border rounded-md focus:ring-orange-500 focus:border-orange-500"
                    />
                </div>

                <div className="flex justify-end gap-4 pt-2">
                    <Button variant="secondary" onClick={onClose}>{t.cancel}</Button>
                    <Button 
                        variant="primary" 
                        onClick={handleConfirm}
                        disabled={!fromLocation.trim() || !toLocation.trim()}
                    >
                        {t.confirm}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};