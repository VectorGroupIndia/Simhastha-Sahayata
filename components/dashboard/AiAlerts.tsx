
import React, { useState, useEffect } from 'react';
import { useLocalization } from '../../hooks/useLocalization';
import { Card } from '../ui/Card';

type AlertLevel = 'low' | 'medium' | 'high' | 'critical';

const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L10 17l-4 4 4-4 2.293-2.293a1 1 0 011.414 0L17 14m-5-5l2.293 2.293a1 1 0 010 1.414L10 17" /></svg>;
const InfoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>;
const WarningIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" /></svg>;


const AiAlerts: React.FC = () => {
  const { translations } = useLocalization();
  const t = translations.dashboard.aiAlerts;

  const MOCK_ALERTS: { id: number; text: string; level: AlertLevel }[] = [
    { id: 1, text: t.alerts.crowd, level: 'high' },
    { id: 2, text: t.alerts.item, level: 'medium' },
    { id: 3, text: t.alerts.child, level: 'critical' },
    { id: 4, text: t.alerts.weather, level: 'low' },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % MOCK_ALERTS.length);
    }, 8000); // Cycle every 8 seconds

    return () => clearInterval(interval);
  }, [MOCK_ALERTS.length]);

  const getLevelInfo = (level: AlertLevel) => {
    switch (level) {
      case 'critical':
        return {
          icon: <WarningIcon />,
          classes: 'bg-red-100 border-red-500 text-red-800',
        };
      case 'high':
        return {
          icon: <WarningIcon />,
          classes: 'bg-orange-100 border-orange-500 text-orange-800',
        };
      case 'medium':
        return {
          icon: <InfoIcon />,
          classes: 'bg-yellow-100 border-yellow-500 text-yellow-800',
        };
      case 'low':
      default:
        return {
          icon: <SparklesIcon />,
          classes: 'bg-blue-100 border-blue-500 text-blue-800',
        };
    }
  };

  const currentAlert = MOCK_ALERTS[currentIndex];
  const { icon, classes } = getLevelInfo(currentAlert.level);

  return (
    <Card className="w-full">
        <h3 className="text-lg font-bold mb-2">{t.title}</h3>
        <div className={`p-3 rounded-lg border-l-4 flex items-start transition-all duration-500 ${classes}`}>
            {icon}
            <p className="text-sm font-medium">{currentAlert.text}</p>
        </div>
    </Card>
  );
};

export default AiAlerts;
