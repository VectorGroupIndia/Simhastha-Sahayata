import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLocalization } from '../hooks/useLocalization';
import { Card } from '../components/ui/Card';
import { ToggleSwitch } from '../components/ui/ToggleSwitch';
import { User, UserRole } from '../types';

// --- ICONS ---
const BellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;
const ShieldExclamationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
const CogIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924-1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066 2.573c-.94-1.543.826 3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const WrenchScrewdriverIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.023 2.033a1 1 0 01.954 0l6 3a1 1 0 01.023 1.732l-6 11a1 1 0 01-1.732-.954l6-11a1 1 0 01.755-.778zM11 5v.01M13 19.967a1 1 0 01-.954 0l-6-3a1 1 0 01-.023-1.732l6-11a1 1 0 011.732.954l-6 11a1 1 0 01-.755.778zM13 19v-.01" /></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L10 17l-4 4 4-4 2.293-2.293a1 1 0 011.414 0L17 14m-5-5l2.293 2.293a1 1 0 010 1.414L10 17" /></svg>;

const SettingRow: React.FC<{ id: string; label: string; description: string; checked: boolean; onToggle: (checked: boolean) => void; icon: React.ReactNode; }> = ({ id, label, description, checked, onToggle, icon }) => (
    <div className="flex items-start gap-4 p-4 first:pt-0 last:pb-0">
        <div className="flex-shrink-0 text-orange-500 mt-1">{icon}</div>
        <div className="flex-grow">
            <label htmlFor={id} className="font-medium text-gray-800 dark:text-gray-200">{label}</label>
            <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
        <div className="flex-shrink-0">
            <ToggleSwitch id={id} checked={checked} onChange={onToggle} />
        </div>
    </div>
);

const SettingsPage: React.FC = () => {
  const { user, isAuthenticated, updateUser } = useAuth();
  const { translations } = useLocalization();
  const t = translations.profile.adminSettings;

  if (!isAuthenticated || !user || user.role !== UserRole.ADMIN) {
    return <Navigate to="/dashboard" />;
  }

  const handleAdminNotificationToggle = (key: keyof NonNullable<User['settings']['adminNotifications']>, value: boolean) => {
    const baseSettings = user.settings || {
        notifications: false, powerButtonSos: false, voiceNav: false,
    };
    updateUser({
        settings: { ...baseSettings, adminNotifications: { ...baseSettings.adminNotifications, [key]: value } }
    });
  };

  const handleSystemSettingToggle = (key: keyof NonNullable<User['settings']['systemSettings']>, value: boolean) => {
    const baseSettings = user.settings || {
        notifications: false, powerButtonSos: false, voiceNav: false,
    };
    updateUser({
        settings: { ...baseSettings, systemSettings: { ...baseSettings.systemSettings, [key]: value } }
    });
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t.title}</h1>

            <Card>
                <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{t.notificationSettingsAdmin}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t.notificationSettingsAdminDesc}</p>
                <div className="divide-y divide-gray-200 dark:divide-gray-700 -m-6">
                    <SettingRow id="high-priority" label={t.highPriority} description={t.highPriorityDesc} checked={user.settings?.adminNotifications?.highPriority ?? true} onToggle={(c) => handleAdminNotificationToggle('highPriority', c)} icon={<ShieldExclamationIcon />} />
                    <SettingRow id="sos-alerts" label={t.sosAlerts} description={t.sosAlertsDesc} checked={user.settings?.adminNotifications?.sosAlerts ?? true} onToggle={(c) => handleAdminNotificationToggle('sosAlerts', c)} icon={<BellIcon />} />
                    <SettingRow id="system-health" label={t.systemHealth} description={t.systemHealthDesc} checked={user.settings?.adminNotifications?.systemHealth ?? false} onToggle={(c) => handleAdminNotificationToggle('systemHealth', c)} icon={<CogIcon />} />
                </div>
            </Card>

            <Card>
                <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{t.systemConfig}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t.systemConfigDesc}</p>
                <div className="divide-y divide-gray-200 dark:divide-gray-700 -m-6">
                    <SettingRow id="ai-autofill" label={t.aiAutofill} description={t.aiAutofillDesc} checked={user.settings?.systemSettings?.aiAutofill ?? true} onToggle={(c) => handleSystemSettingToggle('aiAutofill', c)} icon={<SparklesIcon />} />
                    <SettingRow id="ai-image-analysis" label={t.aiImageAnalysis} description={t.aiImageAnalysisDesc} checked={user.settings?.systemSettings?.aiImageAnalysis ?? true} onToggle={(c) => handleSystemSettingToggle('aiImageAnalysis', c)} icon={<SparklesIcon />} />
                    <SettingRow id="maintenance-mode" label={t.maintenanceMode} description={t.maintenanceModeDesc} checked={user.settings?.systemSettings?.maintenanceMode ?? false} onToggle={(c) => handleSystemSettingToggle('maintenanceMode', c)} icon={<WrenchScrewdriverIcon />} />
                </div>
            </Card>
        </div>
    </div>
  );
};

export default SettingsPage;