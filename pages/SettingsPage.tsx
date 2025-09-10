import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLocalization } from '../hooks/useLocalization';
import { Card } from '../components/ui/Card';
import { ToggleSwitch } from '../components/ui/ToggleSwitch';
import { User, UserRole } from '../types';
import { Button } from '../components/ui/Button';
import { useToast } from '../hooks/useToast';
import { MOCK_OPERATIONAL_ZONES } from '../data/mockData';

// --- ICONS ---
const BellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;
const ShieldExclamationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
const MoonIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>;
const LocationMarkerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const CameraIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const MicIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>;
const CogIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924-1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066 2.573c-.94-1.543.826 3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const WrenchScrewdriverIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.023 2.033a1 1 0 01.954 0l6 3a1 1 0 01.023 1.732l-6 11a1 1 0 01-1.732-.954l6-11a1 1 0 01.755-.778zM11 5v.01M13 19.967a1 1 0 01-.954 0l-6-3a1 1 0 01-.023-1.732l6-11a1 1 0 011.732.954l-6 11a1 1 0 01-.755.778zM13 19v-.01" /></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L10 17l-4 4 4-4 2.293-2.293a1 1 0 011.414 0L17 14m-5-5l2.293 2.293a1 1 0 010 1.414L10 17" /></svg>;


// --- Shared Components ---
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

// --- Role-Specific Settings Components ---

