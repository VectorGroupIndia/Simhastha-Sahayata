import React from 'react';
import { Modal } from '../ui/Modal';
import { useLocalization } from '../../hooks/useLocalization';
import { SosAlert } from '../../types';

interface SosDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  alert: SosAlert | null;
}

const LocationPinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500 drop-shadow-lg" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 20l-4.95-5.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
    </svg>
);

export const SosDetailsModal: React.FC<SosDetailsModalProps> = ({ isOpen, onClose, alert }) => {
    const { translations } = useLocalization();
    const t = translations.sosDetailsModal;

    if (!alert) return null;

    const getStatusClasses = (status: SosAlert['status']) => {
        switch (status) {
            case 'Broadcasted': return 'bg-yellow-200 text-yellow-800';
            case 'Responded': return 'bg-blue-200 text-blue-800';
            case 'Resolved': return 'bg-green-200 text-green-800';
            default: return 'bg-gray-200 text-gray-800';
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t.title}>
            <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm text-gray-500">{t.alertId}</p>
                            <p className="font-mono text-gray-800">{alert.id}</p>
                        </div>
                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusClasses(alert.status)}`}>
                            {alert.status}
                        </span>
                    </div>
                     <div>
                        <p className="text-sm text-gray-500">{t.triggeredBy}</p>
                        <p className="font-semibold text-gray-800">{alert.userName}</p>
                    </div>
                     <div>
                        <p className="text-sm text-gray-500">{t.timestamp}</p>
                        <p className="text-gray-800">{new Date(alert.timestamp).toLocaleString()}</p>
                    </div>
                    {alert.message && (
                        <div>
                            <p className="text-sm text-gray-500">{t.message}</p>
                            <p className="text-gray-800 italic bg-orange-50 p-2 rounded">"{alert.message}"</p>
                        </div>
                    )}
                </div>

                <div>
                    <h4 className="font-semibold mb-2">{t.location}</h4>
                    <div className="aspect-video bg-gray-200 rounded-lg relative overflow-hidden">
                         <img src="https://i.imgur.com/3Z3tV8C.png" alt="Map of Kumbh Mela area" className="w-full h-full object-cover"/>
                         {alert.locationCoords ? (
                            <div className="absolute" style={{ top: `${alert.locationCoords.lat}%`, left: `${alert.locationCoords.lng}%`, transform: 'translate(-50%, -100%)' }}>
                                <div className="relative flex flex-col items-center">
                                <LocationPinIcon />
                                <div className="bg-white text-sm px-2 py-1 rounded-full shadow-lg mt-1 whitespace-nowrap">{alert.userName}</div>
                                </div>
                            </div>
                        ) : (
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                <p className="text-white bg-red-500 p-3 rounded-lg">Location coordinates not available.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
};