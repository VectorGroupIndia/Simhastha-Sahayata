import React, { useState, useRef, useEffect } from 'react';
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


// --- ICONS ---
const PencilIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 text-gray-500 hover:text-orange-500 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5l12.232-12.232z" /></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;

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
                <img src={user.avatar} alt={user.name} className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-orange-200" />
                <input type="file" ref={avatarInputRef} onChange={handleAvatarFileChange} className="hidden" accept="image/png, image/jpeg" />
             </div>
             {!isEditingName ? (
                 <div className="flex items-center">
                     <h3 className="text-2xl font-bold text-gray-800">{user.name}</h3>
                     <button onClick={() => setIsEditingName(true)} aria-label="Edit name"><PencilIcon /></button>
                 </div>
               ) : (
                 <div className="flex items-center gap-2">
                     <input type="text" value={editingNameValue} onChange={(e) => setEditingNameValue(e.target.value)} className="text-2xl font-bold text-center border-b-2 border-orange-500 focus:outline-none bg-orange-50" autoFocus onKeyDown={(e) => e.key === 'Enter' && handleSaveName()} />
                     <button onClick={handleSaveName} aria-label="Save name"><CheckIcon /></button>
                     <button onClick={() => setIsEditingName(false)} aria-label="Cancel edit name"><XIcon /></button>
                 </div>
               )}
             <p className="text-lg text-gray-500 mb-6">{user.role}</p>
             <Button onClick={triggerAvatarUpload}>{translations.profile.changeAvatar}</Button>
           </div>
        </Card>
    );
};

// --- ROLE-SPECIFIC PROFILE BODY COMPONENTS ---

