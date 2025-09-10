import React, { useState, useMemo } from 'react';
import { Card } from '../ui/Card';
import { useLocalization } from '../../hooks/useLocalization';
import { MOCK_LOST_FOUND_REPORTS } from '../../data/mockData';
import { LostFoundReport, User, UserRole } from '../../types';
import ReportDetailsModal from './ReportDetailsModal';
import { getAiSearchResults } from '../../services/geminiService';
import { Spinner } from '../ui/Spinner';
import { DEMO_USERS } from '../../constants';
import { Button } from '../ui/Button';
import { useToast } from '../../hooks/useToast';
import { useNavigate } from 'react-router-dom';

// --- ICONS ---
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L10 17l-4 4 4-4 2.293-2.293a1 1 0 011.414 0L17 14m-5-5l2.293 2.293a1 1 0 010 1.414L10 17" /></svg>;
const DownloadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>;
const FraudIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const AiIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;


// --- HELPER COMPONENTS ---
const FilterDropdown: React.FC<{label: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, options: {value: string, label: string}[]}> = ({label, value, onChange, options}) => (
    <div className="w-full md:w-auto">
        <label htmlFor={label} className="sr-only">{label}</label>
        <select id={label} value={value} onChange={onChange} className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 py-2 pl-3 pr-8 text-base">
            {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
    </div>
);

const AIControlCenterCard: React.FC<{t: any}> = ({t}) => {
    const navigate = useNavigate();
    const aiT = t.aiDashboard.aiControlCenter;
    return (
        <Card>
            <h3 className="text-xl font-bold mb-2 flex items-center">
                <AiIcon /> {aiT.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{aiT.description}</p>
            <Button onClick={() => navigate('/ai-dashboard')} className="w-full">
                {aiT.button}
            </Button>
        </Card>
    );
};

const AdminActivityLog: React.FC<{t: any}> = ({t}) => {
    const MOCK_ACTIVITY = [
        { id: 1, action: 'Assigned RPT-1672837462 to Officer Singh.', time: '2h ago' },
        { id: 2, action: 'Suspended user Rohan Mehra.', time: '1d ago' },
        { id: 3, action: 'Resolved report RPT-2736475.', time: '1d ago' },
        { id: 4, action: 'Changed system setting: Enabled AI Image Analysis.', time: '2d ago' },
        { id: 5, action: 'Viewed report RPT-4958673.', time: '2d ago' },
    ];
    return (
        <Card>
            <h3 className="text-xl font-bold mb-4 flex items-center">
                <ClockIcon /> {t.activityLogTitle}
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {MOCK_ACTIVITY.map(act => (
                    <div key={act.id} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                        <p className="text-sm text-gray-700 dark:text-gray-300">{act.action}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-4">{act.time}</p>
                    </div>
                ))}
            </div>
        </Card>
    );
}

const FraudAnalysis: React.FC = () => {
    const { translations } = useLocalization();
    const MOCK_FRAUD_ALERTS = [
        { id: 1, text: "User 'Ravi Kumar (Pilgrim)' has filed 3 reports in the last 24 hours.", level: 'warning' },
        { id: 2, text: "Multiple reports (RPT-3847564, RPT-item-99) match the description 'Gold Ring'.", level: 'info' },
        { id: 3, text: "Report RPT-6170895 (Apple iPhone 14) has a high-value item, flagged for manual verification.", level: 'warning' },
        { id: 4, text: "Report RPT-9403128 ('Single shoe') has a low-detail description, potentially spam.", level: 'info'},
        { id: 5, text: "User 'Rohan Mehra (Pilgrim)' (Suspended) has attempted to file a new report.", level: 'critical' },
    ];
    
    const getLevelClasses = (level: string) => {
        switch (level) {
            case 'critical': return 'border-red-500 bg-red-50 text-red-800';
            case 'warning': return 'border-yellow-500 bg-yellow-50 text-yellow-800';
            default: return 'border-blue-500 bg-blue-50 text-blue-800';
        }
    }

    return (
        <Card>
            <h3 className="text-xl font-bold mb-4 flex items-center">
                <FraudIcon /> Fraud Detection Alerts
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {MOCK_FRAUD_ALERTS.map(alert => (
                    <div key={alert.id} className={`p-3 border-l-4 rounded-r-md text-sm ${getLevelClasses(alert.level)}`}>
                        {alert.text}
                    </div>
                ))}
            </div>
        </Card>
    );
};

const UserManagement: React.FC<{t: any}> = ({t}) => {
    const { addToast } = useToast();
    const [users, setUsers] = useState<User[]>(DEMO_USERS);
    const [statusFilter, setStatusFilter] = useState('all');
    const [roleFilter, setRoleFilter] = useState('all');

    // FIX: Correctly reference the nested userManagement translation object.
    const userManagementTranslations = t.dashboard.admin.userManagement;

    const handleStatusToggle = (userId: number, currentStatus: 'Active' | 'Suspended') => {
        // FIX: Explicitly type `newStatus` to prevent TypeScript from widening it to a generic `string`,
        // ensuring it matches the 'Active' | 'Suspended' type required by the User interface.
        const newStatus: 'Active' | 'Suspended' = currentStatus === 'Active' ? 'Suspended' : 'Active';
        const updatedUsers = users.map(u => u.id === userId ? { ...u, status: newStatus } : u);
        setUsers(updatedUsers);

        // Also update the mock data source to simulate persistence
        const userIndex = DEMO_USERS.findIndex(u => u.id === userId);
        if (userIndex !== -1) {
            DEMO_USERS[userIndex].status = newStatus;
        }
        addToast(userManagementTranslations.userUpdated, 'success');
    };

    const filteredUsers = useMemo(() => users.filter(u => 
        (statusFilter === 'all' || u.status === statusFilter) &&
        (roleFilter === 'all' || u.role === roleFilter)
    ), [users, statusFilter, roleFilter]);

    const statusOptions = [{value: 'all', label: userManagementTranslations.statusFilterAll}, {value: 'Active', label: userManagementTranslations.statusFilterActive}, {value: 'Suspended', label: userManagementTranslations.statusFilterSuspended}];
    const roleOptions = [{value: 'all', label: 'All Roles'}, ...Object.values(UserRole).map(r => ({value: r, label: r}))];

    return (
        <Card>
            <h3 className="text-xl font-bold mb-4">{userManagementTranslations.title}</h3>
            <div className="flex flex-col sm:flex-row gap-2 mb-4">
                <FilterDropdown label="Filter by Status" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} options={statusOptions}/>
                <FilterDropdown label="Filter by Role" value={roleFilter} onChange={e => setRoleFilter(e.target.value)} options={roleOptions}/>
            </div>
            <div className="overflow-y-auto max-h-96 pr-2">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="p-2 text-left text-xs font-medium uppercase tracking-wider">{t.auth.nameLabel}</th>
                            <th scope="col" className="p-2 text-left text-xs font-medium uppercase tracking-wider">{userManagementTranslations.status}</th>
                            <th scope="col" className="p-2 text-left text-xs font-medium uppercase tracking-wider">{userManagementTranslations.actions}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id} className="border-b">
                                <td className="p-2">
                                    <p className="font-medium">{user.name}</p>
                                    <p className="text-xs text-gray-500">{user.role}</p>
                                </td>
                                <td className="p-2">
                                    <span className={`px-2 py-0.5 text-xs rounded-full ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="p-2">
                                    <Button onClick={() => handleStatusToggle(user.id, user.status)} variant={user.status === 'Active' ? 'danger' : 'primary'} className="text-xs py-1 px-2">
                                        {user.status === 'Active' ? 'Suspend' : 'Activate'}
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    )
};


/**
 * Admin Dashboard Component.
 * This is the central control panel for administrators. It provides an overview of
 * system health and allows for interactive management of all lost & found reports.
 */
const AdminDashboard: React.FC = () => {
    const { translations } = useLocalization();
    const { addToast } = useToast();
    const t = translations.dashboard.admin;
    
    const [reports, setReports] = useState<LostFoundReport[]>(MOCK_LOST_FOUND_REPORTS);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedReport, setSelectedReport] = useState<LostFoundReport | null>(null);
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [assignmentFilter, setAssignmentFilter] = useState('all');
    const [sortOption, setSortOption] = useState('dateNewest');
    
    const [isAiSearching, setIsAiSearching] = useState(false);
    const [aiFilteredReportIds, setAiFilteredReportIds] = useState<string[] | null>(null);
    const [aiSearchQuery, setAiSearchQuery] = useState('');
    
    const assignableUsers = useMemo(() => {
        const staffRoles = new Set([
            UserRole.VOLUNTEER,
            UserRole.AUTHORITY,
        ]);
        return DEMO_USERS.filter(u => staffRoles.has(u.role));
    }, []);

    const handleUpdateReport = (reportId: string, updates: Partial<Pick<LostFoundReport, 'status' | 'assignedToId' | 'assignedToName'>>) => {
        const updatedReports = reports.map(r => r.id === reportId ? { ...r, ...updates } : r);
        setReports(updatedReports);
        // Also update the mock data source to simulate persistence
        const reportIndex = MOCK_LOST_FOUND_REPORTS.findIndex(report => report.id === reportId);
        if (reportIndex !== -1) {
            MOCK_LOST_FOUND_REPORTS[reportIndex] = { ...MOCK_LOST_FOUND_REPORTS[reportIndex], ...updates };
        }
        addToast(translations.reportDetails.statusUpdated, 'success');
    };

    const handleAiSearch = async () => {
        if (!searchQuery.trim()) return;
        setIsAiSearching(true);
        setAiFilteredReportIds(null);
        try {
            const resultIds = await getAiSearchResults(searchQuery, reports);
            setAiFilteredReportIds(resultIds);
            setAiSearchQuery(searchQuery);
        } catch (error) {
            console.error("AI Search failed:", error);
            alert('AI Search failed. Please try again.');
        } finally {
            setIsAiSearching(false);
        }
    };
    
    const clearAiSearch = () => {
        setAiFilteredReportIds(null);
        setAiSearchQuery('');
        setSearchQuery('');
    };

    const openDetails = (report: LostFoundReport) => setSelectedReport(report);
    const closeDetails = () => setSelectedReport(null);

    const filteredReports = useMemo(() => reports.filter(report => {
        if (aiFilteredReportIds !== null) return aiFilteredReportIds.includes(report.id);

        const query = searchQuery.toLowerCase();
        const searchMatch = !query || report.id.toLowerCase().includes(query) || (report.personName && report.personName.toLowerCase().includes(query)) || (report.itemName && report.itemName.toLowerCase().includes(query)) || report.description.toLowerCase().includes(query) || report.reportedBy.toLowerCase().includes(query);
        const statusMatch = statusFilter === 'all' || report.status === statusFilter;
        const categoryMatch = categoryFilter === 'all' || report.category === categoryFilter;
        const typeMatch = typeFilter === 'all' || report.type === typeFilter;
        const assignmentMatch = assignmentFilter === 'all' || (assignmentFilter === 'unassigned' && !report.assignedToId) || (report.assignedToId?.toString() === assignmentFilter);
        
        return searchMatch && statusMatch && categoryMatch && typeMatch && assignmentMatch;

    }).sort((a, b) => {
        if (aiFilteredReportIds !== null) return aiFilteredReportIds.indexOf(a.id) - aiFilteredReportIds.indexOf(b.id);
        switch (sortOption) {
            case 'dateOldest': return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
            case 'status': return a.status.localeCompare(b.status);
            case 'category': return a.category.localeCompare(b.category);
            case 'type': return a.type.localeCompare(b.type);
            case 'assignment': return (a.assignedToName || 'Z').localeCompare(b.assignedToName || 'Z');
            case 'dateNewest': default: return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        }
    }), [reports, aiFilteredReportIds, searchQuery, statusFilter, categoryFilter, typeFilter, assignmentFilter, sortOption]);
    
    const handleExportToCsv = () => {
        if (filteredReports.length === 0) {
            addToast('No data to export for the current filters.', 'error');
            return;
        }

        const headers = ['ID', 'Timestamp', 'Type', 'Category', 'Description', 'Last Seen', 'Status', 'Reported By', 'Assigned To'];
        
        const escapeCsvCell = (cellData: any) => {
            const stringData = String(cellData ?? '');
            if (stringData.includes(',') || stringData.includes('"') || stringData.includes('\n')) {
                return `"${stringData.replace(/"/g, '""')}"`;
            }
            return stringData;
        };

        const csvRows = [
            headers.join(','),
            ...filteredReports.map(report => [
                escapeCsvCell(report.id),
                escapeCsvCell(new Date(report.timestamp).toLocaleString()),
                escapeCsvCell(report.type),
                escapeCsvCell(report.category),
                escapeCsvCell(report.description),
                escapeCsvCell(report.lastSeen),
                escapeCsvCell(report.status),
                escapeCsvCell(report.reportedBy),
                escapeCsvCell(report.assignedToName || 'Unassigned'),
            ].join(','))
        ];

        const csvContent = "data:text/csv;charset=utf-8," + csvRows.join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `simhastha_filtered_reports_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        addToast('Report exported successfully!', 'success');
    };

    const statusOptions = [{ value: 'all', label: `${translations.filterBar.statusLabel}: ${translations.filterBar.all}` }, { value: 'Open', label: translations.filterBar.open }, { value: 'In Progress', label: translations.filterBar.inProgress }, { value: 'Resolved', label: translations.filterBar.resolved }];
    const categoryOptions = [{ value: 'all', label: `${translations.filterBar.categoryLabel}: ${translations.filterBar.all}` }, { value: 'Person', label: translations.filterBar.person }, { value: 'Item', label: translations.filterBar.item }];
    const typeOptions = [{ value: 'all', label: `${translations.filterBar.typeLabel}: ${translations.filterBar.all}` }, { value: 'Lost', label: translations.filterBar.lost }, { value: 'Found', label: translations.filterBar.found }];
    const assignmentOptions = useMemo(() => ([
        { value: 'all', label: `${translations.filterBar.assignmentLabel}: ${translations.filterBar.all}` },
        { value: 'unassigned', label: translations.filterBar.unassigned },
        ...assignableUsers.map(u => ({ value: String(u.id), label: u.name }))
    ]), [assignableUsers, translations]);
    const sortOptions = [{ value: 'dateNewest', label: translations.filterBar.dateNewest }, { value: 'dateOldest', label: translations.filterBar.dateOldest }, { value: 'status', label: translations.filterBar.statusSort }, { value: 'category', label: translations.filterBar.categorySort }, { value: 'type', label: translations.filterBar.typeSort }, { value: 'assignment', label: translations.filterBar.assignmentSort }];


    return (
        <>
            <div className="space-y-6">
                 <h2 className="text-3xl font-bold">{t.title}</h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content: Reports Table */}
                    <div className="lg:col-span-2">
                        <Card>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                                <h3 className="text-xl font-bold flex-shrink-0">{t.allReports}</h3>
                                <div className="w-full sm:w-auto flex-grow flex flex-wrap items-center justify-end gap-2">
                                    <div className="relative w-full sm:w-64">
                                        <input type="text" placeholder={t.searchPlaceholder} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAiSearch()} className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-full" />
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><SearchIcon /></div>
                                        <button onClick={handleAiSearch} disabled={isAiSearching || !searchQuery.trim()} title={t.aiSearchTooltip} className="absolute inset-y-0 right-0 flex items-center justify-center w-10 h-full text-orange-500 hover:bg-orange-100 rounded-r-full disabled:text-gray-400 disabled:hover:bg-transparent transition-colors"><SparklesIcon /></button>
                                    </div>
                                    <FilterDropdown label={translations.filterBar.statusLabel} value={statusFilter} onChange={e => setStatusFilter(e.target.value)} options={statusOptions} />
                                    <FilterDropdown label={translations.filterBar.categoryLabel} value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} options={categoryOptions} />
                                    <FilterDropdown label={translations.filterBar.assignmentLabel} value={assignmentFilter} onChange={e => setAssignmentFilter(e.target.value)} options={assignmentOptions} />
                                </div>
                            </div>
                            {aiFilteredReportIds !== null && (
                                <div className="flex justify-between items-center bg-orange-100 border border-orange-200 text-orange-800 rounded-md p-3 mb-4">
                                    <p className="text-sm font-medium">{t.aiSearchResults}: <span className="italic">"{aiSearchQuery}"</span></p>
                                    <button onClick={clearAiSearch} className="text-sm font-semibold hover:underline flex-shrink-0 ml-4">{t.clearAiSearch}</button>
                                </div>
                            )}
                            <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-2">
                                <FilterDropdown label={translations.filterBar.sortLabel} value={sortOption} onChange={e => setSortOption(e.target.value)} options={sortOptions.map(opt => ({...opt, label: `${translations.filterBar.sortLabel}: ${opt.label}`}))} />
                                <Button onClick={handleExportToCsv} variant="secondary"><DownloadIcon/> Export CSV</Button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400">
                                        <tr>
                                            <th scope="col" className="p-3 text-left text-xs font-medium uppercase tracking-wider">Type</th>
                                            <th scope="col" className="p-3 text-left text-xs font-medium uppercase tracking-wider">Category</th>
                                            <th scope="col" className="p-3 text-left text-xs font-medium uppercase tracking-wider">Description</th>
                                            <th scope="col" className="p-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                                            <th scope="col" className="p-3 text-left text-xs font-medium uppercase tracking-wider">Assigned To</th>
                                            <th scope="col" className="p-3 text-left text-xs font-medium uppercase tracking-wider">Reported By</th>
                                            <th scope="col" className="p-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredReports.map(report => (
                                            <tr key={report.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700/20 cursor-pointer" onClick={() => openDetails(report)}>
                                                <td className="p-3">{report.type}</td>
                                                <td className="p-3">{report.category}</td>
                                                <td className="p-3 truncate max-w-xs">{report.description}</td>
                                                <td className="p-3"><span className={`px-2 py-1 text-xs rounded-full ${report.status === 'Open' ? 'bg-yellow-200 text-yellow-800' : report.status === 'In Progress' ? 'bg-blue-200 text-blue-800' : 'bg-green-200 text-green-800'}`}>{report.status}</span></td>
                                                <td className="p-3">{report.assignedToName || 'Unassigned'}</td>
                                                <td className="p-3">{report.reportedBy}</td>
                                                <td className="p-3 text-sm text-gray-500">{new Date(report.timestamp).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                        {filteredReports.length === 0 && <tr><td colSpan={7}><p className="text-center py-4 text-gray-500">{translations.myReports.noFilteredReports}</p></td></tr>}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>

                    {/* Right Sidebar: Admin Tools */}
                    <div className="lg:col-span-1 space-y-6">
                        <AIControlCenterCard t={t} />
                        <AdminActivityLog t={t} />
                        <FraudAnalysis />
                        <UserManagement t={translations} />
                    </div>
                </div>
            </div>
            <ReportDetailsModal isOpen={!!selectedReport} onClose={closeDetails} report={selectedReport} onUpdateReport={handleUpdateReport} assignableUsers={assignableUsers} />
        </>
    );
};

export default AdminDashboard;