const AdminSettings: React.FC<{ user: User }> = ({ user }) => {
    const { updateUser } = useAuth();
    const { translations } = useLocalization();
    const t = translations.profile;
    const adminT = t.adminSettings;
    
    const handleAdminNotificationToggle = (key: keyof NonNullable<User['settings']['adminNotifications']>, value: boolean) => {
        const baseSettings = user.settings || { notifications: false, powerButtonSos: false, voiceNav: false, };
        updateUser({ settings: { ...baseSettings, adminNotifications: { ...baseSettings.adminNotifications, [key]: value } } });
    };

    const handleSystemSettingToggle = (key: keyof NonNullable<User['settings']['systemSettings']>, value: boolean) => {
        const baseSettings = user.settings || { notifications: false, powerButtonSos: false, voiceNav: false, };
        updateUser({ settings: { ...baseSettings, systemSettings: { ...baseSettings.systemSettings, [key]: value } } });
    };

    return (
        <div className="space-y-6">
            <Card>
                <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{adminT.title}</h2>
                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">{adminT.notificationSettingsAdmin}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{adminT.notificationSettingsAdminDesc}</p>
                        <div className="divide-y divide-gray-200 dark:divide-gray-700 -m-4">
                            <SettingRow id="high-priority" label={adminT.highPriority} description={adminT.highPriorityDesc} checked={user.settings?.adminNotifications?.highPriority ?? true} onToggle={(c) => handleAdminNotificationToggle('highPriority', c)} icon={<ShieldExclamationIcon />} />
                            <SettingRow id="sos-alerts" label={adminT.sosAlerts} description={adminT.sosAlertsDesc} checked={user.settings?.adminNotifications?.sosAlerts ?? true} onToggle={(c) => handleAdminNotificationToggle('sosAlerts', c)} icon={<BellIcon />} />
                            <SettingRow id="system-health" label={adminT.systemHealth} description={adminT.systemHealthDesc} checked={user.settings?.adminNotifications?.systemHealth ?? false} onToggle={(c) => handleAdminNotificationToggle('systemHealth', c)} icon={<CogIcon />} />
                        </div>
                    </div>
                     <div>
                        <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200 pt-4">{adminT.systemConfig}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{adminT.systemConfigDesc}</p>
                        <div className="divide-y divide-gray-200 dark:divide-gray-700 -m-4">
                            <SettingRow id="ai-autofill" label={adminT.aiAutofill} description={adminT.aiAutofillDesc} checked={user.settings?.systemSettings?.aiAutofill ?? true} onToggle={(c) => handleSystemSettingToggle('aiAutofill', c)} icon={<SparklesIcon />} />
                            <SettingRow id="ai-image-analysis" label={adminT.aiImageAnalysis} description={adminT.aiImageAnalysisDesc} checked={user.settings?.systemSettings?.aiImageAnalysis ?? true} onToggle={(c) => handleSystemSettingToggle('aiImageAnalysis', c)} icon={<SparklesIcon />} />
                            <SettingRow id="maintenance-mode" label={adminT.maintenanceMode} description={adminT.maintenanceModeDesc} checked={user.settings?.systemSettings?.maintenanceMode ?? false} onToggle={(c) => handleSystemSettingToggle('maintenanceMode', c)} icon={<WrenchScrewdriverIcon />} />
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

const AuthoritySettings: React.FC<{ user: User }> = ({ user }) => {
    const { updateUser } = useAuth();
    const { translations } = useLocalization();
    const t = translations.profile;
    const authT = t.authority || {};
    
    const handleSettingToggle = (key: keyof NonNullable<User['settings']>, value: boolean) => {
        const baseSettings = user.settings || { notifications: false, powerButtonSos: false, voiceNav: false };
        updateUser({ settings: { ...(baseSettings), [key]: value } });
    };
    
    const handleSettingChange = (key: keyof NonNullable<User['settings']> | 'assignedZone', value: any) => {
        if(key === 'assignedZone') {
            updateUser({ assignedZone: value });
        } else {
            const baseSettings = user.settings || { notifications: false, powerButtonSos: false, voiceNav: false };
            updateUser({ settings: { ...baseSettings, [key]: value } });
        }
    }
    
    return (
        <Card>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{authT.settingsTitle}</h2>
            <div className="divide-y divide-gray-200 dark:divide-gray-700 -m-6">
                <div className="p-4 flex justify-between items-center">
                    <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200">{authT.operationalZone}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{authT.operationalZoneDesc}</p>
                    </div>
                    <select value={user.assignedZone || ''} onChange={e => handleSettingChange('assignedZone', e.target.value)} className="rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500">
                        <option value="">Select Zone</option>
                        {MOCK_OPERATIONAL_ZONES.map(z=><option key={z.id} value={z.name}>{z.name}</option>)}
                    </select>
                </div>
                <div className="p-4 flex justify-between items-center">
                    <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200">{authT.alertThreshold}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{authT.alertThresholdDesc}</p>
                    </div>
                    <select value={user.settings?.alertPriorityThreshold || 'All'} onChange={e => handleSettingChange('alertPriorityThreshold', e.target.value)} className="rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500">
                       <option value="All">All Priorities</option>
                       <option value="High">High & Critical Only</option>
                       <option value="Critical">Critical Only</option>
                    </select>
                </div>
                <SettingRow id="sos-zone-alerts" label={authT.sosZoneAlerts} description={authT.sosZoneAlertsDesc} checked={user.settings?.sosZoneAlerts ?? true} onToggle={(c) => handleSettingToggle('sosZoneAlerts', c)} icon={<ShieldExclamationIcon />} />
                <SettingRow id="patrol-mode" label={authT.patrolMode} description={authT.patrolModeDesc} checked={user.settings?.patrolMode ?? false} onToggle={(c) => handleSettingToggle('patrolMode', c)} icon={<MoonIcon />} />
            </div>
        </Card>
    );
};

const VolunteerSettings: React.FC<{ user: User }> = ({ user }) => {
    const { updateUser } = useAuth();
    const { translations } = useLocalization();
    const t = translations.profile;
    const volT = t.volunteer || {};
    
    const handleSettingToggle = (key: keyof NonNullable<User['settings']>, value: boolean) => {
        const baseSettings = user.settings || { notifications: false, powerButtonSos: false, voiceNav: false, };
        updateUser({ settings: { ...baseSettings, [key]: value } });
    };
    
    const handleAvailabilityChange = (status: 'Active' | 'On Break') => {
        const baseSettings = user.settings || { notifications: false, powerButtonSos: false, voiceNav: false, };
        updateUser({ settings: { ...baseSettings, availabilityStatus: status } });
    };
    
    const handleRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const radius = parseInt(e.target.value, 10);
        const baseSettings = user.settings || { notifications: false, powerButtonSos: false, voiceNav: false, };
        updateUser({ settings: { ...baseSettings, workingRadius: radius } });
    };

    return (
        <Card>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{volT.settingsTitle}</h2>
            <div className="divide-y divide-gray-200 dark:divide-gray-700 -m-6">
                <div className="p-4 flex justify-between items-center">
                    <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200">{volT.availability}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{volT.availabilityDesc}</p>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                        <Button variant={user.settings?.availabilityStatus === 'Active' ? 'primary' : 'secondary'} onClick={() => handleAvailabilityChange('Active')} className="text-sm py-1 px-3">{volT.active}</Button>
                        <Button variant={user.settings?.availabilityStatus === 'On Break' ? 'primary' : 'secondary'} onClick={() => handleAvailabilityChange('On Break')} className="text-sm py-1 px-3">{volT.onBreak}</Button>
                    </div>
                </div>
                <div className="p-4 flex items-start gap-4">
                    <div className="flex-shrink-0 text-orange-500 mt-1"><LocationMarkerIcon /></div>
                    <div className="flex-grow">
                        <div className="flex justify-between items-center mb-1">
                            <p className="font-medium text-gray-800 dark:text-gray-200">{volT.workingRadius}</p>
                            <div className="font-bold text-lg text-orange-600">
                                {user.settings?.workingRadius ?? 1} {volT.km}
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{volT.workingRadiusDesc}</p>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            step="1"
                            value={user.settings?.workingRadius ?? 1}
                            onChange={handleRadiusChange}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-orange-500"
                            aria-label="Working radius slider"
                        />
                    </div>
                </div>
                <SettingRow id="assignment-notifications" label={volT.assignmentNotifications} description={volT.assignmentNotificationsDesc} checked={user.settings?.notifications ?? true} onToggle={(c) => handleSettingToggle('notifications', c)} icon={<BellIcon />} />
                <SettingRow id="nearby-alerts" label={volT.nearbyAlerts} description={volT.nearbyAlertsDesc} checked={user.settings?.nearbyAlertsNotifications ?? true} onToggle={(c) => handleSettingToggle('nearbyAlertsNotifications', c)} icon={<ShieldExclamationIcon />} />
            </div>
        </Card>
    );
};

const PilgrimSettings: React.FC<{ user: User }> = ({ user }) => {
    const { updateUser } = useAuth();
    const { addToast } = useToast();
    const { translations } = useLocalization();
    const t = translations.profile;

    const handleSettingsUpdate = (update: Partial<User['settings']>) => {
        const newSettings = { ...user.settings, ...update };
        updateUser({ settings: newSettings });
    };

    const handleToggle = (key: 'notifications' | 'powerButtonSos' | 'voiceNav', enabled: boolean) => {
        handleSettingsUpdate({ [key]: enabled });
        addToast(`${key} setting updated.`, 'info');
    };

    const handlePermissionToggle = (key: 'locationAccess' | 'cameraAccess' | 'microphoneAccess', enabled: boolean) => {
        handleSettingsUpdate({ [key]: enabled });
        addToast(`${key.replace('Access','')} access setting updated.`, 'info');
    };

    return (
        <div className="space-y-6">
             <Card>
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{t.settings}</h2>
                <div className="divide-y divide-gray-200 dark:divide-gray-700 -m-6">
                    <SettingRow id="power-sos" label={t.powerButtonSos} description={t.powerButtonSosDesc} checked={user.settings?.powerButtonSos ?? false} onToggle={c => handleToggle('powerButtonSos', c)} icon={<ShieldExclamationIcon />} />
                    <SettingRow id="voice-nav" label={t.voiceNav} description={t.voiceNavDesc} checked={user.settings?.voiceNav ?? false} onToggle={c => handleToggle('voiceNav', c)} icon={<MicIcon />} />
                    <SettingRow id="push-notifications" label={t.pushNotifications} description={t.pushNotificationsDesc} checked={user.settings?.notifications ?? false} onToggle={c => handleToggle('notifications', c)} icon={<BellIcon />} />
                </div>
            </Card>
            <Card>
                <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{t.permissions}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t.permissionsDesc}</p>
                <div className="divide-y divide-gray-200 dark:divide-gray-700 -m-6">
                    <SettingRow id="location-access" label={t.location} description={t.locationDesc} checked={user.settings?.locationAccess ?? false} onToggle={c => handlePermissionToggle('locationAccess', c)} icon={<LocationMarkerIcon />} />
                    <SettingRow id="camera-access" label={t.camera} description={t.cameraDesc} checked={user.settings?.cameraAccess ?? false} onToggle={c => handlePermissionToggle('cameraAccess', c)} icon={<CameraIcon />} />
                    <SettingRow id="mic-access" label={t.microphone} description={t.microphoneDesc} checked={user.settings?.microphoneAccess ?? false} onToggle={c => handlePermissionToggle('microphoneAccess', c)} icon={<MicIcon />} />
                </div>
            </Card>
        </div>
    );
};