const AdminProfileBody: React.FC<{ user: User, onUpdateUser: (data: Partial<User>) => void }> = ({ user, onUpdateUser }) => {
    const { translations } = useLocalization();
    const t = translations.profile;
    const settings = user.settings || { theme: 'light' };
    
    useEffect(() => {
        if (settings.theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [settings.theme]);
    
    const handleThemeChange = (newTheme: 'light' | 'dark') => {
        onUpdateUser({ settings: { ...user.settings, theme: newTheme } });
    };

    const MOCK_ACTIVITY = [
      { id: 1, action: 'Assigned RPT-1672837462 to Officer Singh.', time: '2h ago' },
      { id: 2, action: 'Suspended user Rohan Mehra.', time: '1d ago' },
      { id: 3, action: 'Resolved report RPT-2736475.', time: '1d ago' },
    ];

    return (
        <>
            <Card>
                <h2 className="text-2xl font-bold mb-4">{t.systemStats}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    <div><p className="text-3xl font-bold">{DEMO_USERS.length}</p><p className="text-gray-500">{t.totalUsers}</p></div>
                    <div><p className="text-3xl font-bold">{MOCK_LOST_FOUND_REPORTS.length}</p><p className="text-gray-500">{t.totalReports}</p></div>
                    <div><p className="text-3xl font-bold text-green-600">{DEMO_USERS.filter(u => (u.role === UserRole.VOLUNTEER || u.role === UserRole.AUTHORITY) && u.status === 'Active').length}</p><p className="text-gray-500">{t.activePersonnel}</p></div>
                </div>
            </Card>
             <Card>
                <h2 className="text-2xl font-bold mb-4">{t.dashboardSettings}</h2>
                 <div className="flex justify-between items-center">
                    <div>
                        <p className="font-medium text-gray-800">{t.theme}</p>
                        <p className="text-sm text-gray-500">{t.themeDesc}</p>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                        <Button variant={settings.theme === 'light' ? 'primary' : 'secondary'} onClick={() => handleThemeChange('light')} className="text-sm py-1 px-3">{t.light}</Button>
                        <Button variant={settings.theme === 'dark' ? 'primary' : 'secondary'} onClick={() => handleThemeChange('dark')} className="text-sm py-1 px-3">{t.dark}</Button>
                    </div>
                 </div>
            </Card>
             <Card>
                <h2 className="text-2xl font-bold mb-4">{t.activityLog}</h2>
                <div className="space-y-3">
                    {MOCK_ACTIVITY.map(act => (
                        <div key={act.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                            <p className="text-gray-700">{act.action}</p>
                            <p className="text-xs text-gray-500 flex-shrink-0 ml-4">{act.time}</p>
                        </div>
                    ))}
                </div>
            </Card>
        </>
    );
};

const StaffProfileBody: React.FC<{ user: User; onSelectReport: (report: LostFoundReport) => void }> = ({ user, onSelectReport }) => {
    const { translations } = useLocalization();
    const t = translations.profile;
    const myAssignments = MOCK_LOST_FOUND_REPORTS.filter(r => r.assignedToId === user.id && r.status !== 'Resolved');

    return (
        <Card>
            <h2 className="text-2xl font-bold mb-4">{t.myAssignments}</h2>
            <div className="space-y-3">
                {myAssignments.length > 0 ? (
                    myAssignments.map(report => (
                        <div key={report.id} className="flex flex-col sm:flex-row justify-between sm:items-center bg-gray-50 p-3 rounded-lg gap-2">
                            <div>
                                <p className="font-semibold text-gray-800">{report.personName || report.itemName}</p>
                                <p className="text-sm text-gray-600 truncate max-w-sm">{report.description}</p>
                            </div>
                            <Button onClick={() => onSelectReport(report)} variant="secondary" className="text-sm py-1 px-3 self-end sm:self-center">{t.viewReport}</Button>
                        </div>
                    ))
                ) : (
                     <p className="text-gray-500 italic text-center py-4">{t.noAssignments}</p>
                )}
            </div>
        </Card>
    );
};

const PilgrimProfileBody: React.FC<{ user: User; onUpdateUser: (data: Partial<User>) => void }> = ({ user, onUpdateUser }) => {
    const { translations } = useLocalization();
    const { addToast } = useToast();
    const [isContactModalOpen, setContactModalOpen] = useState(false);
    const [newContactName, setNewContactName] = useState('');
    const [newContactPhone, setNewContactPhone] = useState('');

    const t = translations.profile;
    const contacts = user.emergencyContacts || [];
    const sosHistory = user.sosHistory || [];
    const settings = user.settings || { notifications: false, powerButtonSos: false, voiceNav: false };

    const handleToggle = (key: 'notifications' | 'powerButtonSos' | 'voiceNav', enabled: boolean) => {
        onUpdateUser({ settings: { ...settings, [key]: enabled } });
        // Simplified toast message for brevity
        addToast(`${key} setting updated.`, 'info');
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
    
    return (
      <>
        <Card>
            <h2 className="text-2xl font-bold mb-4">{t.emergencyContacts.title}</h2>
            <p className="text-sm text-gray-500 mb-4">{t.emergencyContacts.description}</p>
            <div className="space-y-3 mb-4">
                {contacts.length > 0 ? (
                    contacts.map(c => <div key={c.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"><div><p className="font-semibold text-gray-800">{c.name}</p><p className="text-sm text-gray-600">{c.phone}</p></div><Button onClick={() => handleRemoveContact(c.id)} variant="danger" className="text-xs px-3 py-1">{t.emergencyContacts.remove}</Button></div>)
                ) : <p className="text-gray-500 italic text-center py-2">{t.emergencyContacts.noContacts}</p>}
            </div>
            <Button onClick={() => setContactModalOpen(true)} className="w-full" variant="secondary">{t.emergencyContacts.addContact}</Button>
        </Card>
        <Card>
            <h2 className="text-2xl font-bold mb-2">{t.sosHistory.title}</h2>
            <p className="text-sm text-gray-500 mb-4">{t.sosHistory.description}</p>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {sosHistory.length > 0 ? (
                sosHistory.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map(alert => <div key={alert.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"><div><p className="font-semibold text-gray-800">{new Date(alert.timestamp).toLocaleString()}</p><p className="text-sm text-gray-500">{t.sosHistory.triggeredOn}</p></div><span className={`px-3 py-1 text-xs font-semibold rounded-full ${getSosStatusClasses(alert.status)}`}>{t.sosHistory.statuses[alert.status.toLowerCase() as keyof typeof t.sosHistory.statuses]}</span></div>)
              ) : <p className="text-gray-500 italic text-center py-2">{t.sosHistory.noHistory}</p>}
            </div>
        </Card>
        <Card>
            <h2 className="text-2xl font-bold mb-4">{t.settings}</h2>
            <div className="space-y-4">
                <div className="p-4 border rounded-lg"><div className="flex justify-between items-center"><div><label htmlFor="power-sos" className="font-medium text-gray-800">{t.powerButtonSos}</label><p className="text-sm text-gray-500">{t.powerButtonSosDesc}</p></div><ToggleSwitch id="power-sos" checked={settings.powerButtonSos} onChange={c => handleToggle('powerButtonSos', c)} /></div></div>
                <div className="p-4 border rounded-lg"><div className="flex justify-between items-center"><div><label htmlFor="voice-nav" className="font-medium text-gray-800">{t.voiceNav}</label><p className="text-sm text-gray-500">{t.voiceNavDesc}</p></div><ToggleSwitch id="voice-nav" checked={settings.voiceNav} onChange={c => handleToggle('voiceNav', c)} /></div></div>
                <div className="p-4 border rounded-lg"><div className="flex justify-between items-center"><div><label htmlFor="push-notifications" className="font-medium text-gray-800">{t.pushNotifications}</label><p className="text-sm text-gray-500">{t.pushNotificationsDesc}</p></div><ToggleSwitch id="push-notifications" checked={settings.notifications} onChange={c => handleToggle('notifications', c)} /></div></div>
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
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/" />;
  }

  const renderProfileBody = () => {
    switch(user.role) {
      case UserRole.ADMIN:
        return <AdminProfileBody user={user} onUpdateUser={updateUser} />;
      case UserRole.AUTHORITY:
      case UserRole.VOLUNTEER:
        return <StaffProfileBody user={user} onSelectReport={setSelectedReport} />;
      case UserRole.PILGRIM:
      default:
        return <PilgrimProfileBody user={user} onUpdateUser={updateUser} />;
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-xl mx-auto space-y-6">
              <ProfileHeader user={user} onUpdateUser={updateUser} />
              {renderProfileBody()}
          </div>
      </div>
      <ReportDetailsModal 
          isOpen={!!selectedReport}
          onClose={() => setSelectedReport(null)}
          report={selectedReport}
      />
    </>
  );
};

export default ProfilePage;