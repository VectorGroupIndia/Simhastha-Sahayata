import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useLocalization } from '../../hooks/useLocalization';
import { useAuth } from '../../hooks/useAuth';

interface SosCallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>;
// FIX: Updated AlertIcon to accept a className prop to fix type error.
const AlertIcon = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" className={`h-12 w-12 text-red-500 ${className || ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;

export const SosCallModal: React.FC<SosCallModalProps> = ({ isOpen, onClose }) => {
  const { translations } = useLocalization();
  const { user } = useAuth();

  const handleCall = (number: string) => {
      window.location.href = `tel:${number}`;
  };

  const t = translations.sosCallModal;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t.title}>
        <div className="text-center">
            <AlertIcon className="mx-auto mb-4" />
            <p className="text-gray-600 mb-2">{t.description}</p>
            <p className="text-sm text-gray-500 mb-6">{t.notifiedContacts}</p>
            <div className="space-y-4">
                <Button onClick={() => handleCall('100')} variant="danger" className="w-full text-lg flex items-center justify-center">
                    <PhoneIcon />
                    {t.callPolice}
                </Button>
                <Button onClick={() => handleCall('108')} variant="danger" className="w-full text-lg flex items-center justify-center">
                    <PhoneIcon />
                    {t.callAmbulance}
                </Button>
                {user?.emergencyContacts && user.emergencyContacts.length > 0 && (
                     <div className="pt-2 border-t">
                        <p className="text-sm text-gray-600 my-2">{t.callContactLabel}</p>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                            {user.emergencyContacts.map(contact => (
                                <Button key={contact.id} onClick={() => handleCall(contact.phone)} variant="primary" className="w-full flex items-center justify-center">
                                    <PhoneIcon />
                                    {t.call} {contact.name}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div className="mt-8">
                <Button onClick={onClose} variant="secondary">{t.close}</Button>
            </div>
        </div>
    </Modal>
  );
};