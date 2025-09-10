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
import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from '../ui/Modal';
import { useLocalization } from '../../hooks/useLocalization';
import { SosAlert, User, UserRole } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { DEMO_USERS } from '../../constants';
import { getAiResourceSuggestion } from '../../services/geminiService';
import { Spinner } from '../ui/Spinner';

// --- ICONS ---
const LocationPinIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500 drop-shadow-lg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 20l-4.95-5.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>;
const UserCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>;
const HistoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L10 17l-4 4 4-4 2.293-2.293a1 1 0 011.414 0L17 14m-5-5l2.293 2.293a1 1 0 010 1.414L10 17" /></svg>;


interface SosDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  alert: SosAlert | null;
  onUpdateAlert?: (alertId: number, updates: Partial<SosAlert>) => void;
  assignableUsers?: User[];
}

export const SosDetailsModal: React.FC<SosDetailsModalProps> = ({ isOpen, onClose, alert, onUpdateAlert, assignableUsers = [] }) => {
    const { translations } = useLocalization();
    const { user } = useAuth();
    const t = translations.sosDetailsModal;
    const t_auth = translations.dashboard.authorities;

    const [newStatus, setNewStatus] = useState<SosAlert['status']>('Broadcasted');
    const [assignedTo, setAssignedTo] = useState<string>(''); // Stores "id,name"
    const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
    const [isSuggesting, setIsSuggesting] = useState(false);


    useEffect(() => {
        if (alert) {
          setNewStatus(alert.status);
          setAssignedTo(alert.assignedToId ? `${alert.assignedToId},${alert.assignedToName}` : '');
          setAiSuggestion(null);
          setIsSuggesting(false);
        }
    }, [alert]);

    const triggerUser = useMemo(() => {
        if (!alert) return null;
        return DEMO_USERS.find(u => u.id === alert.userId);
    }, [alert]);

    if (!alert) return null;

    const handleUpdate = () => {
        if (onUpdateAlert) {
            const [idStr, ...nameParts] = assignedTo.split(',');
            const name = nameParts.join(',');
            const id = parseInt(idStr, 10);
            
            const updates: Partial<SosAlert> = {
                status: newStatus,
                assignedToId: assignedTo ? id : undefined,
                assignedToName: assignedTo ? name : undefined,
            };

            if (assignedTo) {
                const assignedVolunteer = assignableUsers.find(u => u.id === id);
                if (assignedVolunteer && assignedVolunteer.role === UserRole.VOLUNTEER) {
                    updates.responderStatusAtAcceptance = assignedVolunteer.settings?.availabilityStatus;
                }
            }
            
            onUpdateAlert(alert.id, updates);
            onClose();
        }
    };
    
    const handleGetSuggestion = async () => {
        if (!alert) return;
        setIsSuggesting(true);
        setAiSuggestion(null);
        try {
            const suggestion = await getAiResourceSuggestion(alert);
            setAiSuggestion(suggestion);
        } catch (error) {
            console.error("Failed to get AI suggestion", error);
            setAiSuggestion("Failed to generate suggestion. Please try again.");
        } finally {
            setIsSuggesting(false);
        }
    }

    const canUpdate = user?.role === UserRole.AUTHORITY && onUpdateAlert;
    const canSuggest = user?.role === UserRole.AUTHORITY;

    const getStatusClasses = (status: SosAlert['status']) => {
        switch (status) {
            case 'Broadcasted': return 'bg-yellow-200 text-yellow-800';
            case 'Accepted': return 'bg-blue-200 text-blue-800';
            case 'Responded': return 'bg-blue-200 text-blue-800';
            case 'Resolved': return 'bg-green-200 text-green-800';
            default: return 'bg-gray-200 text-gray-800';
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t.title}>
            <div className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column: Details */}
                    <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                             <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm text-gray-500">{t.alertId}</p>
                                    <p className="font-mono text-gray-800">{alert.id}</p>
                                </div>
                                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusClasses(alert.status)}`}>
                                    {alert.status}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">{t.timestamp}</p>
                                <p className="text-gray-800">{new Date(alert.timestamp).toLocaleString()}</p>
                            </div>
                            {alert.assignedToName && (
                                <div>
                                    <p className="text-sm text-gray-500">Assigned To</p>
                                    <p className="font-semibold text-gray-800">{alert.assignedToName}</p>
                                    {alert.responderStatusAtAcceptance && (
                                        <p className="text-xs text-gray-600">Status at acceptance: <span className="font-medium">{alert.responderStatusAtAcceptance}</span></p>
                                    )}
                                </div>
                            )}
                            {alert.message && (
                                <div>
                                    <p className="text-sm text-gray-500">{t.message}</p>
                                    <p className="text-gray-800 italic bg-orange-50 p-2 rounded">"{alert.message}"</p>
                                </div>
                            )}
                        </div>

                        {triggerUser && (
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h4 className="font-bold text-lg mb-3 flex items-center"><UserCircleIcon /> User Profile Snapshot</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <img src={triggerUser.avatar} alt={triggerUser.name} className="w-12 h-12 rounded-full mr-3" />
                                        <div>
                                            <p className="font-semibold">{triggerUser.name}</p>
                                            <p className="text-sm text-gray-500">{triggerUser.role}</p>
                                        </div>
                                    </div>
                                    {triggerUser.emergencyContacts && triggerUser.emergencyContacts.length > 0 && (
                                        <div>
                                            <h5 className="font-semibold text-sm mb-1">Emergency Contacts</h5>
                                            <div className="space-y-1 text-sm">
                                                {triggerUser.emergencyContacts.map(c => (
                                                    <div key={c.id} className="flex items-center"><PhoneIcon /> {c.name} - {c.phone}</div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {triggerUser.sosHistory && (
                                         <div>
                                            <h5 className="font-semibold text-sm mb-1">Alert History</h5>
                                            <p className="text-sm flex items-center"><HistoryIcon /> {triggerUser.sosHistory.length} prior SOS alert(s) logged.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Map */}
                    <div>
                         <h4 className="font-semibold mb-2">{t.location}</h4>
                        <div className="aspect-square bg-gray-200 rounded-lg relative overflow-hidden">
                            <img src="https://i.imgur.com/3Z3tV8C.png" alt="Map of Kumbh Mela area" className="w-full h-full object-cover"/>
                            {alert.locationCoords ? (
                                <div className="absolute" style={{ top: `${alert.locationCoords.lat}%`, left: `${alert.locationCoords.lng}%`, transform: 'translate(-50%, -100%)' }}>
                                    <div className="relative flex flex-col items-center">
                                    <LocationPinIcon />
                                    <div className="bg-white text-sm px-2 py-1 rounded-full shadow-lg mt-1 whitespace-nowrap">{alert.userName}</div>
                                    </div>
                                </div>
                            ) : (
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                    <p className="text-white bg-red-500 p-3 rounded-lg">Location coordinates not available.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                 {aiSuggestion && (
                    <div className="bg-blue-50/50 p-4 rounded-lg mt-4 border border-blue-200 animate-fade-in">
                        <h4 className="font-semibold mb-2 text-blue-700 flex items-center"><SparklesIcon/>{t_auth.aiResourceSuggestion.suggestion}</h4>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{aiSuggestion}</p>
                    </div>
                 )}
                 {canUpdate && (
                    <div className="bg-gray-100 p-4 rounded-lg mt-4">
                        <h4 className="font-semibold mb-2">{t.updateAlert}</h4>
                        <div className="flex flex-col md:flex-row gap-4 items-center">
                            <select 
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value as SosAlert['status'])}
                                className="w-full md:w-auto flex-grow rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                            >
                                <option value="Broadcasted">Broadcasted</option>
                                <option value="Accepted">Accepted</option>
                                <option value="Responded">Responded</option>
                                <option value="Resolved">Resolved</option>
                            </select>
                            <select 
                                value={assignedTo}
                                onChange={(e) => setAssignedTo(e.target.value)}
                                className="w-full md:w-auto flex-grow rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                            >
                                <option value="">{t.unassigned}</option>
                                {assignableUsers.map(u => <option key={u.id} value={`${u.id},${u.name}`}>{u.name} ({u.role})</option>)}
                            </select>
                            <Button onClick={handleUpdate} className="w-full md:w-auto">
                                {t.saveChanges}
                            </Button>
                        </div>
                    </div>
                )}
                 <div className="mt-6 border-t pt-4 flex flex-wrap justify-end gap-2">
                    {canSuggest && !aiSuggestion && (
                        <Button onClick={handleGetSuggestion} variant="secondary" disabled={isSuggesting}>
                            {isSuggesting ? <Spinner size="sm" /> : t_auth.aiResourceSuggestion.getSuggestion}
                        </Button>
                    )}
                    <Button onClick={onClose} variant="secondary">Close</Button>
                </div>
            </div>
        </Modal>
    );
};
