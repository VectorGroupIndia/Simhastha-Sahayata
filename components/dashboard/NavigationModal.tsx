
import React from 'react';
import { Modal } from '../ui/Modal';
import { useLocalization } from '../../hooks/useLocalization';
import { Navigatable } from '../../types';
import IntelligentNav from './IntelligentNav';

interface NavigationModalProps {
  isOpen: boolean;
  onClose: () => void;
  destination: Navigatable | null;
}

export const NavigationModal: React.FC<NavigationModalProps> = ({ isOpen, onClose, destination }) => {
    const { translations } = useLocalization();
    
    if (!destination) {
        return null;
    }

    const title = translations.liveMap.navigationModalTitle.replace('{name}', destination.name);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <IntelligentNav destination={destination} />
        </Modal>
    );
};
