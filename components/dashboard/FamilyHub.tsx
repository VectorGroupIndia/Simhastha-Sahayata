import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { MOCK_FAMILY_MEMBERS } from '../../data/mockData';
import { useLocalization } from '../../hooks/useLocalization';
import { Modal } from '../ui/Modal';

// SVG Icon Components defined locally for simplicity
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" /></svg>;
const AlertIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" /></svg>;
const LostIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>;

/**
 * Family Hub Component - The "killer feature".
 * This component provides a UI for tracking family members on a map,
 * managing safe zones, and triggering SOS alerts. This is a crucial safety tool.
 * The map and locations are simulated for this demonstration.
 */
const FamilyHub: React.FC = () => {
    const { translations } = useLocalization();
    const [isSosModalOpen, setIsSosModalOpen] = useState(false);
    const [isSosActive, setIsSosActive] = useState(false);

    const handleSOS = () => {
        setIsSosModalOpen(true);
    };

    const confirmSOS = () => {
        setIsSosActive(true);
        setIsSosModalOpen(false);
        // In a real app, this would trigger a backend call
        console.log("SOS Confirmed! Alerting network.");
    };


    const getStatusIcon = (status: 'Safe' | 'Alert' | 'Lost') => {
        switch (status) {
            case 'Alert': return <AlertIcon />;
            case 'Lost': return <LostIcon />;
            default: return null;
        }
    };

    return (
        <>
            <Card>
                <h3 className="text-2xl font-bold mb-4">{translations.familyHub.title}</h3>
                {isSosActive && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                        <p className="font-bold">{translations.familyHub.sosActive}</p>
                        <p>{translations.familyHub.sosActiveText}</p>
                    </div>
                )}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Family Member List */}
                    <div className="lg:col-span-1 space-y-3">
                        <h4 className="font-semibold text-lg">{translations.familyHub.members}</h4>
                        {MOCK_FAMILY_MEMBERS.map(member => (
                            <div key={member.id} className="flex items-center bg-gray-50 p-3 rounded-lg">
                                <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full mr-3" />
                                <div className="flex-grow">
                                    <p className="font-medium text-gray-800">{member.name}</p>
                                    <p className={`text-sm ${member.status === 'Safe' ? 'text-green-600' : member.status === 'Alert' ? 'text-yellow-600' : 'text-red-600'}`}>
                                        {translations.familyHub.status[member.status.toLowerCase() as keyof typeof translations.familyHub.status]}
                                    </p>
                                </div>
                                {getStatusIcon(member.status)}
                            </div>
                        ))}
                        <Button variant="secondary" className="w-full mt-4">{translations.familyHub.addGroup}</Button>
                    </div>

                    {/* Simulated Map View */}
                    <div className="lg:col-span-2 relative">
                        <h4 className="font-semibold text-lg mb-2">{translations.familyHub.liveLocation}</h4>
                        <div className="aspect-video bg-gray-200 rounded-lg relative overflow-hidden">
                            <img src="https://i.imgur.com/3Z3tV8C.png" alt="Map of Kumbh Mela area" className="w-full h-full object-cover" />
                            {/* Simulated location pins */}
                            {MOCK_FAMILY_MEMBERS.map((member, index) => (
                                <div key={member.id} className="absolute" style={{ top: `${member.location.lat}%`, left: `${member.location.lng}%`, transform: 'translate(-50%, -100%)' }}>
                                    <div className="relative flex flex-col items-center">
                                        <img src={member.avatar} alt={member.name} className={`w-8 h-8 rounded-full border-2 ${member.status === 'Lost' ? 'border-red-500 animate-pulse' : 'border-white'}`} />
                                        <div className="bg-white text-xs px-1.5 py-0.5 rounded-full shadow -mt-1">{member.name.split(' ')[0]}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button 
                            onClick={handleSOS} 
                            variant="danger" 
                            className={`w-full mt-4 text-lg ${isSosActive ? 'animate-pulse' : ''}`}
                            disabled={isSosActive}
                        >
                            <div className="flex items-center justify-center">
                                <LostIcon />
                                <span className="ml-2">{isSosActive ? translations.familyHub.sosActive : translations.familyHub.sosButton}</span>
                            </div>
                        </Button>
                    </div>
                </div>
            </Card>
            <Modal
                isOpen={isSosModalOpen}
                onClose={() => setIsSosModalOpen(false)}
                title={translations.familyHub.sosConfirmTitle}
            >
                <div className="text-center">
                    <p className="text-gray-600 mb-6">{translations.familyHub.sosConfirmText}</p>
                    <div className="flex justify-center gap-4">
                        <Button variant="secondary" onClick={() => setIsSosModalOpen(false)}>
                            {translations.familyHub.sosCancelButton}
                        </Button>
                        <Button variant="danger" onClick={confirmSOS}>
                            {translations.familyHub.sosConfirmButton}
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default FamilyHub;