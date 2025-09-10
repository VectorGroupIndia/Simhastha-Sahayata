import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLocalization } from '../hooks/useLocalization';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ToggleSwitch } from '../components/ui/ToggleSwitch';
import { useToast } from '../hooks/useToast';
import { EmergencyContact, SosAlert, User, UserRole, LostFoundReport } from '../types';
import { Modal } from '../components/ui/Modal';
// FIX: DEMO_USERS is imported from `../constants` not `../data/mockData`.
import { DEMO_USERS } from '../constants';
import { MOCK_LOST_FOUND_REPORTS } from '../data/mockData';
import ReportDetailsModal from '../components/dashboard/ReportDetailsModal';
import { SosDetailsModal } from '../components/dashboard/SosDetailsModal';


// --- ICONS ---
const PencilIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 text-gray-500 hover:text-orange-500 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5l12.232-12.232z" /></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const BellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;
const ShieldExclamationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
const CogIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066 2.573c-.94-1.543.826 3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const WrenchScrewdriverIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.023 2.033a1 1 0 01.954 0l6 3a1 1 0 01.023 1.732l-6 11a1 1 0 01-1.732-.954l6-11a1 1 0 01.755-.778zM11 5v.01M13 19.967a1 1 0 01-.954 0l-6-3a1 1 0 01-.023-1.732l6-11a1 1 0 011.732.954l-6 11a1 1 0 01-.755.778zM13 19v-.01" /></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L10 17l-4 4 4-4 2.293-2.293a1 1 0 011.414 0L17 14m-5-5l2.293 2.293a1 1 0 010 1.414L10 17" /></svg>;
const ShieldCheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944a11.955 11.955 0 018.618-3.04 12.02 12.02 0 008.618-3.04z" /></svg>;
const MoonIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>;
const LocationMarkerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const CameraIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const MicIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>;


// --- COMMON PROFILE COMPONENTS ---
interface ProfileHeaderProps {
  user: User;
  onUpdateUser: (updatedData: Partial<User>) => void;
}
const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, onUpdateUser }) => {
    const { translations } = useLocalization();
    const { addToast } = useToast();
    const [isEditingName, setIsEditingName] = useState(false);
    const [editingNameValue, setEditingNameValue] = useState(user.name);
    const avatarInputRef = useRef<HTMLInputElement>(null);

    const triggerAvatarUpload = () => avatarInputRef.current?.click();

    const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onUpdateUser({ avatar: reader.result as string });
                addToast('Avatar updated successfully!', 'success');
            };
            reader.readAsDataURL(file);
        } else if (file) {
            addToast('Please select a valid image file.', 'error');
        }
    };

    const handleSaveName = () => {
        if (editingNameValue.trim()) {
            onUpdateUser({ name: editingNameValue.trim() });
            addToast('Name updated successfully!', 'success');
            setIsEditingName(false);
        } else {
            addToast('Name cannot be empty.', 'error');
        }
    };

    return (
        <Card>
          <div className="flex flex-col items-center text-center">
             <div className="relative mb-4">
                <img src={user.avatar} alt={user.name} className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-orange-200 dark:border-orange-700" />
                <input type="file" ref={avatarInputRef} onChange={handleAvatarFileChange} className="hidden" accept="image/png, image/jpeg" />
             </div>
             {!isEditingName ? (
                 <div className="flex items-center">
                     <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{user.name}</h3>
                     <button onClick={() => setIsEditingName(true)} aria-label="Edit name"><PencilIcon /></button>
                 </div>
               ) : (
                 <div className="flex items-center gap-2">
                     <input type="text" value={editingNameValue} onChange={(e) => setEditingNameValue(e.target.value)} className="text-2xl font-bold text-center border-b-2 border-orange-500 focus:outline-none bg-orange-50 dark:bg-gray-700" autoFocus onKeyDown={(e) => e.key === 'Enter' && handleSaveName()} />
                     <button onClick={handleSaveName} aria-label="Save name"><CheckIcon /></button>
                     <button onClick={() => setIsEditingName(false)} aria-label="Cancel edit name"><XIcon /></button>
                 </div>
               )}
             <p className="text-lg text-gray-500 dark:text-gray-400 mb-6">{user.role}</p>
             <Button onClick={triggerAvatarUpload}>{translations.profile.changeAvatar}</Button>
           </div>
        </Card>
    );
};

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

