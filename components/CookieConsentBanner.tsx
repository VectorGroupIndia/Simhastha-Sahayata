import React from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { Button } from './ui/Button';

interface CookieConsentBannerProps {
  onAccept: () => void;
  onReject: () => void;
  onModify: () => void;
}

/**
 * A banner displayed at the bottom of the screen to get user consent for cookies.
 */
const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({ onAccept, onReject, onModify }) => {
  const { translations } = useLocalization();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 shadow-lg z-50 animate-fade-in-up">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-center md:text-left flex-grow">
          {translations.cookieBanner.message}
        </p>
        <div className="flex-shrink-0 flex gap-2">
          <Button onClick={onAccept} variant="primary" className="px-4 py-1 text-sm">{translations.cookieBanner.accept}</Button>
          <Button onClick={onReject} variant="danger" className="px-4 py-1 text-sm">{translations.cookieBanner.reject}</Button>
          <Button onClick={onModify} variant="secondary" className="px-4 py-1 text-sm">{translations.cookieBanner.modify}</Button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;