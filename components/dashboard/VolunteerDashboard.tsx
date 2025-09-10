import React, { useState, useMemo } from 'react';
import { Card } from '../ui/Card';
import { useLocalization } from '../../hooks/useLocalization';
import { MOCK_LOST_FOUND_REPORTS, MOCK_SOS_ALERTS } from '../../data/mockData';
import { LostFoundReport, User, SosAlert, UserRole } from '../../types';
import ReportDetailsModal from './ReportDetailsModal';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { useToast } from '../../hooks/useToast';
import { BroadcastAlertModal } from './BroadcastAlertModal';
import { SosDetailsModal } from './SosDetailsModal';

// --- ICONS ---
const ClipboardListIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
const BellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ListIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>;
const MapIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.95 2.006a.75.75 0 00-.9-.053l-4.25 2.5a.75.75 0 00-.45.698v10.198l-2.022-1.179a.75.75 0 00-.956.114l-2 2.5a.75.75 0 00.114.956l2.022 1.179v.699a.75.75 0 00.45.698l4.25 2.5a.75.75 0 00.9-.053l4.25-2.5a.75.75 0 00.45-.698V6.302l2.022 1.179a.75.75 0 00.956-.114l2-2.5a.75.75 0 00-.114-.956L14.022 3.03v-.699a.75.75 0 00-.45-.698l-4.25-2.5a.75.75 0 00-.372 0zM12.75 16.23v-9.69l-4.5 2.64v9.69l4.5-2.64z" clipRule="evenodd" /></svg>;
const BroadcastIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.636 5.636a9 9 0 0112.728 0M8.464 15.536a5 5 0 010-7.072" /></svg>;


// --- Helper Components ---
const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <Card className="flex items-center p-4">
        <div className="mr-4">{icon}</div>
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </Card>
);

const AlertCard: React.FC<{ alert: LostFoundReport | SosAlert; onSelectItem: (item: any) => void; onAcceptTask?: (item: LostFoundReport) => void; onAcceptSos?: (item: SosAlert) => void; translations: any }> = ({ alert, onSelectItem, onAcceptTask, onAcceptSos, translations }) => {
    const isReport = 'reportedById' in alert;
    const isSos = 'userId' in alert && !isReport;

    const getBorderColor = () => {
        if (isReport) return 'border-orange-500 bg-orange-50'; // Nearby Alert
        if (isSos) return 'border-red-500 bg-red-50'; // SOS Alert
        return 'border-gray-300 bg-gray-50';
    };

    const title = isReport ? (alert as LostFoundReport).personName || (alert as LostFoundReport).itemName : `SOS: ${(alert as SosAlert).userName}`;
    const description = isReport ? (alert as LostFoundReport).description : (alert as SosAlert).message;
    const imageUrl = isReport ? (alert as LostFoundReport).imageUrl : null;
    const alertType = isReport ? translations.alertTypes.nearby : `SOS from ${(alert as SosAlert).userRole}`;

    return (
        <div className={`p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 ${getBorderColor()}`}>
            <div className="flex items-center">
                {imageUrl && (
                    <img src={imageUrl} alt={description} className="w-16 h-16 rounded-lg mr-4 object-cover" />
                )}
                <div className="flex-grow">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{alertType}</p>
                    <p className="font-bold text-gray-800">{title}</p>
                    <p className="text-sm text-gray-600 truncate max-w-sm italic">"{description}"</p>
                </div>
            </div>
            <div className="flex gap-2 self-end md:self-center flex-shrink-0">
                <Button onClick={() => onSelectItem(alert)} variant="secondary" className="text-sm py-1 px-3">{translations.viewDetails}</Button>
                {isReport && onAcceptTask && <Button onClick={() => onAcceptTask(alert as LostFoundReport)} className="text-sm py-1 px-3">{translations.acceptTask}</Button>}
                {isSos && onAcceptSos && <Button onClick={() => onAcceptSos(alert as SosAlert)} className="text-sm py-1 px-3">{translations.acceptTask}</Button>}
            </div>
        </div>
    );
};