// --- ROLE-SPECIFIC PROFILE BODY COMPONENTS ---

const AdminProfileBody: React.FC<{ user: User, onUpdateUser: (data: Partial<User>) => void }> = ({ user, onUpdateUser }) => {
    const { translations } = useLocalization();
    const t = translations.profile;
    
    // FIX: Removed local `settings` variable and use `user.settings` directly with optional chaining to prevent type errors.
    useEffect(() => {
        if (user.settings?.theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [user.settings?.theme]);
    
    // FIX: Updated settings handlers to correctly construct a new settings object, preserving existing values and preventing type errors.
    const handleThemeChange = (newTheme: 'light' | 'dark') => {
        const baseSettings = user.settings || {
            notifications: false,
            powerButtonSos: false,
            voiceNav: false,
        };
        onUpdateUser({ settings: { ...baseSettings, theme: newTheme } });
    };

    const handleAdminNotificationToggle = (key: keyof NonNullable<User['settings']['adminNotifications']>, value: boolean) => {
        const baseSettings = user.settings || {
            notifications: false,
            powerButtonSos: false,
            voiceNav: false,
        };
        onUpdateUser({
            settings: { ...baseSettings, adminNotifications: { ...baseSettings.adminNotifications, [key]: value } }
        });
    };
    
    const handleSystemSettingToggle = (key: keyof NonNullable<User['settings']['systemSettings']>, value: boolean) => {
        const baseSettings = user.settings || {
            notifications: false,
            powerButtonSos: false,
            voiceNav: false,
        };
        onUpdateUser({
            settings: { ...baseSettings, systemSettings: { ...baseSettings.systemSettings, [key]: value } }
        });
    };

    const MOCK_ACTIVITY = [
      { id: 1, action: 'Assigned RPT-1672837462 to Officer Singh.', time: '2h ago' },
      { id: 2, action: 'Suspended user Rohan Mehra.', time: '1d ago' },
      { id: 3, action: 'Resolved report RPT-2736475.', time: '1d ago' },
    ];

    return (
        <>
            <Card>
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{t.systemStats}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    <div><p className="text-3xl font-bold">{DEMO_USERS.length}</p><p className="text-gray-500 dark:text-gray-400">{t.totalUsers}</p></div>
                    <div><p className="text-3xl font-bold">{MOCK_LOST_FOUND_REPORTS.length}</p><p className="text-gray-500 dark:text-gray-400">{t.totalReports}</p></div>
                    <div><p className="text-3xl font-bold text-green-600">{DEMO_USERS.filter(u => (u.role === UserRole.VOLUNTEER || u.role === UserRole.AUTHORITY) && u.status === 'Active').length}</p><p className="text-gray-500 dark:text-gray-400">{t.activePersonnel}</p></div>
                </div>
            </Card>
             <Card>
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{t.dashboardSettings}</h2>
                 <div className="flex justify-between items-center">
                    <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200">{t.theme}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t.themeDesc}</p>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                        {/* FIX: Use `user.settings?.theme` for safe access. */}
                        <Button variant={user.settings?.theme === 'light' ? 'primary' : 'secondary'} onClick={() => handleThemeChange('light')} className="text-sm py-1 px-3">{t.light}</Button>
                        <Button variant={user.settings?.theme === 'dark' ? 'primary' : 'secondary'} onClick={() => handleThemeChange('dark')} className="text-sm py-1 px-3">{t.dark}</Button>
                    </div>
                 </div>
            </Card>
             <Card>
                <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{t.notificationSettingsAdmin}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t.notificationSettingsAdminDesc}</p>
                <div className="divide-y divide-gray-200 dark:divide-gray-700 -m-6">
                    {/* FIX: Use `user.settings` with optional chaining and nullish coalescing for safe access. */}
                    <SettingRow id="high-priority" label={t.highPriority} description={t.highPriorityDesc} checked={user.settings?.adminNotifications?.highPriority ?? true} onToggle={(c) => handleAdminNotificationToggle('highPriority', c)} icon={<ShieldExclamationIcon />} />
                    <SettingRow id="sos-alerts" label={t.sosAlerts} description={t.sosAlertsDesc} checked={user.settings?.adminNotifications?.sosAlerts ?? true} onToggle={(c) => handleAdminNotificationToggle('sosAlerts', c)} icon={<BellIcon />} />
                    <SettingRow id="system-health" label={t.systemHealth} description={t.systemHealthDesc} checked={user.settings?.adminNotifications?.systemHealth ?? false} onToggle={(c) => handleAdminNotificationToggle('systemHealth', c)} icon={<CogIcon />} />
                </div>
            </Card>
             <Card>
                <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{t.systemConfig}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t.systemConfigDesc}</p>
                <div className="divide-y divide-gray-200 dark:divide-gray-700 -m-6">
                    {/* FIX: Use `user.settings` with optional chaining and nullish coalescing for safe access. */}
                    <SettingRow id="ai-autofill" label={t.aiAutofill} description={t.aiAutofillDesc} checked={user.settings?.systemSettings?.aiAutofill ?? true} onToggle={(c) => handleSystemSettingToggle('aiAutofill', c)} icon={<SparklesIcon />} />
                    <SettingRow id="ai-image-analysis" label={t.aiImageAnalysis} description={t.aiImageAnalysisDesc} checked={user.settings?.systemSettings?.aiImageAnalysis ?? true} onToggle={(c) => handleSystemSettingToggle('aiImageAnalysis', c)} icon={<SparklesIcon />} />
                    <SettingRow id="maintenance-mode" label={t.maintenanceMode} description={t.maintenanceModeDesc} checked={user.settings?.systemSettings?.maintenanceMode ?? false} onToggle={(c) => handleSystemSettingToggle('maintenanceMode', c)} icon={<WrenchScrewdriverIcon />} />
                </div>
            </Card>
             <Card>
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{t.activityLog}</h2>
                <div className="space-y-3">
                    {MOCK_ACTIVITY.map(act => (
                        <div key={act.id} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                            <p className="text-gray-700 dark:text-gray-300">{act.action}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-4">{act.time}</p>
                        </div>
                    ))}
                </div>
            </Card>
        </>
    );
};

