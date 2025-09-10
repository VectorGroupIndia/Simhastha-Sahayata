import React, { useState, useRef } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useToast } from '../hooks/useToast';
import { useLocalization } from '../hooks/useLocalization';
import { MOCK_POINTS_OF_INTEREST } from '../data/mockData';
import { MapPointOfInterest } from '../types';

// Icons for different center types
const MedicalIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11v4m-2-2h4" /></svg>;
const HelpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const LostFoundIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6.364-6.364l-1.414-1.414a2 2 0 010-2.828l1.414-1.414a2 2 0 012.828 0l1.414 1.414a2 2 0 010 2.828l-1.414 1.414a2 2 0 01-2.828 0zm12.728 0l-1.414-1.414a2 2 0 00-2.828 0l-1.414 1.414a2 2 0 000 2.828l1.414 1.414a2 2 0 002.828 0l1.414-1.414a2 2 0 000-2.828z" /></svg>;
const PoliceIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;

const Pin: React.FC<{ point: MapPointOfInterest; isSelected: boolean; onSelect: () => void }> = ({ point, isSelected, onSelect }) => {
    const pinColors: Record<MapPointOfInterest['type'], string> = {
        'Medical': 'green',
        'Help Center': 'blue',
        'Lost/Found Center': 'yellow',
        'Police Station': 'red',
    };
    const color = pinColors[point.type] || 'gray';

    return (
        <div
            className="absolute cursor-pointer"
            style={{
                top: `${point.locationCoords.lat}%`,
                left: `${point.locationCoords.lng}%`,
                transform: 'translate(-50%, -100%)',
                zIndex: isSelected ? 10 : 1
            }}
            onClick={onSelect}
            aria-label={`Map pin for ${point.name}`}
        >
            <div className="relative flex flex-col items-center group">
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 text-${color}-500 drop-shadow-lg transition-transform group-hover:scale-110 ${isSelected ? 'scale-125' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 20l-4.95-5.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {isSelected && (
                    <div className="bg-white text-xs px-2 py-1 rounded-full shadow-lg -mt-1 whitespace-nowrap animate-fade-in-up font-bold">
                        {point.name}
                    </div>
                )}
            </div>
        </div>
    );
};


const ContactUsPage: React.FC = () => {
    const { addToast } = useToast();
    const { translations } = useLocalization();
    const t = translations.contact || {};

    const [selectedCenter, setSelectedCenter] = useState<MapPointOfInterest | null>(null);
    const centerRefs = useRef<Record<string, HTMLDivElement | null>>({});

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        addToast(t.messageSent, 'success');
        e.currentTarget.reset();
    };

    const handleSelectCenter = (center: MapPointOfInterest) => {
        setSelectedCenter(center);
        centerRefs.current[center.id]?.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
        });
    };
    
    const operationalCenters = MOCK_POINTS_OF_INTEREST;
    const groupedCenters = operationalCenters.reduce((acc, center) => {
        (acc[center.type] = acc[center.type] || []).push(center);
        return acc;
    }, {} as Record<MapPointOfInterest['type'], MapPointOfInterest[]>);

    const groupOrder: MapPointOfInterest['type'][] = ['Police Station', 'Medical', 'Help Center', 'Lost/Found Center'];

    const iconMap: Record<MapPointOfInterest['type'], React.ReactNode> = {
        'Police Station': <PoliceIcon />,
        'Medical': <MedicalIcon />,
        'Help Center': <HelpIcon />,
        'Lost/Found Center': <LostFoundIcon />,
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-orange-600 mb-4">{t.title}</h1>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                    We're here to help. Whether you have a question, need support, or want to locate a help center, find the resources you need below.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Left Column: Contact Info & Form */}
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <h2 className="text-2xl font-bold border-b pb-2 mb-4">{t.getInTouch}</h2>
                        <div className="space-y-3 text-gray-700">
                            <p><strong>{t.email}:</strong> <a href="mailto:support@simhasthasahayata.com" className="text-orange-600 hover:underline">support@simhasthasahayata.com</a></p>
                            <p><strong>{t.helpline}:</strong> <a href="tel:1800-XXX-XXXX" className="text-orange-600 hover:underline">1800-XXX-XXXX</a></p>
                            <p><strong>{t.address}:</strong><br />Simhastha Sahayata Operations Center, Near Ram Ghat, Ujjain, MP</p>
                        </div>
                    </Card>
                    <Card>
                        <h2 className="text-2xl font-bold border-b pb-2 mb-4">{t.sendMessage}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">{t.nameLabel}</label>
                                <input type="text" id="name" name="name" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">{t.emailLabel}</label>
                                <input type="email" id="email" name="email" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500" />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700">{t.messageLabel}</label>
                                <textarea id="message" name="message" rows={4} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"></textarea>
                            </div>
                            <Button type="submit" className="w-full">{t.sendButton}</Button>
                        </form>
                    </Card>
                </div>

                {/* Right Column: Map and Centers */}
                <div className="lg:col-span-3">
                    <Card>
                        <h2 className="text-2xl font-bold mb-4">Operational Centers Map</h2>
                        <div className="aspect-video bg-gray-200 rounded-lg relative overflow-hidden mb-6 shadow-inner">
                            <img src="https://i.imgur.com/3Z3tV8C.png" alt="Map of Kumbh Mela area" className="w-full h-full object-cover" />
                            {operationalCenters.map(point => (
                                <Pin key={point.id} point={point} isSelected={selectedCenter?.id === point.id} onSelect={() => handleSelectCenter(point)} />
                            ))}
                        </div>

                        <div className="max-h-[40vh] overflow-y-auto pr-2 space-y-4">
                            {groupOrder.map(groupName => (
                                <div key={groupName}>
                                    <h3 className="text-xl font-semibold mb-2 flex items-center">{iconMap[groupName]} <span className="ml-2">{groupName}s</span></h3>
                                    <div className="space-y-2">
                                        {(groupedCenters[groupName] || []).map(center => (
                                            <div
                                                key={center.id}
                                                ref={el => { if (el) centerRefs.current[center.id] = el; }}
                                                onClick={() => handleSelectCenter(center)}
                                                className={`p-3 rounded-lg cursor-pointer transition-all border ${selectedCenter?.id === center.id ? 'bg-orange-100 border-orange-400 ring-2 ring-orange-300' : 'bg-gray-50 hover:bg-gray-100 border-gray-200'}`}
                                                role="button"
                                                tabIndex={0}
                                                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleSelectCenter(center)}
                                                aria-pressed={selectedCenter?.id === center.id}
                                            >
                                                <p className="font-medium text-gray-800">{center.name}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ContactUsPage;