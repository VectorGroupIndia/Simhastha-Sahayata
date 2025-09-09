
import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useLocalization } from '../../hooks/useLocalization';
import { RegisteredItem } from '../../types';

interface MarkAsLostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (lastSeen: string, description: string) => void;
    item: RegisteredItem | null;
}

export const MarkAsLostModal: React.FC<MarkAsLostModalProps> = ({ isOpen, onClose, onConfirm, item }) => {
    const { translations } = useLocalization();
    const t = translations.myItems.markAsLostModal;
    const reportT = translations.report;
    
    const [lastSeen, setLastSeen] = useState('');
    const [description, setDescription] = useState('');

    if (!item) return null;

    const handleSubmit = () => {
        if (lastSeen.trim()) {
            onConfirm(lastSeen, description);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t.title}>
            <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <img src={item.images[0]} alt={item.name} className="w-16 h-16 object-cover rounded-md"/>
                    <div>
                        <h4 className="font-bold text-lg">{item.name}</h4>
                        <p className="text-sm text-gray-500">{item.subCategory}</p>
                    </div>
                </div>

                <p className="text-gray-600">{t.description}</p>

                <div>
                    <label htmlFor="lastSeenLost" className="block text-sm font-medium text-gray-700">{reportT.lastSeen}</label>
                    <input
                        type="text"
                        id="lastSeenLost"
                        value={lastSeen}
                        onChange={e => setLastSeen(e.target.value)}
                        required
                        placeholder={reportT.lastSeenPlaceholder}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                    />
                </div>
                 <div>
                    <label htmlFor="descriptionLost" className="block text-sm font-medium text-gray-700">{reportT.description}</label>
                    <textarea
                        id="descriptionLost"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        rows={2}
                        placeholder={reportT.descriptionPlaceholder}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                    />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button variant="danger" onClick={handleSubmit} disabled={!lastSeen.trim()}>
                        {t.confirmButton}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};