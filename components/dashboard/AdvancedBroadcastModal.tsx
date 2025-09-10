
import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useLocalization } from '../../hooks/useLocalization';
import { UserRole } from '../../types';

interface AdvancedBroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (message: string, recipients: (UserRole | 'All' | 'Pilgrims' | 'Staff')[]) => void;
}

const CheckboxItem: React.FC<{ id: string, label: string, checked: boolean, onChange: (checked: boolean) => void }> = ({ id, label, checked, onChange }) => (
    <div className="flex items-center">
        <input
            id={id}
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
        />
        <label htmlFor={id} className="ml-3 block text-sm font-medium text-gray-700">
            {label}
        </label>
    </div>
);

export const AdvancedBroadcastModal: React.FC<AdvancedBroadcastModalProps> = ({ isOpen, onClose, onConfirm }) => {
    const { translations } = useLocalization();
    const t = translations.dashboard.authorities.advancedBroadcast;

    const [message, setMessage] = useState('');
    const [recipients, setRecipients] = useState<Record<string, boolean>>({});

    const staffRoles = [
        UserRole.AUTHORITY,
        UserRole.VOLUNTEER,
    ];

    const handleRecipientChange = (key: string, value: boolean) => {
        setRecipients(prev => ({ ...prev, [key]: value }));
    };

    const handleConfirm = () => {
        const selectedRecipients = Object.entries(recipients)
            .filter(([, isSelected]) => isSelected)
            .map(([key]) => key as UserRole | 'All' | 'Pilgrims' | 'Staff');

        if (selectedRecipients.length > 0 && message.trim()) {
            onConfirm(message, selectedRecipients);
            setMessage('');
            setRecipients({});
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t.title}>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.recipients}</label>
                    <div className="space-y-2 p-3 bg-gray-50 rounded-md border">
                        <CheckboxItem id="all" label={t.groups.all} checked={!!recipients['All']} onChange={(c) => handleRecipientChange('All', c)} />
                        <CheckboxItem id="pilgrims" label={t.groups.pilgrims} checked={!!recipients['Pilgrims']} onChange={(c) => handleRecipientChange('Pilgrims', c)} />
                        <CheckboxItem id="staff" label={t.groups.staff} checked={!!recipients['Staff']} onChange={(c) => handleRecipientChange('Staff', c)} />
                        <div className="pl-6 border-l ml-2 space-y-2">
                            {staffRoles.map(role => (
                                <CheckboxItem key={role} id={role} label={`All ${role}s`} checked={!!recipients[role]} onChange={(c) => handleRecipientChange(role, c)} />
                            ))}
                        </div>
                    </div>
                </div>
                <div>
                    <label htmlFor="broadcast-message-adv" className="block text-sm font-medium text-gray-700">{t.message}</label>
                    <textarea
                        id="broadcast-message-adv"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={4}
                        className="mt-1 w-full p-2 border rounded-md focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Enter your message here..."
                    />
                </div>
                <div className="flex justify-end gap-4 pt-2">
                    <Button variant="secondary" onClick={onClose}>{translations.dashboard.broadcastModal.cancel}</Button>
                    <Button onClick={handleConfirm}>
                        {t.send}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
