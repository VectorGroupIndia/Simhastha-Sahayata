/*********************************************************************************
 * Author: Sujit Babar
 * Company: Transfigure Technologies Pvt. Ltd.
 *
 * Copyright Note: All rights reserved.
 * The code, design, process, logic, thinking, and overall layout structure
 * of this application are the intellectual property of Transfigure Technologies Pvt. Ltd.
 * This notice is for informational purposes only and does not grant any rights
 * to copy, modify, or distribute this code without explicit written permission.
 * This code is provided as-is and is intended for read-only inspection. It cannot be edited.
 *********************************************************************************/
import React, { createContext, useState, ReactNode, useMemo, useCallback } from 'react';
import { translations as appTranslations } from '../data/mockData';

// This file defines the context for global app settings like language.
// Using context allows any component in the app to access and modify these settings
// without passing props down through many levels (prop drilling).

interface AppContextType {
  language: string;
  setLanguage: (language: string) => void;
  translations: any; // In a real app, this would be strongly typed
  isSosActive: boolean;
  setSosStatus: (isActive: boolean) => void;
  sosConfirmed: boolean;
  setSosConfirmed: (isConfirmed: boolean) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [isSosActive, setIsSosActive] = useState(false);
  const [sosConfirmed, setSosConfirmed] = useState(false);

  // useMemo ensures that the translations object is only recalculated when the language changes.
  const translations = useMemo(() => appTranslations[language] || appTranslations.en, [language]);

  const setSosStatus = useCallback((isActive: boolean) => {
    setIsSosActive(isActive);
  }, []);

  const value = {
    language,
    setLanguage,
    translations,
    isSosActive,
    setSosStatus,
    sosConfirmed,
    setSosConfirmed,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};