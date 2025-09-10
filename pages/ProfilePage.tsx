import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLocalization } from '../hooks/useLocalization';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useToast } from '../hooks/useToast';
import { EmergencyContact, SosAlert, User, UserRole, LostFoundReport } from '../types';
import { Modal } from '../components/ui/Modal';
import { DEMO_USERS } from '../constants';
import { MOCK_LOST_FOUND_REPORTS, MOCK_OPERATIONAL_ZONES } from '../data/mockData';
import ReportDetailsModal from '../components/dashboard/ReportDetailsModal';
import { SosDetailsModal } from '../components/dashboard/SosDetailsModal';
import { ToggleSwitch } from '../components/ui/ToggleSwitch';


// --- ICONS ---
const PencilIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 text-gray-500 hover:text-orange-500 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5l12.232-12.232z" /></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const BellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;
const ShieldExclamationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
const LocationMarkerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;


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

// --- ROLE-SPECIFIC PROFILE BODY COMPONENTS ---

const AdminProfileBody: React.FC<{ user: User, onUpdateUser: (data: Partial<User>) => void }> = ({ user, onUpdateUser }) => {
    return null; // Admin profile is simple, most functionality is in the dashboard and settings.
};

const AuthorityProfileBody: React.FC<{ user: User; onUpdateUser: (data: Partial<User>) => void; }> = ({ user, onUpdateUser }) => {
    const { translations } = useLocalization();
    const t = translations.profile;
    const authT = t.authority || {};

    const myAssignments = useMemo(() => MOCK_LOST_FOUND_REPORTS.filter(r => r.assignedToId === user?.id), [user]);
    const openCases = useMemo(() => myAssignments.filter(r => r.status !== 'Resolved').length, [myAssignments]);
    const resolvedCases = useMemo(() => myAssignments.filter(r => r.status === 'Resolved').length, [myAssignments]);

    return (
        <Card>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">My Stats</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
                <div className="bg-gray-100 p-4 rounded-lg">
                    <p className="text-3xl font-bold text-yellow-600">{openCases}</p>
                    <p className="text-gray-500 dark:text-gray-400">{authT.openCases}</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                     <p className="text-3xl font-bold text-green-600">{resolvedCases}</p>
                     <p className="text-gray-500 dark:text-gray-400">{authT.resolvedCases}</p>
                </div>
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

const VolunteerProfileBody: React.FC<{ user: User; }> = ({ user }) => {
    return (
        <VolunteerSettings user={user} />
    );
};

const PilgrimProfileBody: React.FC<{ user: User; onUpdateUser: (data: Partial<User>) => void; onSelectSosAlert: (alert: SosAlert) => void; }> = ({ user, onUpdateUser, onSelectSosAlert }) => {
    const { translations } = useLocalization();
    const [isContactModalOpen, setContactModalOpen] = useState(false);
    const [newContactName, setNewContactName] = useState('');
    const [newContactPhone, setNewContactPhone] = useState('');
    const [sosFilter, setSosFilter] = useState('all');
    const [sosSort, setSosSort] = useState('newest');

    const t = translations.profile;
    const contacts = user.emergencyContacts || [];
    const sosHistory = user.sosHistory || [];
    
    const handleAddContact = () => {
        if (newContactName.trim() && newContactPhone.trim()) {
            const newContact: EmergencyContact = { id: Date.now(), name: newContactName, phone: newContactPhone };
            const updatedContacts = [...contacts, newContact];
            onUpdateUser({ emergencyContacts: updatedContacts });
            
            const userIndex = DEMO_USERS.findIndex(u => u.id === user.id);
            if (userIndex !== -1) DEMO_USERS[userIndex].emergencyContacts = updatedContacts;

            setNewContactName(''); setNewContactPhone(''); setContactModalOpen(false);
        }
    };
    
    const handleRemoveContact = (id: number) => {
        const updatedContacts = contacts.filter(c => c.id !== id);
        onUpdateUser({ emergencyContacts: updatedContacts });
        
        const userIndex = DEMO_USERS.findIndex(u => u.id === user.id);
        if (userIndex !== -1) DEMO_USERS[userIndex].emergencyContacts = updatedContacts;
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
        <div className="space-y-6">
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
        </div>
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
        return <AuthorityProfileBody user={user} onUpdateUser={updateUser} />;
      case UserRole.VOLUNTEER:
        return <VolunteerProfileBody user={user} />;
      case UserRole.PILGRIM:
      default:
        return <PilgrimProfileBody user={user} onUpdateUser={updateUser} onSelectSosAlert={setSelectedSosAlert} />;
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-3xl mx-auto space-y-6">
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