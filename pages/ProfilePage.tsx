import React, { useState, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLocalization } from '../hooks/useLocalization';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ToggleSwitch } from '../components/ui/ToggleSwitch';
import { useToast } from '../hooks/useToast';
import { EmergencyContact, SosAlert } from '../types';
import { Modal } from '../components/ui/Modal';

// Icons for editing name
const PencilIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 text-gray-500 hover:text-orange-500 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5l12.232-12.232z" /></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;


/**
 * User Profile Page.
 * This component is protected and only accessible to authenticated users.
 * It displays user information and allows for profile updates like name and avatar.
 */
const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, updateUser } = useAuth();
  const { translations } = useLocalization();
  const { addToast } = useToast();
  
  // Settings state
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [powerButtonSosEnabled, setPowerButtonSosEnabled] = useState(false);
  const [voiceNavEnabled, setVoiceNavEnabled] = useState(false);
  
  // Modal state
  const [isContactModalOpen, setContactModalOpen] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');

  // Editing state
  const [isEditingName, setIsEditingName] = useState(false);
  const [editingNameValue, setEditingNameValue] = useState(user?.name || '');
  const avatarInputRef = useRef<HTMLInputElement>(null);


  if (!isAuthenticated || !user) {
    // Redirect to home page if not logged in
    return <Navigate to="/" />;
  }

  const contacts = user.emergencyContacts || [];
  const sosHistory = user.sosHistory || [];

  const triggerAvatarUpload = () => {
    avatarInputRef.current?.click();
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
            updateUser({ avatar: reader.result as string });
            addToast('Avatar updated successfully!', 'success');
        };
        reader.readAsDataURL(file);
    } else if (file) {
        addToast('Please select a valid image file.', 'error');
    }
  };
  
  const handleNotificationToggle = (enabled: boolean) => {
    setNotificationsEnabled(enabled);
    addToast(
        enabled ? translations.notifications.enabled : translations.notifications.disabled,
        enabled ? 'success' : 'info'
    );
  };
  
  const handlePowerButtonSosToggle = (enabled: boolean) => {
    setPowerButtonSosEnabled(enabled);
    addToast(
        enabled ? 'Power Button SOS has been enabled.' : 'Power Button SOS has been disabled.',
        enabled ? 'success' : 'info'
    );
  };

  const handleVoiceNavToggle = (enabled: boolean) => {
    setVoiceNavEnabled(enabled);
    addToast(
        enabled ? 'Voice-guided navigation has been enabled.' : 'Voice-guided navigation has been disabled.',
        enabled ? 'success' : 'info'
    );
  };

  const handleEditName = () => {
      setEditingNameValue(user.name);
      setIsEditingName(true);
  };

  const handleSaveName = () => {
      if (editingNameValue.trim()) {
          updateUser({ name: editingNameValue.trim() });
          addToast('Name updated successfully!', 'success');
          setIsEditingName(false);
      } else {
          addToast('Name cannot be empty.', 'error');
      }
  };

  const handleCancelEditName = () => {
      setIsEditingName(false);
  };

  const handleAddContact = () => {
    if (newContactName.trim() && newContactPhone.trim()) {
      const newContact: EmergencyContact = {
        id: Date.now(),
        name: newContactName,
        phone: newContactPhone,
      };
      const updatedContacts = [...contacts, newContact];
      updateUser({ emergencyContacts: updatedContacts });
      setNewContactName('');
      setNewContactPhone('');
      setContactModalOpen(false);
    }
  };

  const handleRemoveContact = (id: number) => {
    const updatedContacts = contacts.filter(contact => contact.id !== id);
    updateUser({ emergencyContacts: updatedContacts });
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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-xl mx-auto space-y-6">
        <Card>
          <div className="flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold mb-6">{translations.profile.title}</h2>
            <div className="relative mb-4">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-orange-200"
              />
               <input
                  type="file"
                  ref={avatarInputRef}
                  onChange={handleAvatarFileChange}
                  className="hidden"
                  accept="image/png, image/jpeg"
                />
            </div>
            {!isEditingName ? (
                <div className="flex items-center">
                    <h3 className="text-2xl font-bold text-gray-800">{user.name}</h3>
                    <button onClick={handleEditName} aria-label="Edit name">
                        <PencilIcon />
                    </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={editingNameValue}
                        onChange={(e) => setEditingNameValue(e.target.value)}
                        className="text-2xl font-bold text-center border-b-2 border-orange-500 focus:outline-none bg-orange-50"
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                    />
                    <button onClick={handleSaveName} aria-label="Save name"><CheckIcon /></button>
                    <button onClick={handleCancelEditName} aria-label="Cancel edit name"><XIcon /></button>
                </div>
              )}
            <p className="text-lg text-gray-500 mb-6">{user.role}</p>

            <Button onClick={triggerAvatarUpload}>
              {translations.profile.changeAvatar}
            </Button>
          </div>
        </Card>
        
        <Card>
            <h2 className="text-2xl font-bold mb-4">{translations.profile.emergencyContacts.title}</h2>
            <p className="text-sm text-gray-500 mb-4">{translations.profile.emergencyContacts.description}</p>
            <div className="space-y-3 mb-4">
                {contacts.length > 0 ? (
                    contacts.map(contact => (
                        <div key={contact.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                            <div>
                                <p className="font-semibold text-gray-800">{contact.name}</p>
                                <p className="text-sm text-gray-600">{contact.phone}</p>
                            </div>
                            <Button onClick={() => handleRemoveContact(contact.id)} variant="danger" className="text-xs px-3 py-1">
                                {translations.profile.emergencyContacts.remove}
                            </Button>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 italic text-center py-2">{translations.profile.emergencyContacts.noContacts}</p>
                )}
            </div>
            <Button onClick={() => setContactModalOpen(true)} className="w-full" variant="secondary">
                {translations.profile.emergencyContacts.addContact}
            </Button>
        </Card>

        <Card>
            <h2 className="text-2xl font-bold mb-2">{translations.profile.sosHistory.title}</h2>
            <p className="text-sm text-gray-500 mb-4">{translations.profile.sosHistory.description}</p>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {sosHistory.length > 0 ? (
                sosHistory
                  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) // Sort newest first
                  .map(alert => (
                    <div key={alert.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-800">{new Date(alert.timestamp).toLocaleString()}</p>
                        <p className="text-sm text-gray-500">{translations.profile.sosHistory.triggeredOn}</p>
                      </div>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getSosStatusClasses(alert.status)}`}>
                         {translations.profile.sosHistory.statuses[alert.status.toLowerCase() as keyof typeof translations.profile.sosHistory.statuses]}
                      </span>
                    </div>
                  ))
              ) : (
                <p className="text-gray-500 italic text-center py-2">{translations.profile.sosHistory.noHistory}</p>
              )}
            </div>
        </Card>

        <Card>
            <h2 className="text-2xl font-bold mb-4">{translations.profile.settings}</h2>
            <div className="space-y-4">
                {/* Emergency Settings */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-700">{translations.profile.emergencySettings}</h3>
                    <div className="mt-2 p-4 border rounded-lg">
                        <div className="flex justify-between items-center">
                            <div>
                                <label htmlFor="power-sos" className="font-medium text-gray-800">{translations.profile.powerButtonSos}</label>
                                <p className="text-sm text-gray-500">{translations.profile.powerButtonSosDesc}</p>
                            </div>
                            <ToggleSwitch id="power-sos" checked={powerButtonSosEnabled} onChange={handlePowerButtonSosToggle} />
                        </div>
                    </div>
                </div>

                {/* Navigation Settings */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-700">{translations.profile.navigationSettings}</h3>
                    <div className="mt-2 p-4 border rounded-lg">
                        <div className="flex justify-between items-center">
                            <div>
                                <label htmlFor="voice-nav" className="font-medium text-gray-800">{translations.profile.voiceNav}</label>
                                <p className="text-sm text-gray-500">{translations.profile.voiceNavDesc}</p>
                            </div>
                            <ToggleSwitch id="voice-nav" checked={voiceNavEnabled} onChange={handleVoiceNavToggle} />
                        </div>
                    </div>
                </div>
                
                 {/* Notification Settings */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-700">{translations.profile.notificationSettings}</h3>
                    <div className="mt-2 p-4 border rounded-lg">
                        <div className="flex justify-between items-center">
                            <div>
                                <label htmlFor="push-notifications" className="font-medium text-gray-800">{translations.profile.pushNotifications}</label>
                                <p className="text-sm text-gray-500">{translations.profile.pushNotificationsDesc}</p>
                            </div>
                            <ToggleSwitch id="push-notifications" checked={notificationsEnabled} onChange={handleNotificationToggle} />
                        </div>
                    </div>
                </div>
            </div>
        </Card>
      </div>
    </div>

    <Modal isOpen={isContactModalOpen} onClose={() => setContactModalOpen(false)} title={translations.profile.emergencyContacts.addModalTitle}>
        <div className="space-y-4">
            <div>
                <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700">{translations.profile.emergencyContacts.nameLabel}</label>
                <input
                    type="text"
                    id="contact-name"
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                />
            </div>
            <div>
                <label htmlFor="contact-phone" className="block text-sm font-medium text-gray-700">{translations.profile.emergencyContacts.phoneLabel}</label>
                <input
                    type="tel"
                    id="contact-phone"
                    value={newContactPhone}
                    onChange={(e) => setNewContactPhone(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                />
            </div>
            <div className="flex justify-end gap-4 pt-4">
                <Button variant="secondary" onClick={() => setContactModalOpen(false)}>{translations.profile.emergencyContacts.cancel}</Button>
                <Button onClick={handleAddContact}>{translations.profile.emergencyContacts.save}</Button>
            </div>
        </div>
    </Modal>
    </>
  );
};

export default ProfilePage;
