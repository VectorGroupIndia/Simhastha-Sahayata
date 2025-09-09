

import React from 'react';
import { Modal } from '../ui/Modal';
import { useLocalization } from '../../hooks/useLocalization';
import { FamilyMember } from '../../types';
import IntelligentNav from './IntelligentNav';

interface NavigateToMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: FamilyMember | null;
}

export const NavigateToMemberModal: React.FC<NavigateToMemberModalProps> = ({ isOpen, onClose, member }) => {
    const { translations } = useLocalization();
    
    if (!member) {
        return null;
    }

    const title = translations.navigation.routeTo.replace('{name}', member.name);
    
    // Adapt the FamilyMember object to the generic Navigatable type for IntelligentNav
    const destination = {
        name: member.name,
        locationCoords: {
            lat: member.location.lat,
            lng: member.location.lng,
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            {/* The IntelligentNav component is re-used here to show the route */}
            <IntelligentNav destination={destination} />
        </Modal>
    );
};