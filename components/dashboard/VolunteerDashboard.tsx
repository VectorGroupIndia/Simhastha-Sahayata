import React, { useState, useMemo } from 'react';
import { Card } from '../ui/Card';
import { useLocalization } from '../../hooks/useLocalization';
import { MOCK_LOST_FOUND_REPORTS } from '../../data/mockData';
import { LostFoundReport } from '../../types';
import ReportDetailsModal from './ReportDetailsModal';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { useToast } from '../../hooks/useToast';

// --- ICONS ---
const ClipboardListIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
const BellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

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

const ReportCard: React.FC<{ report: LostFoundReport; onSelect: () => void; onAccept?: () => void; translations: any }> = ({ report, onSelect, onAccept, translations }) => {
    const getStatusClasses = (status: LostFoundReport['status']) => {
        switch (status) {
            case 'Open': return 'border-yellow-500 bg-yellow-50';
            case 'In Progress': return 'border-blue-500 bg-blue-50';
            case 'Resolved': return 'border-green-500 bg-green-50';
            default: return 'border-gray-300 bg-gray-50';
        }
    };
    
    return (
        <div className={`p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4 border-l-4 ${getStatusClasses(report.status)}`}>
            <div className="flex items-center">
                {report.imageUrl && (
                    <img src={report.imageUrl} alt={report.description} className="w-16 h-16 rounded-lg mr-4 object-cover" />
                )}
                <div className="flex-grow">
                    <p className="font-bold text-gray-800">{report.personName || report.itemName}</p>
                    <p className="text-sm text-gray-600">Last Seen: {report.lastSeen}</p>
                    <p className="text-sm text-gray-500 truncate max-w-sm">{report.description}</p>
                </div>
            </div>
            <div className="flex gap-2 self-end md:self-center flex-shrink-0">
                <Button onClick={onSelect} variant="secondary" className="text-sm py-1 px-3">{translations.viewDetails}</Button>
                {onAccept && <Button onClick={onAccept} className="text-sm py-1 px-3">{translations.acceptTask}</Button>}
            </div>
        </div>
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
    const { user } = useAuth();
    const { addToast } = useToast();
    const t = translations.dashboard.volunteer;

    const [reports, setReports] = useState<LostFoundReport[]>(MOCK_LOST_FOUND_REPORTS);
    const [activeTab, setActiveTab] = useState('assignments');
    const [selectedReport, setSelectedReport] = useState<LostFoundReport | null>(null);

    const myAssignments = useMemo(() =>
        reports.filter(r => r.assignedToId === user?.id && r.status !== 'Resolved'),
        [reports, user]
    );

    const nearbyAlerts = useMemo(() =>
        reports.filter(r => !r.assignedToId && r.status === 'Open' && r.category === 'Person'),
        [reports]
    );
    
    const resolvedTodayCount = useMemo(() =>
        reports.filter(r => {
            if (r.assignedToId !== user?.id || r.status !== 'Resolved') return false;
            // A more robust date check would be needed in a real app (e.g., using a library)
            // but this is sufficient for the demo.
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
        // Persist to mock data to simulate backend update
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

    const renderContent = () => {
        if (activeTab === 'assignments') {
            return myAssignments.length > 0 ? (
                <div className="space-y-4">
                    {myAssignments.map(report => (
                        <ReportCard
                            key={report.id}
                            report={report}
                            onSelect={() => setSelectedReport(report)}
                            translations={t}
                        />
                    ))}
                </div>
            ) : <p className="text-center text-gray-500 py-10">{t.noAssignments}</p>;
        }
        if (activeTab === 'nearby') {
            return nearbyAlerts.length > 0 ? (
                <div className="space-y-4">
                    {nearbyAlerts.map(report => (
                        <ReportCard
                            key={report.id}
                            report={report}
                            onSelect={() => setSelectedReport(report)}
                            onAccept={() => handleAcceptTask(report)}
                            translations={t}
                        />
                    ))}
                </div>
            ) : <p className="text-center text-gray-500 py-10">{t.noNearby}</p>;
        }
    };


    return (
        <>
            <div className="space-y-6">
                <h2 className="text-3xl font-bold">{t.title}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard title={t.kpis.myAssignments} value={myAssignments.length} icon={<ClipboardListIcon />} />
                    <StatCard title={t.kpis.nearbyAlerts} value={nearbyAlerts.length} icon={<BellIcon />} />
                    <StatCard title={t.kpis.resolvedToday} value={resolvedTodayCount} icon={<CheckCircleIcon />} />
                </div>
                
                <Card>
                    <div className="border-b border-gray-200 mb-4">
                        <nav className="-mb-px flex space-x-6">
                            <button onClick={() => setActiveTab('assignments')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'assignments' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                                {t.tabs.assignments} ({myAssignments.length})
                            </button>
                             <button onClick={() => setActiveTab('nearby')} className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'nearby' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                                {t.tabs.nearby} ({nearbyAlerts.length})
                            </button>
                        </nav>
                    </div>
                    <div className="animate-fade-in">
                        {renderContent()}
                    </div>
                </Card>
            </div>
            <ReportDetailsModal 
                isOpen={!!selectedReport}
                onClose={() => setSelectedReport(null)}
                report={selectedReport}
                onUpdateReport={handleUpdateReport}
            />
        </>
    );
};

export default VolunteerDashboard;