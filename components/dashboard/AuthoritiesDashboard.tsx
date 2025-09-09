import React, { useState, useMemo } from 'react';
import { Card } from '../ui/Card';
import { useLocalization } from '../../hooks/useLocalization';
import { MOCK_LOST_FOUND_REPORTS, MOCK_SOS_ALERTS } from '../../data/mockData';
import { DEMO_USERS } from '../../constants';
import { LostFoundReport, User, UserRole, SosAlert } from '../../types';
import ReportDetailsModal from './ReportDetailsModal';
import { Button } from '../ui/Button';

// --- ICONS ---
const ChartBarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-3-5.197m0 0A7.963 7.963 0 0112 4.354a7.963 7.963 0 013 3.197m-6 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 003-5.197" /></svg>;
const ExclamationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
const UserGroupIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;

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

const AuthorityMapView: React.FC<{
    reports: LostFoundReport[];
    sosAlerts: (SosAlert & { locationCoords: { lat: number; lng: number } })[];
    personnel: User[];
    onSelectReport: (report: LostFoundReport) => void;
}> = ({ reports, sosAlerts, personnel, onSelectReport }) => {
    const { translations } = useLocalization();
    const t = translations.dashboard.authorities.map;

    const Pin: React.FC<{ item: any; type: 'report' | 'sos' | 'personnel' }> = ({ item, type }) => {
        let pinStyles = {
            report: { color: 'text-yellow-500', label: item.personName || item.itemName },
            sos: { color: 'text-red-500 animate-ping', label: t.sos },
            personnel: { color: 'text-green-500', label: item.name?.split(' ')[0] || t.personnel },
        };
        const style = pinStyles[type];

        return (
            <div
                className="absolute"
                style={{ top: `${item.locationCoords.lat}%`, left: `${item.locationCoords.lng}%`, transform: 'translate(-50%, -100%)' }}
                onClick={() => type === 'report' && onSelectReport(item)}
            >
                <div className={`relative flex flex-col items-center ${type === 'report' ? 'cursor-pointer group' : ''}`}>
                    {type === 'sos' && <div className={`absolute h-8 w-8 rounded-full bg-red-400 opacity-75 ${style.color}`}></div>}
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 drop-shadow-lg transition-transform ${type === 'report' ? 'group-hover:scale-110' : ''} ${style.color}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 20l-4.95-5.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <div className="bg-white text-xs px-1.5 py-0.5 rounded-full shadow -mt-1 whitespace-nowrap">{style.label}</div>
                </div>
            </div>
        );
    };

    return (
        <Card className="h-full">
            <h3 className="text-xl font-bold mb-4">{t.title}</h3>
            <div className="aspect-video bg-gray-200 rounded-lg relative overflow-hidden">
                <img src="https://i.imgur.com/3Z3tV8C.png" alt="Map" className="w-full h-full object-cover" />
                {reports.filter(r => r.locationCoords).map(r => <Pin key={`rpt-${r.id}`} item={r} type="report" />)}
                {sosAlerts.filter(a => a.locationCoords).map(a => <Pin key={`sos-${a.id}`} item={a} type="sos" />)}
                {/* Mocking personnel locations for demo */}
                {personnel.map((p, i) => <Pin key={`per-${p.id}`} item={{...p, locationCoords: {lat: 10 + i * 15, lng: 10 + i * 15} }} type="personnel" />)}
            </div>
        </Card>
    );
};

