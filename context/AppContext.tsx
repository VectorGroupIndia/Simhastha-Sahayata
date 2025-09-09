
import React, { createContext, useState, ReactNode, useMemo } from 'react';
import { translations as appTranslations } from '../data/mockData';

// This file defines the context for global app settings like language.
// Using context allows any component in the app to access and modify these settings
// without passing props down through many levels (prop drilling).

interface AppContextType {
  language: string;
  setLanguage: (language: string) => void;
  translations: any; // In a real app, this would be strongly typed
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState('en');

  // useMemo ensures that the translations object is only recalculated when the language changes.
  const translations = useMemo(() => appTranslations[language] || appTranslations.en, [language]);

  const value = {
    language,
    setLanguage,
    translations,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