const AuthorityProfileBody: React.FC<{ user: User; onUpdateUser: (data: Partial<User>) => void; onSelectReport: (report: LostFoundReport) => void; }> = ({ user, onUpdateUser, onSelectReport }) => {
    const { translations } = useLocalization();
    const t = translations.profile;
    const authT = t.authority || {};

    const myAssignments = MOCK_LOST_FOUND_REPORTS.filter(r => r.assignedToId === user.id);
    const openPriorityAssignments = myAssignments.filter(r => r.status !== 'Resolved' && r.category === 'Person');
    const resolvedAssignments = myAssignments.filter(r => r.status === 'Resolved');
    
    // FIX: Removed local `settings` variable and use `user.settings` directly with optional chaining to prevent type errors.
    useEffect(() => {
        if (user.settings?.theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [user.settings?.theme]);

    // FIX: Updated settings handlers to correctly construct a new settings object, preserving existing values and preventing type errors.
    const handleThemeChange = (newTheme: 'light' | 'dark') => {
        const baseSettings = user.settings || {
            notifications: false,
            powerButtonSos: false,
            voiceNav: false,
        };
        onUpdateUser({ settings: { ...baseSettings, theme: newTheme } });
    };

    const handleSettingToggle = (key: keyof NonNullable<User['settings']>, value: boolean) => {
        const baseSettings = user.settings || {
            notifications: false,
            powerButtonSos: false,
            voiceNav: false,
        };
        onUpdateUser({
            settings: { 
                ...(baseSettings),
                [key]: value 
            }
        });
    };

    return (
        <>
            <Card>
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{authT.statsTitle}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    <div><p className="text-3xl font-bold">{myAssignments.length}</p><p className="text-gray-500 dark:text-gray-400">{authT.totalAssigned}</p></div>
                    <div><p className="text-3xl font-bold text-red-600">{openPriorityAssignments.length}</p><p className="text-gray-500 dark:text-gray-400">{authT.openPriority}</p></div>
                    <div><p className="text-3xl font-bold text-green-600">{resolvedAssignments.length}</p><p className="text-gray-500 dark:text-gray-400">{authT.resolvedCases}</p></div>
                </div>
            </Card>

            <Card>
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{t.myAssignments}</h2>
                <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
                    {myAssignments.filter(r => r.status !== 'Resolved').length > 0 ? (
                        myAssignments.filter(r => r.status !== 'Resolved').map(report => (
                            <div key={report.id} className="flex flex-col sm:flex-row justify-between sm:items-center bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg gap-2">
                                <div>
                                    <p className="font-semibold text-gray-800 dark:text-gray-200">{report.personName || report.itemName}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-sm">{report.description}</p>
                                </div>
                                <Button onClick={() => onSelectReport(report)} variant="secondary" className="text-sm py-1 px-3 self-end sm:self-center">{t.viewReport}</Button>
                            </div>
                        ))
                    ) : (
                         <p className="text-gray-500 dark:text-gray-400 italic text-center py-4">{t.noAssignments}</p>
                    )}
                </div>
            </Card>

            <Card>
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{authT.settingsTitle}</h2>
                <div className="divide-y divide-gray-200 dark:divide-gray-700 -m-6">
                    <div className="p-4 flex justify-between items-center">
                        <div>
                            <p className="font-medium text-gray-800 dark:text-gray-200">{t.theme}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{t.themeDesc}</p>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                            {/* FIX: Use `user.settings?.theme` for safe access. */}
                            <Button variant={user.settings?.theme === 'light' ? 'primary' : 'secondary'} onClick={() => handleThemeChange('light')} className="text-sm py-1 px-3">{t.light}</Button>
                            <Button variant={user.settings?.theme === 'dark' ? 'primary' : 'secondary'} onClick={() => handleThemeChange('dark')} className="text-sm py-1 px-3">{t.dark}</Button>
                        </div>
                    </div>
                    {/* FIX: Use `user.settings` with optional chaining and nullish coalescing for safe access. */}
                    <SettingRow id="assignment-notifications" label={authT.assignmentNotifications} description={authT.assignmentNotificationsDesc} checked={user.settings?.notifications ?? true} onToggle={(c) => handleSettingToggle('notifications', c)} icon={<BellIcon />} />
                    <SettingRow id="sos-zone-alerts" label={authT.sosZoneAlerts} description={authT.sosZoneAlertsDesc} checked={user.settings?.sosZoneAlerts ?? true} onToggle={(c) => handleSettingToggle('sosZoneAlerts', c)} icon={<ShieldExclamationIcon />} />
                    <SettingRow id="high-priority-only" label={authT.highPriorityOnly} description={authT.highPriorityOnlyDesc} checked={user.settings?.highPriorityAlertsOnly ?? false} onToggle={(c) => handleSettingToggle('highPriorityAlertsOnly', c)} icon={<ShieldCheckIcon />} />
                    <SettingRow id="patrol-mode" label={authT.patrolMode} description={authT.patrolModeDesc} checked={user.settings?.patrolMode ?? false} onToggle={(c) => handleSettingToggle('patrolMode', c)} icon={<MoonIcon />} />
                </div>
            </Card>
        </>
    );
};


const VolunteerProfileBody: React.FC<{ user: User; onUpdateUser: (data: Partial<User>) => void; onSelectReport: (report: LostFoundReport) => void; }> = ({ user, onUpdateUser, onSelectReport }) => {
    const { translations } = useLocalization();
    const t = translations.profile;
    const volT = t.volunteer || {};

    // Stats calculations
    const myAssignments = MOCK_LOST_FOUND_REPORTS.filter(r => r.assignedToId === user.id);
    const openCases = myAssignments.filter(r => r.status !== 'Resolved');
    const resolvedThisWeek = myAssignments.filter(r => {
        if (r.status !== 'Resolved') return false;
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return new Date(r.timestamp) > oneWeekAgo;
    }).length;

    // Settings handlers
    useEffect(() => {
        if (user.settings?.theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [user.settings?.theme]);

    const handleSettingToggle = (key: keyof NonNullable<User['settings']>, value: boolean) => {
        const baseSettings = user.settings || {
            notifications: false, powerButtonSos: false, voiceNav: false,
        };
        onUpdateUser({ settings: { ...baseSettings, [key]: value } });
    };
    
    const handleAvailabilityChange = (status: 'Active' | 'On Break') => {
        const baseSettings = user.settings || {
            notifications: false, powerButtonSos: false, voiceNav: false,
        };
        onUpdateUser({ settings: { ...baseSettings, availabilityStatus: status } });
    };
    
    const handleRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const radius = parseInt(e.target.value, 10);
        const baseSettings = user.settings || {
            notifications: false, powerButtonSos: false, voiceNav: false,
        };
        onUpdateUser({ settings: { ...baseSettings, workingRadius: radius } });
    };

    const handleThemeChange = (newTheme: 'light' | 'dark') => {
        const baseSettings = user.settings || {
            notifications: false, powerButtonSos: false, voiceNav: false,
        };
        onUpdateUser({ settings: { ...baseSettings, theme: newTheme } });
    };

    return (
        <>
            <Card>
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{volT.statsTitle}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    <div><p className="text-3xl font-bold">{myAssignments.length}</p><p className="text-gray-500 dark:text-gray-400">{volT.totalAssigned}</p></div>
                    <div><p className="text-3xl font-bold text-yellow-600">{openCases.length}</p><p className="text-gray-500 dark:text-gray-400">{volT.openCases}</p></div>
                    <div><p className="text-3xl font-bold text-green-600">{resolvedThisWeek}</p><p className="text-gray-500 dark:text-gray-400">{volT.resolvedThisWeek}</p></div>
                </div>
            </Card>

            <Card>
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{t.myAssignments}</h2>
                <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
                    {openCases.length > 0 ? (
                        openCases.map(report => (
                            <div key={report.id} className="flex flex-col sm:flex-row justify-between sm:items-center bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg gap-2">
                                <div>
                                    <p className="font-semibold text-gray-800 dark:text-gray-200">{report.personName || report.itemName}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-sm">{report.description}</p>
                                </div>
                                <Button onClick={() => onSelectReport(report)} variant="secondary" className="text-sm py-1 px-3 self-end sm:self-center">{t.viewReport}</Button>
                            </div>
                        ))
                    ) : (
                         <p className="text-gray-500 dark:text-gray-400 italic text-center py-4">{t.noAssignments}</p>
                    )}
                </div>
            </Card>

            <Card>
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{volT.settingsTitle}</h2>
                <div className="divide-y divide-gray-200 dark:divide-gray-700 -m-6">
                     <div className="p-4 flex justify-between items-center">
                        <div>
                            <p className="font-medium text-gray-800 dark:text-gray-200">{t.theme}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{t.themeDesc}</p>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                            <Button variant={user.settings?.theme === 'light' ? 'primary' : 'secondary'} onClick={() => handleThemeChange('light')} className="text-sm py-1 px-3">{t.light}</Button>
                            <Button variant={user.settings?.theme === 'dark' ? 'primary' : 'secondary'} onClick={() => handleThemeChange('dark')} className="text-sm py-1 px-3">{t.dark}</Button>
                        </div>
                    </div>
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
        </>
    );
};

const PilgrimProfileBody: React.FC<{ user: User; onUpdateUser: (data: Partial<User>) => void; onSelectSosAlert: (alert: SosAlert) => void; }> = ({ user, onUpdateUser, onSelectSosAlert }) => {
    const { translations } = useLocalization();
    const { addToast } = useToast();
    const [isContactModalOpen, setContactModalOpen] = useState(false);
    const [newContactName, setNewContactName] = useState('');
    const [newContactPhone, setNewContactPhone] = useState('');
    const [sosFilter, setSosFilter] = useState('all');
    const [sosSort, setSosSort] = useState('newest');

    const t = translations.profile;
    const contacts = user.emergencyContacts || [];
    const sosHistory = user.sosHistory || [];

    const handleToggle = (key: 'notifications' | 'powerButtonSos' | 'voiceNav', enabled: boolean) => {
        const baseSettings = user.settings || {
            notifications: false, powerButtonSos: false, voiceNav: false,
        };
        onUpdateUser({ settings: { ...baseSettings, [key]: enabled } });
        addToast(`${key} setting updated.`, 'info');
    };

    const handlePermissionToggle = (key: 'locationAccess' | 'cameraAccess' | 'microphoneAccess', enabled: boolean) => {
        const baseSettings = user.settings || {
            notifications: false, powerButtonSos: false, voiceNav: false,
        };
        onUpdateUser({ settings: { ...baseSettings, [key]: enabled } });
        addToast(`${key.replace('Access','')} access setting updated.`, 'info');
    };

    const handleAddContact = () => {
        if (newContactName.trim() && newContactPhone.trim()) {
            const newContact: EmergencyContact = { id: Date.now(), name: newContactName, phone: newContactPhone };
            onUpdateUser({ emergencyContacts: [...contacts, newContact] });
            setNewContactName(''); setNewContactPhone(''); setContactModalOpen(false);
        }
    };
    
    const handleRemoveContact = (id: number) => {
        onUpdateUser({ emergencyContacts: contacts.filter(c => c.id !== id) });
    };

    const getSosStatusClasses = (status: SosAlert['status']) => {
        switch (status) {
            case 'Broadcasted': return 'bg-yellow-200 text-yellow-800';
            case 'Responded': return 'bg-blue-200 text-blue-800';
            case 'Resolved': return 'bg-green-200 text-green-800';
            default: return 'bg-gray-200 text-gray-800';
        }
    };
    
    const filteredAndSortedSosHistory = useMemo(() => {
        return sosHistory
            .filter(alert => sosFilter === 'all' || alert.status === sosFilter)
            .sort((a, b) => {
                const dateA = new Date(a.timestamp).getTime();
                const dateB = new Date(b.timestamp).getTime();
                return sosSort === 'newest' ? dateB - dateA : dateA - dateB;
            });
    }, [sosHistory, sosFilter, sosSort]);
    
    return (
      <>
        <Card>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{t.emergencyContacts.title}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t.emergencyContacts.description}</p>
            <div className="space-y-3 mb-4">
                {contacts.length > 0 ? (
                    contacts.map(c => <div key={c.id} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg"><div><p className="font-semibold text-gray-800 dark:text-gray-200">{c.name}</p><p className="text-sm text-gray-600 dark:text-gray-400">{c.phone}</p></div><Button onClick={() => handleRemoveContact(c.id)} variant="danger" className="text-xs px-3 py-1">{t.emergencyContacts.remove}</Button></div>)
                ) : <p className="text-gray-500 dark:text-gray-400 italic text-center py-2">{t.emergencyContacts.noContacts}</p>}
            </div>
            <Button onClick={() => setContactModalOpen(true)} className="w-full" variant="secondary">{t.emergencyContacts.addContact}</Button>
        </Card>
        <Card>
            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{t.sosHistory.title}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t.sosHistory.description}</p>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex-1">
                    <label htmlFor="sos-filter" className="text-sm font-medium text-gray-700 dark:text-gray-300">{t.sosHistory.filterByStatus}</label>
                    <select id="sos-filter" value={sosFilter} onChange={e => setSosFilter(e.target.value)} className="w-full mt-1 p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600">
                        <option value="all">{t.sosHistory.allStatuses}</option>
                        <option value="Broadcasted">{t.sosHistory.statuses.broadcasted}</option>
                        <option value="Responded">{t.sosHistory.statuses.responded}</option>
                        <option value="Resolved">{t.sosHistory.statuses.resolved}</option>
                    </select>
                </div>
                <div className="flex-1">
                    <label htmlFor="sos-sort" className="text-sm font-medium text-gray-700 dark:text-gray-300">{t.sosHistory.sortBy}</label>
                    <select id="sos-sort" value={sosSort} onChange={e => setSosSort(e.target.value)} className="w-full mt-1 p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600">
                        <option value="newest">{t.sosHistory.sortNewest}</option>
                        <option value="oldest">{t.sosHistory.sortOldest}</option>
                    </select>
                </div>
            </div>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {filteredAndSortedSosHistory.length > 0 ? (
                filteredAndSortedSosHistory.map(alert => <div key={alert.id} onClick={() => onSelectSosAlert(alert)} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"><div><p className="font-semibold text-gray-800 dark:text-gray-200">{new Date(alert.timestamp).toLocaleString()}</p><p className="text-sm text-gray-500 dark:text-gray-400">{t.sosHistory.triggeredOn}</p></div><span className={`px-3 py-1 text-xs font-semibold rounded-full ${getSosStatusClasses(alert.status)}`}>{t.sosHistory.statuses[alert.status.toLowerCase() as keyof typeof t.sosHistory.statuses]}</span></div>)
              ) : <p className="text-gray-500 dark:text-gray-400 italic text-center py-2">{t.sosHistory.noHistory}</p>}
            </div>
        </Card>
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
        <Modal isOpen={isContactModalOpen} onClose={() => setContactModalOpen(false)} title={t.emergencyContacts.addModalTitle}>
            <div className="space-y-4">
                <div><label htmlFor="contact-name" className="block text-sm font-medium text-gray-700">{t.emergencyContacts.nameLabel}</label><input type="text" id="contact-name" value={newContactName} onChange={(e) => setNewContactName(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"/></div>
                <div><label htmlFor="contact-phone" className="block text-sm font-medium text-gray-700">{t.emergencyContacts.phoneLabel}</label><input type="tel" id="contact-phone" value={newContactPhone} onChange={(e) => setNewContactPhone(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"/></div>
                <div className="flex justify-end gap-4 pt-4"><Button variant="secondary" onClick={() => setContactModalOpen(false)}>{t.emergencyContacts.cancel}</Button><Button onClick={handleAddContact}>{t.emergencyContacts.save}</Button></div>
            </div>
        </Modal>
      </>
    );
};


/**
 * Main Profile Page Component
 * Renders a role-specific profile view.
 */
const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, updateUser } = useAuth();
  const [selectedReport, setSelectedReport] = useState<LostFoundReport | null>(null);
  const [selectedSosAlert, setSelectedSosAlert] = useState<SosAlert | null>(null);
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/" />;
  }

  const renderProfileBody = () => {
    switch(user.role) {
      case UserRole.ADMIN:
        return <AdminProfileBody user={user} onUpdateUser={updateUser} />;
      case UserRole.AUTHORITY:
        return <AuthorityProfileBody user={user} onUpdateUser={updateUser} onSelectReport={setSelectedReport} />;
      case UserRole.VOLUNTEER:
        return <VolunteerProfileBody user={user} onUpdateUser={updateUser} onSelectReport={setSelectedReport} />;
      case UserRole.PILGRIM:
      default:
        return <PilgrimProfileBody user={user} onUpdateUser={updateUser} onSelectSosAlert={setSelectedSosAlert} />;
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-2xl mx-auto space-y-6">
              <ProfileHeader user={user} onUpdateUser={updateUser} />
              {renderProfileBody()}
          </div>
      </div>
      <ReportDetailsModal 
          isOpen={!!selectedReport}
          onClose={() => setSelectedReport(null)}
          report={selectedReport}
      />
      <SosDetailsModal
        isOpen={!!selectedSosAlert}
        onClose={() => setSelectedSosAlert(null)}
        alert={selectedSosAlert}
      />
    </>
  );
};

export default ProfilePage;