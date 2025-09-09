import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useLocalization } from '../../hooks/useLocalization';
import { useToast } from '../../hooks/useToast';

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CopyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" /><path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" /></svg>;

export const InviteMemberModal: React.FC<InviteMemberModalProps> = ({ isOpen, onClose }) => {
    const { translations } = useLocalization();
    const { addToast } = useToast();
    const t = translations.familyHub.inviteModal;

    const invitationLink = 'simhastha.app/join/A7B2C9';

    const handleCopy = () => {
        navigator.clipboard.writeText(invitationLink).then(() => {
            addToast(t.linkCopied, 'success');
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            addToast('Failed to copy link', 'error');
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t.title}>
            <div className="space-y-4 text-center">
                <p className="text-gray-600">{t.description}</p>
                <div className="flex items-center bg-gray-100 p-2 rounded-lg">
                    <input
                        type="text"
                        value={invitationLink}
                        readOnly
                        className="w-full bg-transparent border-none text-gray-700 focus:ring-0"
                    />
                     <Button onClick={handleCopy} className="flex-shrink-0">
                        <CopyIcon />
                        {t.copyLink}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};