const AlertsPanel: React.FC<{
    reports: LostFoundReport[];
    sosAlerts: (SosAlert & { userName: string })[];
    personnel: User[];
    onSelectReport: (report: LostFoundReport) => void;
}> = ({ reports, sosAlerts, personnel, onSelectReport }) => {
    const [activeTab, setActiveTab] = useState('alerts');
    const { translations } = useLocalization();
    const t = translations.dashboard.authorities.panel;

    const allAlerts = useMemo(() => [
        ...reports.map(r => ({ ...r, kind: 'report' })),
        ...sosAlerts.map(a => ({ ...a, kind: 'sos' })),
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()), [reports, sosAlerts]);
    
    const getAlertTitle = (alert: any): string => {
        if (alert.kind === 'sos') return `${t.sos}: ${alert.userName}`;
        const report = alert as LostFoundReport;
        if (report.category === 'Person') return `${t.missingPerson}: ${report.personName}`;
        return `${t.report}: ${report.itemName}`;
    };

    return (
        <Card className="h-full flex flex-col">
            <div>
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-6">
                        <button onClick={() => setActiveTab('alerts')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'alerts' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>{t.alerts} ({allAlerts.length})</button>
                        <button onClick={() => setActiveTab('personnel')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'personnel' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>{t.personnel} ({personnel.length})</button>
                    </nav>
                </div>
            </div>
            <div className="flex-grow overflow-y-auto mt-4 pr-2">
                {activeTab === 'alerts' && (
                    <div className="space-y-3">
                        {allAlerts.length > 0 ? allAlerts.map(alert => (
                            <div key={`${alert.kind}-${alert.id}`} className={`p-3 rounded-lg border-l-4 ${
                                alert.kind === 'sos' ? 'bg-red-50 border-red-500' :
                                (alert as LostFoundReport).category === 'Person' ? 'bg-orange-50 border-orange-500' :
                                'bg-yellow-50 border-yellow-500'
                            }`}>
                                <p className="font-bold text-sm">{getAlertTitle(alert)}</p>
                                <p className="text-xs text-gray-600 truncate">{alert.kind === 'report' ? (alert as any).description : `Triggered at ${new Date(alert.timestamp).toLocaleTimeString()}`}</p>
                                <div className="flex gap-2 mt-2">
                                    {alert.kind === 'report' && <Button onClick={() => onSelectReport(alert as LostFoundReport)} variant="secondary" className="text-xs py-1 px-2">{t.viewDetails}</Button>}
                                    <Button variant="secondary" className="text-xs py-1 px-2">{t.acknowledge}</Button>
                                </div>
                            </div>
                        )) : <p className="text-gray-500 text-center py-8">{t.noAlerts}</p>}
                    </div>
                )}
                {activeTab === 'personnel' && (
                     <div className="space-y-3">
                         {personnel.length > 0 ? personnel.map(p => {
                             const assignment = MOCK_LOST_FOUND_REPORTS.find(r => r.assignedToId === p.id && r.status !== 'Resolved');
                             return (
                                <div key={p.id} className="flex items-center bg-gray-50 p-2 rounded-lg">
                                    <img src={p.avatar} alt={p.name} className="w-10 h-10 rounded-full mr-3" />
                                    <div className="flex-grow">
                                        <p className="font-medium text-sm text-gray-800">{p.name}</p>
                                        <p className={`text-xs ${assignment ? 'text-blue-600' : 'text-green-600'}`}>
                                            {assignment ? `${t.status.assigned} ${assignment.id}` : t.status.available}
                                        </p>
                                    </div>
                                </div>
                             )
                         }) : <p className="text-gray-500 text-center py-8">{t.noPersonnel}</p>}
                     </div>
                )}
            </div>
        </Card>
    );
}

/**
 * Authorities Dashboard Component.
 * This dashboard is designed for security and management personnel. It focuses on
 * high-priority information like crowd density, active SOS alerts, and reports of
 * missing persons, enabling quick and informed responses.
 */
const AuthoritiesDashboard: React.FC = () => {
    const { translations } = useLocalization();
    const t = translations.dashboard.authorities;
    const [selectedReport, setSelectedReport] = useState<LostFoundReport | null>(null);

    const activeReports = useMemo(() => MOCK_LOST_FOUND_REPORTS.filter(r => r.status !== 'Resolved'), []);
    const highPriorityReports = useMemo(() => activeReports.filter(r => r.category === 'Person'), [activeReports]);
    const activeSosAlerts = useMemo(() => MOCK_SOS_ALERTS.filter(a => a.status !== 'Resolved'), []);
    const activePersonnel = useMemo(() => DEMO_USERS.filter(u => u.status === 'Active' && (u.role === UserRole.AUTHORITY || u.role === UserRole.VOLUNTEER)), []);

    return (
        <>
            <div className="space-y-6">
                <h2 className="text-3xl font-bold">{t.title}</h2>
                
                {/* KPIs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title={t.kpis.activeReports} value={activeReports.length} icon={<ChartBarIcon />} />
                    <StatCard title={t.kpis.missingPersons} value={highPriorityReports.length} icon={<UsersIcon />} />
                    <StatCard title={t.kpis.sosAlerts} value={activeSosAlerts.length} icon={<ExclamationIcon />} />
                    <StatCard title={t.kpis.personnel} value={activePersonnel.length} icon={<UserGroupIcon />} />
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" style={{ height: '70vh' }}>
                    <div className="lg:col-span-2">
                        <AuthorityMapView reports={activeReports} sosAlerts={activeSosAlerts} personnel={activePersonnel} onSelectReport={setSelectedReport} />
                    </div>
                    <div className="lg:col-span-1">
                        <AlertsPanel reports={activeReports} sosAlerts={activeSosAlerts} personnel={activePersonnel} onSelectReport={setSelectedReport} />
                    </div>
                </div>
            </div>
            <ReportDetailsModal 
                isOpen={!!selectedReport}
                onClose={() => setSelectedReport(null)}
                report={selectedReport}
                assignableUsers={activePersonnel}
                // onUpdateReport can be passed here if authorities can update reports
            />
        </>
    );
};

export default AuthoritiesDashboard;