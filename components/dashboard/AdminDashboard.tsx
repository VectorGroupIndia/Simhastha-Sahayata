import React, { useState, useMemo, useEffect } from 'react';
import { Card } from '../ui/Card';
import { useLocalization } from '../../hooks/useLocalization';
import { MOCK_LOST_FOUND_REPORTS } from '../../data/mockData';
import { LostFoundReport, User, UserRole } from '../../types';
import ReportDetailsModal from './ReportDetailsModal';
import { getAiSearchResults } from '../../services/geminiService';
import { Spinner } from '../ui/Spinner';
import { ReportsMapView } from './ReportsMapView';
import { DEMO_USERS } from '../../constants';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useToast } from '../../hooks/useToast';

// --- ICONS ---
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L10 17l-4 4 4-4 2.293-2.293a1 1 0 011.414 0L17 14m-5-5l2.293 2.293a1 1 0 010 1.414L10 17" /></svg>;
const ListIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>;
const MapIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.95 2.006a.75.75 0 00-.9-.053l-4.25 2.5a.75.75 0 00-.45.698v10.198l-2.022-1.179a.75.75 0 00-.956.114l-2 2.5a.75.75 0 00.114.956l2.022 1.179v.699a.75.75 0 00.45.698l4.25 2.5a.75.75 0 00.9-.053l4.25-2.5a.75.75 0 00.45-.698V6.302l2.022 1.179a.75.75 0 00.956-.114l2-2.5a.75.75 0 00-.114-.956L14.022 3.03v-.699a.75.75 0 00-.45-.698l-4.25-2.5a.75.75 0 00-.372 0zM12.75 16.23v-9.69l-4.5 2.64v9.69l4.5-2.64z" clipRule="evenodd" /></svg>;
const LayoutDashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" /></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;
const XCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>;
const ChartBarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M2 11a1 1 0 011-1h2a1 1 0 110 2H3a1 1 0 01-1-1zm5-3a1 1 0 011-1h2a1 1 0 110 2H8a1 1 0 01-1-1zm5-3a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1zM2 15a1 1 0 011-1h12a1 1 0 110 2H3a1 1 0 01-1-1z" /></svg>;
const DownloadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>;


// --- HELPER COMPONENTS ---

const FilterDropdown: React.FC<{label: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, options: {value: string, label: string}[]}> = ({label, value, onChange, options}) => (
    <div className="w-full md:w-auto">
        <label htmlFor={label} className="sr-only">{label}</label>
        <select id={label} value={value} onChange={onChange} className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 py-2 pl-3 pr-8 text-base">
            {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
    </div>
);

interface UserEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSave: (userId: number, newRole: UserRole, newStatus: 'Active' | 'Suspended') => void;
}

