import React, { useState } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { ToggleSwitch } from './ui/ToggleSwitch';

interface CookieSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: { performance: boolean; targeting: boolean }) => void;
}

const CookiePreferenceItem: React.FC<{ title: string, description: string, id: string, checked: boolean, onChange: (checked: boolean) => void, disabled?: boolean }> = ({ title, description, id, checked, onChange, disabled }) => {
    return (
        <div className="py-4 border-b last:border-b-0">
            <div className="flex justify-between items-start">
                <h4 className="font-semibold text-gray-800">{title}</h4>
                <ToggleSwitch id={id} checked={checked} onChange={onChange} disabled={disabled} />
            </div>
            <p className="text-sm text-gray-600 mt-1 pr-16">{description}</p>
        </div>
    );
};

/**
 * A modal for users to manage their cookie preferences in detail.
 */
const CookieSettingsModal: React.FC<CookieSettingsModalProps> = ({ isOpen, onClose, onSave }) => {
  const { translations } = useLocalization();
  const [performanceEnabled, setPerformanceEnabled] = useState(true);
  const [targetingEnabled, setTargetingEnabled] = useState(true);

  const handleSave = () => {
    onSave({
      performance: performanceEnabled,
      targeting: targetingEnabled,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={translations.cookieModal.title}>
      <div className="space-y-4">
         <CookiePreferenceItem 
            id="necessary-cookies"
            title={translations.cookieModal.necessary.title}
            description={translations.cookieModal.necessary.description}
            checked={true}
            onChange={() => {}}
            disabled={true}
         />
         <CookiePreferenceItem 
            id="performance-cookies"
            title={translations.cookieModal.performance.title}
            description={translations.cookieModal.performance.description}
            checked={performanceEnabled}
            onChange={setPerformanceEnabled}
         />
         <CookiePreferenceItem 
            id="targeting-cookies"
            title={translations.cookieModal.targeting.title}
            description={translations.cookieModal.targeting.description}
            checked={targetingEnabled}
            onChange={setTargetingEnabled}
         />
      </div>
       <div className="mt-6 text-right">
            <Button onClick={handleSave}>{translations.cookieModal.save}</Button>
        </div>
    </Modal>
  );
};

export default CookieSettingsModal;