// --- Map View Components ---
const MOCK_CROWD_ZONES = [
  { id: 'zone1', path: 'M 0 0 H 60 V 50 H 0 Z', level: 'high' }, 
  { id: 'zone2', path: 'M 60 0 H 100 V 60 H 60 Z', level: 'low' },
  { id: 'zone3', path: 'M 0 50 H 40 V 100 H 0 Z', level: 'extreme' },
  { id: 'zone4', path: 'M 40 50 H 100 V 100 H 40 Z', level: 'moderate' },
];

const CrowdDensityLayer: React.FC = () => {
    const getColor = (level: string) => {
        switch (level) {
            case 'low': return '#34D399';
            case 'moderate': return '#FBBF24';
            case 'high': return '#F97316';
            case 'extreme': return '#EF4444';
            default: return 'transparent';
        }
    };
    return (
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* FIX: Changed `level` to `zone.level` to correctly pass the level of each zone. */}
            {MOCK_CROWD_ZONES.map(zone => <path key={zone.id} d={zone.path} fill={getColor(zone.level)} fillOpacity="0.3" stroke={getColor(zone.level)} strokeWidth="0.2" strokeOpacity="0.5" />)}
        </svg>
    );
};

const CrowdDensityLegend: React.FC = () => {
    const { translations } = useLocalization();
    const t = translations.dashboard.authorities.map;
    const legendItems = [
        { level: t.densityLevels.low, color: 'bg-green-500/70' },
        { level: t.densityLevels.moderate, color: 'bg-yellow-500/70' },
        { level: t.densityLevels.high, color: 'bg-orange-500/70' },
        { level: t.densityLevels.extreme, color: 'bg-red-500/70' },
    ];
    return (
        <div className="absolute bottom-2 right-2 bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-md text-xs">
            <h5 className="font-bold mb-1">{t.crowdDensity}</h5>
            {legendItems.map(item => <div key={item.level} className="flex items-center"><div className={`w-3 h-3 rounded-full mr-1.5 ${item.color}`}></div><span>{item.level}</span></div>)}
        </div>
    );
};