const UserEditModal: React.FC<UserEditModalProps> = ({ isOpen, onClose, user, onSave }) => {
  const [role, setRole] = useState<UserRole>(UserRole.PILGRIM);
  const [status, setStatus] = useState<'Active' | 'Suspended'>('Active');

  useEffect(() => {
    if (user) {
      setRole(user.role);
      setStatus(user.status);
    }
  }, [user]);

  if (!user) return null;

  const handleSave = () => {
    onSave(user.id, role, status);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit User: ${user.name}`}>
      <div className="space-y-4">
        <div>
          <label htmlFor="user-role" className="block text-sm font-medium text-gray-700">Role</label>
          <select
            id="user-role"
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          >
            {Object.values(UserRole).map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="user-status" className="block text-sm font-medium text-gray-700">Status</label>
          <select
            id="user-status"
            value={status}
            onChange={(e) => setStatus(e.target.value as 'Active' | 'Suspended')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          >
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
        <div className="flex justify-end gap-4 pt-4">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    </Modal>
  );
};

const ReportsChart: React.FC<{reports: LostFoundReport[]}> = ({ reports }) => {
    const { translations } = useLocalization();
    const reportsByDay = useMemo(() => {
        const counts: {[key: string]: number} = {};
        reports.forEach(report => {
            const date = new Date(report.timestamp).toLocaleDateString();
            counts[date] = (counts[date] || 0) + 1;
        });
        return Object.entries(counts).slice(-7); // Last 7 days
    }, [reports]);

    const maxCount = Math.max(...reportsByDay.map(([, count]) => count), 1);

    return (
        <div>
            <h3 className="text-xl font-bold mb-4">{translations.dashboard.admin.reportsByDay}</h3>
            <div className="flex justify-around items-end h-64 bg-gray-50 p-4 rounded-lg">
                {reportsByDay.map(([date, count]) => (
                    <div key={date} className="flex flex-col items-center w-1/8">
                        <div className="text-sm font-bold">{count}</div>
                        <div
                            className="w-8 bg-orange-400 hover:bg-orange-500 rounded-t-md"
                            style={{ height: `${(count / maxCount) * 100}%` }}
                            title={`${count} reports on ${date}`}
                        ></div>
                        <div className="text-xs text-gray-500 mt-1">{new Date(date).toLocaleDateString(undefined, {month:'short', day:'numeric'})}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};


const UserManagementView: React.FC<{
    users: User[];
    onEditUser: (user: User) => void;
}> = ({ users, onEditUser }) => {
    const { translations } = useLocalization();
    const t = translations.dashboard.admin;
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredUsers = users.filter(user => {
        const searchMatch = user.name.toLowerCase().includes(searchQuery.toLowerCase());
        const roleMatch = roleFilter === 'all' || user.role === roleFilter;
        const statusMatch = statusFilter === 'all' || user.status === statusFilter;
        return searchMatch && roleMatch && statusMatch;
    });

    return (
        <Card>
            <h3 className="text-xl font-bold mb-4">{t.userManagement.title}</h3>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
                <input
                    type="text"
                    placeholder={t.searchUsers}
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full md:w-1/2 p-2 border rounded-md"
                />
                <select
                    value={roleFilter}
                    onChange={e => setRoleFilter(e.target.value)}
                    className="w-full md:w-1/4 p-2 border rounded-md"
                >
                    <option value="all">All Roles</option>
                    {Object.values(UserRole).map(role => <option key={role} value={role}>{role}</option>)}
                </select>
                <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="w-full md:w-1/4 p-2 border rounded-md"
                >
                    <option value="all">{t.userManagement.statusFilterAll}</option>
                    <option value="Active">{t.userManagement.statusFilterActive}</option>
                    <option value="Suspended">{t.userManagement.statusFilterSuspended}</option>
                </select>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-3">User</th>
                            <th className="p-3">{t.userManagement.role}</th>
                            <th className="p-3">{t.userManagement.status}</th>
                            <th className="p-3">{t.userManagement.actions}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id} className="border-b">
                                <td className="p-3 flex items-center">
                                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full mr-3" />
                                    {user.name}
                                </td>
                                <td className="p-3">{user.role}</td>
                                <td className="p-3">
                                    <span className={`flex items-center text-sm font-medium ${user.status === 'Active' ? 'text-green-800' : 'text-red-800'}`}>
                                        {user.status === 'Active' ? <CheckCircleIcon /> : <XCircleIcon />}
                                        {user.status}
                                    </span>
                                </td>
                                <td className="p-3">
                                    <Button variant="secondary" onClick={() => onEditUser(user)} className="p-2">
                                        <EditIcon />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

const ReportingView: React.FC<{ reports: LostFoundReport[], users: User[] }> = ({ reports, users }) => {
    const { translations } = useLocalization();
    const { addToast } = useToast();
    const t = translations.dashboard.admin.reporting;
    const filterT = translations.filterBar;

    const initialFilters = {
        startDate: '',
        endDate: '',
        type: 'all',
        category: 'all',
        status: 'all',
        assignedTo: 'all',
    };

    const [filters, setFilters] = useState(initialFilters);
    const [generatedReport, setGeneratedReport] = useState<LostFoundReport[] | null>(null);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleGenerate = () => {
        const results = reports.filter(report => {
            const reportDate = new Date(report.timestamp);
            const startDate = filters.startDate ? new Date(filters.startDate) : null;
            const endDate = filters.endDate ? new Date(filters.endDate) : null;

            if (startDate && reportDate < startDate) return false;
            if (endDate && reportDate > endDate) return false;
            if (filters.type !== 'all' && report.type !== filters.type) return false;
            if (filters.category !== 'all' && report.category !== filters.category) return false;
            if (filters.status !== 'all' && report.status !== filters.status) return false;
            if (filters.assignedTo !== 'all') {
                if (filters.assignedTo === 'unassigned' && report.assignedToId) return false;
                if (filters.assignedTo !== 'unassigned' && report.assignedToId?.toString() !== filters.assignedTo) return false;
            }
            return true;
        });
        setGeneratedReport(results);
    };

    const handleReset = () => {
        setFilters(initialFilters);
        setGeneratedReport(null);
    };

    const handleExport = () => {
        if (!generatedReport || generatedReport.length === 0) {
            addToast('No report data to export.', 'error');
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
            ...generatedReport.map(report => [
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
        link.setAttribute("download", `simhastha_report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    const assignableUsers = useMemo(() => users.filter(u => u.role === UserRole.VOLUNTEER || u.role === UserRole.AUTHORITY), [users]);

    return (
        <Card>
            <h3 className="text-xl font-bold mb-2">{t.title}</h3>
            <p className="text-gray-600 mb-4">{t.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 border rounded-lg bg-gray-50">
                <div>
                    <label className="block text-sm font-medium">{t.dateRange}</label>
                    <div className="flex items-center gap-2">
                        <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} className="w-full p-2 border rounded-md"/>
                        <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} className="w-full p-2 border rounded-md"/>
                    </div>
                </div>
                <div><label className="block text-sm font-medium">{filterT.typeLabel}</label><select name="type" value={filters.type} onChange={handleFilterChange} className="w-full p-2 border rounded-md"><option value="all">{filterT.all}</option><option value="Lost">{filterT.lost}</option><option value="Found">{filterT.found}</option></select></div>
                <div><label className="block text-sm font-medium">{filterT.categoryLabel}</label><select name="category" value={filters.category} onChange={handleFilterChange} className="w-full p-2 border rounded-md"><option value="all">{filterT.all}</option><option value="Person">{filterT.person}</option><option value="Item">{filterT.item}</option></select></div>
                <div><label className="block text-sm font-medium">{filterT.statusLabel}</label><select name="status" value={filters.status} onChange={handleFilterChange} className="w-full p-2 border rounded-md"><option value="all">{filterT.all}</option><option value="Open">{filterT.open}</option><option value="In Progress">{filterT.inProgress}</option><option value="Resolved">{filterT.resolved}</option></select></div>
                <div><label className="block text-sm font-medium">{filterT.assignmentLabel}</label><select name="assignedTo" value={filters.assignedTo} onChange={handleFilterChange} className="w-full p-2 border rounded-md"><option value="all">{filterT.all}</option><option value="unassigned">{filterT.unassigned}</option>{assignableUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}</select></div>
            </div>
            <div className="flex gap-4 mt-4">
                <Button onClick={handleGenerate}>{t.generateReport}</Button>
                <Button onClick={handleReset} variant="secondary">{t.resetFilters}</Button>
            </div>
            {generatedReport && (
                <div className="mt-6 animate-fade-in">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-2">
                        <h3 className="text-lg font-bold">{t.reportResults} <span className="text-gray-600 font-medium">({t.showingResults.replace('{count}', generatedReport.length)})</span></h3>
                        <Button onClick={handleExport} disabled={generatedReport.length === 0}>{t.exportToCsv}</Button>
                    </div>
                    {generatedReport.length > 0 ? (
                        <div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="bg-gray-100"><th className="p-3">ID</th><th className="p-3">Date</th><th className="p-3">Type</th><th className="p-3">Category</th><th className="p-3">Status</th><th className="p-3">Assigned To</th></tr></thead><tbody>{generatedReport.map(report => (<tr key={report.id} className="border-b"><td className="p-3 font-mono text-xs">{report.id}</td><td className="p-3">{new Date(report.timestamp).toLocaleDateString()}</td><td className="p-3">{report.type}</td><td className="p-3">{report.category}</td><td className="p-3">{report.status}</td><td className="p-3">{report.assignedToName || 'Unassigned'}</td></tr>))}</tbody></table></div>
                    ) : (
                        <p className="text-center py-8 text-gray-500">{t.noResults}</p>
                    )}
                </div>
            )}
        </Card>
    );
};


