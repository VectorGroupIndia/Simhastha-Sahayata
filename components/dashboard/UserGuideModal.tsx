import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useLocalization } from '../../hooks/useLocalization';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Icons for the guide
const HeartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>;
const MapIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13v-6m0 6l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m0 10v-6m0 6l-6-3" /></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L10 17l-4 4 4-4 2.293-2.293a1 1 0 011.414 0L17 14m-5-5l2.293 2.293a1 1 0 010 1.414L10 17" /></svg>;
const ArchiveIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 001.414 0l2.414-2.414a1 1 0 01.707-.293H21" /></svg>;

const GuideItem: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="flex items-start gap-4">
        <div className="flex-shrink-0 mt-1">{icon}</div>
        <div>
            <h4 className="font-bold text-lg text-gray-800">{title}</h4>
            <p className="text-gray-600">{description}</p>
        </div>
    </div>
);

export const UserGuideModal: React.FC<UserGuideModalProps> = ({ isOpen, onClose }) => {
    const { translations } = useLocalization();
    const t = translations.userGuide;
    
    const guideItems = [
        { icon: <HeartIcon />, title: t.familyHub.title, description: t.familyHub.description },
        { icon: <MapIcon />, title: t.navigation.title, description: t.navigation.description },
        { icon: <ArchiveIcon />, title: t.reporting.title, description: t.reporting.description },
        { icon: <SparklesIcon />, title: t.guide.title, description: t.guide.description },
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t.title}>
            <div className="space-y-6">
                <p className="text-center text-gray-600">{t.intro}</p>
                <div className="space-y-5">
                    {guideItems.map(item => <GuideItem key={item.title} {...item} />)}
                </div>
                <div className="text-center pt-4">
                    <Button onClick={onClose}>{t.close}</Button>
                </div>
            </div>
        </Modal>
    );
};