const VolunteerMapView: React.FC<{ user: User; assignments: (LostFoundReport | SosAlert)[]; alerts: LostFoundReport[]; sosAlerts: SosAlert[]; onSelectItem: (item: LostFoundReport | SosAlert) => void; }> = ({ user, assignments, alerts, sosAlerts, onSelectItem }) => {
    const { translations } = useLocalization();
    const volunteerLocation = user.locationCoords || { lat: 50, lng: 50 };
    const radiusInPixels = (user.settings?.workingRadius || 1) * 10;

    const Pin: React.FC<{ item: LostFoundReport | SosAlert; type: 'assignment' | 'alert' | 'sos' }> = ({ item, type }) => {
        if (!item.locationCoords) return null;
        const pinColors = { assignment: 'blue', alert: 'orange', sos: 'red' };
        const pinColor = pinColors[type];
        const isSos = type === 'sos';
        // FIX: Used the `type` prop to discriminate the union and safely access the correct name property from either SosAlert or LostFoundReport.
        const name = isSos ? (item as SosAlert).userName : (item as LostFoundReport).personName || (item as LostFoundReport).itemName;

        return (
            <div className="absolute" style={{ top: `${item.locationCoords.lat}%`, left: `${item.locationCoords.lng}%`, transform: 'translate(-50%, -100%)' }} onClick={() => onSelectItem(item)}>
                <div className="relative flex flex-col items-center cursor-pointer group">
                    {isSos && <div className={`absolute h-8 w-8 rounded-full bg-red-400 opacity-75 animate-ping`}></div>}
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 text-${pinColor}-500 drop-shadow-lg transition-transform group-hover:scale-110`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 20l-4.95-5.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                    <div className="bg-white text-xs px-1.5 py-0.5 rounded-full shadow -mt-1 whitespace-nowrap">{name}</div>
                </div>
            </div>
        );
    };

    return (
        <Card>
            <div className="aspect-video bg-gray-200 rounded-lg relative overflow-hidden">
                <img src="https://i.imgur.com/3Z3tV8C.png" alt="Map" className="w-full h-full object-cover" />
                <CrowdDensityLayer />
                <div className="absolute" style={{ top: `${volunteerLocation.lat}%`, left: `${volunteerLocation.lng}%`, transform: 'translate(-50%, -50%)' }}>
                    <div className="rounded-full border-2 border-blue-500 border-dashed bg-blue-500/10" style={{ width: `${radiusInPixels * 2}px`, height: `${radiusInPixels * 2}px` }} />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"><div className="relative flex flex-col items-center"><div className="w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-lg animate-pulse"></div><div className="bg-white text-xs px-1.5 py-0.5 rounded-full shadow whitespace-nowrap -mt-1">{translations.dashboard.volunteer.yourLocation}</div></div></div>
                </div>
                {assignments.filter(item => item.locationCoords).map(item => <Pin key={`asgn-${item.id}`} item={item} type="assignment" />)}
                {alerts.filter(r => r.locationCoords).map(r => <Pin key={`alrt-${r.id}`} item={r} type="alert" />)}
                {sosAlerts.filter(s => s.locationCoords).map(s => <Pin key={`sos-${s.id}`} item={s} type="sos" />)}
                <CrowdDensityLegend />
            </div>
        </Card>
    );
};

/**
 * Volunteer Dashboard Component.
 * This view is tailored for on-the-ground volunteers. It presents a clear, actionable
 * list of tasks, such as responding to SOS alerts or assisting with missing person reports
 * in their vicinity.
 */
const VolunteerDashboard: React.FC = () => {
    const { translations } = useLocalization();
    const { user, updateUser } = useAuth();
    const { addToast } = useToast();
    const t = translations.dashboard.volunteer;

    const [reports, setReports] = useState<LostFoundReport[]>(MOCK_LOST_FOUND_REPORTS);
    const [activeTab, setActiveTab] = useState('liveAlerts');
    const [selectedItem, setSelectedItem] = useState<LostFoundReport | SosAlert | null>(null);
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
    const [isBroadcastModalOpen, setBroadcastModalOpen] = useState(false);


    const myAssignments = useMemo(() => {
        const assignedReports = reports.filter(r => r.assignedToId === user?.id && r.status !== 'Resolved');
        const assignedSos = MOCK_SOS_ALERTS.filter(a => a.assignedToId === user?.id && a.status !== 'Resolved');
        return [...assignedReports, ...assignedSos].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [reports, user]);

    const liveAlerts = useMemo(() => {
        const nearbyReports = reports.filter(r => !r.assignedToId && r.status === 'Open' && r.priority === 'Critical' && r.category === 'Person');
        const pilgrimSosAlerts = MOCK_SOS_ALERTS.filter(
            a => a.status === 'Broadcasted' && a.userRole === UserRole.PILGRIM
        );
        return [...nearbyReports, ...pilgrimSosAlerts].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [reports]);
    
    const resolvedTodayCount = useMemo(() =>
        reports.filter(r => {
            if (r.assignedToId !== user?.id || r.status !== 'Resolved') return false;
            const reportDate = new Date(r.timestamp);
            const today = new Date();
            return reportDate.getFullYear() === today.getFullYear() &&
                   reportDate.getMonth() === today.getMonth() &&
                   reportDate.getDate() === today.getDate();
        }).length,
        [reports, user]
    );

    const handleUpdateReport = (reportId: string, updates: Partial<LostFoundReport>) => {
        const updatedReports = reports.map(r => r.id === reportId ? { ...r, ...updates } : r);
        setReports(updatedReports);
        const reportIndex = MOCK_LOST_FOUND_REPORTS.findIndex(r => r.id === reportId);
        if (reportIndex !== -1) {
            MOCK_LOST_FOUND_REPORTS[reportIndex] = { ...MOCK_LOST_FOUND_REPORTS[reportIndex], ...updates };
        }
        addToast(t.statusUpdated, 'success');
    };

    const handleAcceptTask = (report: LostFoundReport) => {
        if (!user) return;
        handleUpdateReport(report.id, {
            assignedToId: user.id,
            assignedToName: user.name,
            status: 'In Progress'
        });
        addToast(t.taskAccepted, 'success');
    };

    const handleAcceptSos = (alert: SosAlert) => {
        if (!user) return;
        const alertIndex = MOCK_SOS_ALERTS.findIndex(a => a.id === alert.id);
        if (alertIndex !== -1) {
            MOCK_SOS_ALERTS[alertIndex] = {
                ...MOCK_SOS_ALERTS[alertIndex],
                status: 'Accepted',
                assignedToId: user.id,
                assignedToName: user.name,
            };
            setReports([...reports]);
            addToast("SOS Alert accepted. It's now in your assignments.", 'success');
        }
    };


    const handleConfirmBroadcast = (message: string) => {
        if (!user) return;

        const volunteerLocation = user.locationCoords || { lat: 50 + Math.random() * 10, lng: 50 + Math.random() * 10 };

        const newAlert: SosAlert = {
            id: Date.now(),
            userId: user.id,
            userName: user.name,
            userRole: user.role,
            timestamp: new Date().toISOString(),
            status: 'Broadcasted',
            locationCoords: volunteerLocation,
            message: message,
        };

        MOCK_SOS_ALERTS.unshift(newAlert);
        
        addToast(t.broadcastModal.success, 'success');
        setBroadcastModalOpen(false);
    };

    const handleAvailabilityChange = (status: 'Active' | 'On Break') => {
      if (!user) return;
      
      const baseSettings = user.settings || {
          notifications: false, powerButtonSos: false, voiceNav: false,
      };
      
      updateUser({ 
          settings: { 
              ...baseSettings, 
              availabilityStatus: status 
          } 
      });
      addToast(`Your status is now ${status}.`, 'info');
    };

    const isAvailable = user?.settings?.availabilityStatus !== 'On Break';

    const renderContent = () => {
        const tabs = {
            assignments: myAssignments.length > 0 ? (
                <div className="space-y-4">
                    {myAssignments.map(item => (
                         <AlertCard key={`${'reportedById' in item ? 'report' : 'sos'}-${item.id}`} alert={item} onSelectItem={setSelectedItem} translations={t} />
                    ))}
                </div>
            ) : <p className="text-center text-gray-500 py-10">{t.noAssignments}</p>,

            liveAlerts: !isAvailable ? (
                <div className="text-center py-10">
                    <p className="font-semibold text-lg">{t.onBreakTitle}</p>
                    <p className="text-gray-500">{t.onBreakText}</p>
                </div>
            ) : liveAlerts.length > 0 ? (
                <div className="space-y-4">
                    {liveAlerts.map(alert => (
                        <AlertCard 
                            key={'reportedById' in alert ? `report-${alert.id}` : `sos-${alert.id}`} 
                            alert={alert} 
                            onSelectItem={setSelectedItem}
                            onAcceptTask={'reportedById' in alert ? handleAcceptTask : undefined}
                            onAcceptSos={'userId' in alert && !('reportedById' in alert) ? handleAcceptSos : undefined}
                            translations={t} 
                        />
                    ))}
                </div>
            ) : <p className="text-center text-gray-500 py-10">{t.noNearby}</p>,
        };
        return tabs[activeTab as keyof typeof tabs];
    };


    return (
        <>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h2 className="text-3xl font-bold">{t.title}</h2>
                    <div className="flex flex-wrap items-center gap-4">
                        <div>
                            <span className="text-sm font-medium text-gray-600 mr-2">{t.availabilityLabel}</span>
                            <div className="inline-flex rounded-md shadow-sm bg-gray-100 p-1">
                                <button onClick={() => handleAvailabilityChange('Active')} className={`px-4 py-1 text-sm font-medium rounded-md ${isAvailable ? 'bg-white text-green-600 shadow' : 'text-gray-600'}`}>
                                    {t.kpis.active}
                                </button>
                                <button onClick={() => handleAvailabilityChange('On Break')} className={`px-4 py-1 text-sm font-medium rounded-md ${!isAvailable ? 'bg-white text-orange-600 shadow' : 'text-gray-600'}`}>
                                    {t.kpis.onBreak}
                                </button>
                            </div>
                        </div>
                        <Button onClick={() => setBroadcastModalOpen(true)} variant="danger" className="flex items-center">
                            <BroadcastIcon /> {t.broadcastAlert}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard title={t.kpis.myAssignments} value={myAssignments.length} icon={<ClipboardListIcon />} />
                    <StatCard title={t.kpis.nearbyAlerts} value={isAvailable ? liveAlerts.length : 0} icon={<BellIcon />} />
                    <StatCard title={t.kpis.resolvedToday} value={resolvedTodayCount} icon={<CheckCircleIcon />} />
                </div>
                
                <Card>
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                        <div className="border-b border-gray-200 w-full sm:w-auto">
                           <nav className="-mb-px flex space-x-6">
                                <button onClick={() => setActiveTab('assignments')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'assignments' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>{t.tabs.assignments} ({myAssignments.length})</button>
                                <button 
                                    onClick={() => setActiveTab('liveAlerts')}
                                    disabled={!isAvailable}
                                    className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'liveAlerts' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'} ${!isAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {t.tabs.liveAlerts} ({isAvailable ? liveAlerts.length : 0})
                                </button>
                           </nav>
                        </div>
                        <div className="inline-flex rounded-md shadow-sm bg-gray-100 p-1 flex-shrink-0">
                            <button onClick={() => setViewMode('list')} className={`px-4 py-2 text-sm font-medium rounded-md flex items-center ${viewMode === 'list' ? 'bg-white text-orange-600 shadow' : 'text-gray-600'}`}><ListIcon/> {t.listView}</button>
                            <button onClick={() => setViewMode('map')} className={`px-4 py-2 text-sm font-medium rounded-md flex items-center ${viewMode === 'map' ? 'bg-white text-orange-600 shadow' : 'text-gray-600'}`}><MapIcon/> {t.mapView}</button>
                        </div>
                    </div>
                    {viewMode === 'list' ? (
                       <div className="animate-fade-in">{renderContent()}</div>
                    ) : (
                       user && <VolunteerMapView user={user} assignments={myAssignments} alerts={isAvailable ? liveAlerts.filter(a => 'reportedById' in a) as LostFoundReport[] : []} sosAlerts={isAvailable ? MOCK_SOS_ALERTS.filter(s => s.status !== 'Resolved') : []} onSelectItem={setSelectedItem} />
                    )}
                </Card>
            </div>
            <ReportDetailsModal 
                isOpen={!!(selectedItem && 'reportedById' in selectedItem)}
                onClose={() => setSelectedItem(null)}
                report={selectedItem as LostFoundReport | null}
                onUpdateReport={handleUpdateReport}
            />
             <SosDetailsModal
                isOpen={!!(selectedItem && 'userId' in selectedItem && !('reportedById' in selectedItem))}
                onClose={() => setSelectedItem(null)}
                alert={selectedItem as SosAlert | null}
            />
            <BroadcastAlertModal
                isOpen={isBroadcastModalOpen}
                onClose={() => setBroadcastModalOpen(false)}
                onConfirm={handleConfirmBroadcast}
            />
        </>
    );
};

export default VolunteerDashboard;