/**
 * Admin Dashboard Component.
 * This is the central control panel for administrators. It provides an overview of
 * system health and allows for interactive management of all lost & found reports.
 */
const AdminDashboard: React.FC = () => {
    const { translations } = useLocalization();
    const { addToast } = useToast();
    const [reports, setReports] = useState<LostFoundReport[]>(MOCK_LOST_FOUND_REPORTS);
    const [users, setUsers] = useState<User[]>(DEMO_USERS);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedReport, setSelectedReport] = useState<LostFoundReport | null>(null);
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [assignmentFilter, setAssignmentFilter] = useState('all');
    const [sortOption, setSortOption] = useState('dateNewest');
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
    const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'reporting'>('overview');
    const [userToEdit, setUserToEdit] = useState<User | null>(null);

    const [isAiSearching, setIsAiSearching] = useState(false);
    const [aiFilteredReportIds, setAiFilteredReportIds] = useState<string[] | null>(null);
    const [aiSearchQuery, setAiSearchQuery] = useState('');
    
    const assignableUsers = useMemo(() => users.filter(u => u.role === UserRole.VOLUNTEER || u.role === UserRole.AUTHORITY), [users]);

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

    const handleSaveUser = (userId: number, newRole: UserRole, newStatus: 'Active' | 'Suspended') => {
        const updatedUsers = users.map(u => u.id === userId ? { ...u, role: newRole, status: newStatus } : u);
        setUsers(updatedUsers);
        // Update mock data source
        const userIndex = DEMO_USERS.findIndex(user => user.id === userId);
        if (userIndex !== -1) {
            DEMO_USERS[userIndex].role = newRole;
            DEMO_USERS[userIndex].status = newStatus;
        }
        addToast(translations.dashboard.admin.userManagement.userUpdated, 'success');
        setUserToEdit(null);
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

    const filteredReports = reports.filter(report => {
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
    });
    
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

    const highPriorityReports = reports.filter(r => r.status === 'Open' && r.category === 'Person');

    return (
        <>
            <div className="space-y-6">
                <h2 className="text-3xl font-bold">{translations.dashboard.admin.title}</h2>
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-6">
                        <button onClick={() => setActiveTab('overview')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'overview' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                            <LayoutDashboardIcon /> {translations.dashboard.admin.overviewTab}
                        </button>
                        <button onClick={() => setActiveTab('users')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'users' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                            <UsersIcon /> {translations.dashboard.admin.userManagementTab}
                        </button>
                        <button onClick={() => setActiveTab('reporting')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'reporting' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                            <ChartBarIcon /> {translations.dashboard.admin.reportingTab}
                        </button>
                    </nav>
                </div>
                
                {activeTab === 'overview' && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Card><h4 className="font-bold">Total Reports</h4><p className="text-3xl">{reports.length}</p></Card>
                            <Card><h4 className="font-bold">Open Reports</h4><p className="text-3xl text-yellow-600">{reports.filter(r => r.status === 'Open').length}</p></Card>
                            <Card><h4 className="font-bold">Resolved Today</h4><p className="text-3xl text-green-500">12</p></Card>
                            <Card><h4 className="font-bold">Active Personnel</h4><p className="text-3xl">{assignableUsers.length}</p></Card>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                           <div className="lg:col-span-2"><Card><ReportsChart reports={reports} /></Card></div>
                           <Card>
                                <h3 className="text-xl font-bold mb-4">{translations.dashboard.admin.highPriorityAlerts}</h3>
                                <div className="space-y-2 max-h-72 overflow-y-auto">
                                    {highPriorityReports.length > 0 ? highPriorityReports.map(r => (
                                        <div key={r.id} className="p-2 border rounded-md bg-red-50 hover:bg-red-100 cursor-pointer" onClick={() => openDetails(r)}>
                                            <p className="font-semibold">{r.personName}</p>
                                            <p className="text-xs text-gray-600">Last Seen: {r.lastSeen}</p>
                                        </div>
                                    )) : <p className="text-sm text-gray-500">{translations.dashboard.admin.noHighPriority}</p>}
                                </div>
                           </Card>
                        </div>
                        <Card>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                                <h3 className="text-xl font-bold flex-shrink-0">{translations.dashboard.admin.recentReports}</h3>
                                <div className="w-full sm:w-auto flex-grow flex flex-wrap items-center justify-end gap-2">
                                    <div className="relative w-full sm:w-64">
                                        <input type="text" placeholder={translations.dashboard.admin.searchPlaceholder} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAiSearch()} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full" />
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><SearchIcon /></div>
                                        <button onClick={handleAiSearch} disabled={isAiSearching || !searchQuery.trim()} title={translations.dashboard.admin.aiSearchTooltip} className="absolute inset-y-0 right-0 flex items-center justify-center gap-2 w-10 h-10 text-white bg-orange-500 rounded-full hover:bg-orange-600 disabled:bg-orange-300 transition-colors"><SparklesIcon /></button>
                                    </div>
                                    <FilterDropdown label={translations.filterBar.statusLabel} value={statusFilter} onChange={e => setStatusFilter(e.target.value)} options={statusOptions} />
                                    <FilterDropdown label={translations.filterBar.categoryLabel} value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} options={categoryOptions} />
                                    <FilterDropdown label={translations.filterBar.typeLabel} value={typeFilter} onChange={e => setTypeFilter(e.target.value)} options={typeOptions} />
                                    <FilterDropdown label={translations.filterBar.assignmentLabel} value={assignmentFilter} onChange={e => setAssignmentFilter(e.target.value)} options={assignmentOptions} />
                                    <FilterDropdown label={translations.filterBar.sortLabel} value={sortOption} onChange={e => setSortOption(e.target.value)} options={sortOptions.map(opt => ({...opt, label: `${translations.filterBar.sortLabel}: ${opt.label}`}))} />
                                </div>
                            </div>
                            {aiFilteredReportIds !== null && (
                                <div className="flex justify-between items-center bg-orange-100 border border-orange-200 text-orange-800 rounded-md p-3 mb-4">
                                    <p className="text-sm font-medium">{translations.dashboard.admin.aiSearchResults}: <span className="italic">"{aiSearchQuery}"</span></p>
                                    <button onClick={clearAiSearch} className="text-sm font-semibold hover:underline flex-shrink-0 ml-4">{translations.dashboard.admin.clearAiSearch}</button>
                                </div>
                            )}
                            <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-2">
                                <div className="inline-flex rounded-md shadow-sm bg-gray-100 p-1">
                                    <button onClick={() => setViewMode('list')} className={`px-4 py-2 text-sm font-medium rounded-md flex items-center ${viewMode === 'list' ? 'bg-white text-orange-600 shadow' : 'text-gray-600'}`}><ListIcon/> {translations.dashboard.admin.listView}</button>
                                    <button onClick={() => setViewMode('map')} className={`px-4 py-2 text-sm font-medium rounded-md flex items-center ${viewMode === 'map' ? 'bg-white text-orange-600 shadow' : 'text-gray-600'}`}><MapIcon/> {translations.dashboard.admin.mapView}</button>
                                </div>
                                <Button onClick={handleExportToCsv} variant="secondary"><DownloadIcon/> {translations.dashboard.admin.reporting.exportToCsv}</Button>
                            </div>
                            {viewMode === 'list' ? (
                                <div className="overflow-x-auto"><table className="w-full text-left"><thead><tr className="bg-gray-100"><th className="p-3">Type</th><th className="p-3">Category</th><th className="p-3">Description</th><th className="p-3">Status</th><th className="p-3">Assigned To</th><th className="p-3">Reported By</th></tr></thead><tbody>{filteredReports.map(report => (<tr key={report.id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => openDetails(report)}><td className="p-3">{report.type}</td><td className="p-3">{report.category}</td><td className="p-3 truncate max-w-xs">{report.description}</td><td className="p-3"><span className={`px-2 py-1 text-xs rounded-full ${report.status === 'Open' ? 'bg-yellow-200 text-yellow-800' : report.status === 'In Progress' ? 'bg-blue-200 text-blue-800' : 'bg-green-200 text-green-800'}`}>{report.status}</span></td><td className="p-3">{report.assignedToName || 'Unassigned'}</td><td className="p-3">{report.reportedBy}</td></tr>))}{filteredReports.length === 0 && <tr><td colSpan={6}><p className="text-center py-4 text-gray-500">{translations.myReports.noFilteredReports}</p></td></tr>}</tbody></table></div>
                            ) : ( <ReportsMapView reports={filteredReports} onSelectReport={openDetails} /> )}
                        </Card>
                    </div>
                )}
                {activeTab === 'users' && <div className="animate-fade-in"><UserManagementView users={users} onEditUser={setUserToEdit} /></div>}
                {activeTab === 'reporting' && <div className="animate-fade-in"><ReportingView reports={reports} users={users} /></div>}
            </div>
            <ReportDetailsModal isOpen={!!selectedReport} onClose={closeDetails} report={selectedReport} onUpdateReport={handleUpdateReport} assignableUsers={assignableUsers} />
            <UserEditModal isOpen={!!userToEdit} onClose={() => setUserToEdit(null)} user={userToEdit} onSave={handleSaveUser} />
        </>
    );
};

export default AdminDashboard;