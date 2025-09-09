import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { useLocalization } from '../../hooks/useLocalization';
import { MOCK_LOST_FOUND_REPORTS } from '../../data/mockData';
import { LostFoundReport } from '../../types';
import ReportDetailsModal from './ReportDetailsModal';

const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>;

const FilterDropdown: React.FC<{label: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, options: {value: string, label: string}[]}> = ({label, value, onChange, options}) => (
    <div className="w-full md:w-auto">
        <label htmlFor={label} className="sr-only">{label}</label>
        <select id={label} value={value} onChange={onChange} className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 py-2 pl-3 pr-8 text-base">
            {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
    </div>
);

/**
 * Admin Dashboard Component.
 * This is the central control panel for administrators. It provides an overview of
 * system health and allows for interactive management of all lost & found reports.
 */
const AdminDashboard: React.FC = () => {
    const { translations } = useLocalization();
    const [reports, setReports] = useState<LostFoundReport[]>(MOCK_LOST_FOUND_REPORTS);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedReport, setSelectedReport] = useState<LostFoundReport | null>(null);
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');

    const handleUpdateStatus = (reportId: string, newStatus: LostFoundReport['status']) => {
        setReports(prevReports => prevReports.map(r => r.id === reportId ? { ...r, status: newStatus } : r));
        // Note: This updates local state. In a real app, you'd also want to update the master mock data or make an API call.
        const reportIndex = MOCK_LOST_FOUND_REPORTS.findIndex(report => report.id === reportId);
        if (reportIndex !== -1) {
            MOCK_LOST_FOUND_REPORTS[reportIndex].status = newStatus;
        }
        alert(translations.reportDetails.statusUpdated);
    };

    const openDetails = (report: LostFoundReport) => setSelectedReport(report);
    const closeDetails = () => setSelectedReport(null);

    const filteredReports = reports.filter(report => {
        const query = searchQuery.toLowerCase();
        const searchMatch = (
            report.id.toLowerCase().includes(query) ||
            (report.personName && report.personName.toLowerCase().includes(query)) ||
            (report.itemName && report.itemName.toLowerCase().includes(query)) ||
            report.description.toLowerCase().includes(query) ||
            report.reportedBy.toLowerCase().includes(query)
        );

        const statusMatch = statusFilter === 'all' || report.status === statusFilter;
        const categoryMatch = categoryFilter === 'all' || report.category === categoryFilter;
        const typeMatch = typeFilter === 'all' || report.type === typeFilter;
        
        return searchMatch && statusMatch && categoryMatch && typeMatch;

    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const statusOptions = [
        { value: 'all', label: `${translations.filterBar.statusLabel}: ${translations.filterBar.all}` },
        { value: 'Open', label: translations.filterBar.open },
        { value: 'In Progress', label: translations.filterBar.inProgress },
        { value: 'Resolved', label: translations.filterBar.resolved },
    ];
    const categoryOptions = [
        { value: 'all', label: `${translations.filterBar.categoryLabel}: ${translations.filterBar.all}` },
        { value: 'Person', label: translations.filterBar.person },
        { value: 'Item', label: translations.filterBar.item },
    ];
    const typeOptions = [
        { value: 'all', label: `${translations.filterBar.typeLabel}: ${translations.filterBar.all}` },
        { value: 'Lost', label: translations.filterBar.lost },
        { value: 'Found', label: translations.filterBar.found },
    ];

    return (
        <>
            <div className="space-y-6">
                <h2 className="text-3xl font-bold">{translations.dashboard.admin.title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card><h4 className="font-bold">Total Users</h4><p className="text-3xl">1,250,345</p></Card>
                    <Card><h4 className="font-bold">Active Family Hubs</h4><p className="text-3xl">320,123</p></Card>
                    <Card><h4 className="font-bold">Open SOS Alerts</h4><p className="text-3xl text-red-500">42</p></Card>
                    <Card><h4 className="font-bold">Volunteers Online</h4><p className="text-3xl text-green-500">1,580</p></Card>
                </div>
                <Card>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                        <h3 className="text-xl font-bold flex-shrink-0">{translations.dashboard.admin.recentReports}</h3>
                        <div className="w-full sm:w-auto flex-grow flex flex-col md:flex-row gap-2 items-center justify-end">
                            <div className="relative w-full md:w-64">
                                <input
                                    type="text"
                                    placeholder={translations.dashboard.admin.searchPlaceholder}
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <SearchIcon />
                                </div>
                            </div>
                            <FilterDropdown label={translations.filterBar.statusLabel} value={statusFilter} onChange={e => setStatusFilter(e.target.value)} options={statusOptions} />
                            <FilterDropdown label={translations.filterBar.categoryLabel} value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} options={categoryOptions} />
                            <FilterDropdown label={translations.filterBar.typeLabel} value={typeFilter} onChange={e => setTypeFilter(e.target.value)} options={typeOptions} />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-3">Type</th>
                                    <th className="p-3">Category</th>
                                    <th className="p-3">Description</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3">Reported By</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredReports.map(report => (
                                    <tr key={report.id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => openDetails(report)}>
                                        <td className="p-3">{report.type}</td>
                                        <td className="p-3">{report.category}</td>
                                        <td className="p-3 truncate max-w-xs">{report.description}</td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 text-xs rounded-full ${report.status === 'Open' ? 'bg-yellow-200 text-yellow-800' : report.status === 'In Progress' ? 'bg-blue-200 text-blue-800' : 'bg-green-200 text-green-800'}`}>
                                                {report.status}
                                            </span>
                                        </td>
                                        <td className="p-3">{report.reportedBy}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredReports.length === 0 && <p className="text-center py-4 text-gray-500">{translations.myReports.noFilteredReports}</p>}
                    </div>
                </Card>
            </div>
            <ReportDetailsModal
                isOpen={!!selectedReport}
                onClose={closeDetails}
                report={selectedReport}
                onUpdateStatus={handleUpdateStatus}
            />
        </>
    );
};

export default AdminDashboard;