const GeneralSettings: React.FC<{user: User}> = ({ user }) => {
    const { updateUser } = useAuth();
    const { translations } = useLocalization();
    const t = translations.profile;
    
    useEffect(() => {
        if (user.settings?.theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [user.settings?.theme]);
    
    const handleThemeChange = (newTheme: 'light' | 'dark') => {
        const baseSettings = user.settings || { notifications: false, powerButtonSos: false, voiceNav: false };
        updateUser({ settings: { ...baseSettings, theme: newTheme } });
    };

    return (
        <Card>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{t.dashboardSettings}</h2>
             <div className="flex justify-between items-center">
                <div>
                    <p className="font-medium text-gray-800 dark:text-gray-200">{t.theme}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t.themeDesc}</p>
                </div>
                <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                    <Button variant={user.settings?.theme === 'light' ? 'primary' : 'secondary'} onClick={() => handleThemeChange('light')} className="text-sm py-1 px-3">{t.light}</Button>
                    <Button variant={user.settings?.theme === 'dark' ? 'primary' : 'secondary'} onClick={() => handleThemeChange('dark')} className="text-sm py-1 px-3">{t.dark}</Button>
                </div>
             </div>
        </Card>
    );
};


const SettingsPage: React.FC = () => {
    const { user, isAuthenticated } = useAuth();
    const { translations } = useLocalization();

    if (!isAuthenticated || !user) {
        return <Navigate to="/" />;
    }
  
    const renderSettings = () => {
        switch(user.role) {
            case UserRole.ADMIN: return <AdminSettings user={user} />;
            case UserRole.VOLUNTEER: return <VolunteerSettings user={user} />;
            case UserRole.AUTHORITY: return <AuthoritySettings user={user} />;
            case UserRole.PILGRIM: default: return <PilgrimSettings user={user} />;
        }
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="max-w-3xl mx-auto space-y-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{translations.header.settings}</h1>
                <GeneralSettings user={user} />
                {renderSettings()}
            </div>
        </div>
    );
};

export default SettingsPage;