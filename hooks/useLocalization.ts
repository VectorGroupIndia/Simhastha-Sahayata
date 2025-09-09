
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

/**
 * Custom hook for accessing localization context (language and translations).
 * This makes it very easy for any component to access the current language's
 * text strings and the function to change the language.
 */
export const useLocalization = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useLocalization must be used within an AppProvider');
  }
  return context;
};
