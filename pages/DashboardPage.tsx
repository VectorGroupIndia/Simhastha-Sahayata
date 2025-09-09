
import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserRole, LostFoundReport, FamilyMember } from '../types';
import { useLocalization } from '../hooks/useLocalization';
import FamilyHub from '../components/dashboard/FamilyHub';
import IntelligentNav from '../components/dashboard/IntelligentNav';
import PilgrimGuide from '../components/dashboard/PilgrimGuide';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import AuthoritiesDashboard from '../components/dashboard/AuthoritiesDashboard';
import VolunteerDashboard from '../components/dashboard/VolunteerDashboard';
import ReportDetailsModal from '../components/dashboard/ReportDetailsModal';
import { Button } from '../components/ui/Button';
import { MOCK_LOST_FOUND_REPORTS, MOCK_FAMILY_MEMBERS } from '../data/mockData';
import { Card } from '../components/ui/Card';
import { getAiSearchResults } from '../services/geminiService';
import { Spinner } from '../components/ui/Spinner';
import { ImageZoomModal } from '../components/ui/ImageZoomModal';
import CrowdDensityIndicator from '../components/dashboard/CrowdDensityIndicator';
import AiAlerts from '../components/dashboard/AiAlerts';
import { UserGuideModal } from '../components/dashboard/UserGuideModal';
import { ReportsMapView } from '../components/dashboard/ReportsMapView';
import MyItems from '../components/dashboard/MyItems';

// Icon Components defined locally
const HeartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>;
const MapIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13v-6m0 6l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m0 10v-6m0 6l-6-3" /></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L10 17l-4 4 4-4 2.293-2.293a1 1 0 011.414 0L17 14m-5-5l2.293 2.293a1 1 0 010 1.414L10 17" /></svg>;
const PlusCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ArchiveIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 001.414 0l2.414-2.414a1 1 0 01.707-.293H21" /></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>;
const QuestionMarkCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>;
const ListIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>;
const MapViewIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.95 2.006a.75.75 0 00-.9-.053l-4.25 2.5a.75.75 0 00-.45.698v10.198l-2.022-1.179a.75.75 0 00-.956.114l-2 2.5a.75.75 0 00.114.956l2.022 1.179v.699a.75.75 0 00.45.698l4.25 2.5a.75.75 0 00.9-.053l4.25-2.5a.75.75 0 00.45-.698V6.302l2.022 1.179a.75.75 0 00.956-.114l2-2.5a.75.75 0 00-.114-.956L14.022 3.03v-.699a.75.75 0 00-.45-.698l-4.25-2.5a.75.75 0 00-.372 0zM12.75 16.23v-9.69l-4.5 2.64v9.69l4.5-2.64z" clipRule="evenodd" /></svg>;
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const ClipboardListIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.995 5.995 0 003 21m12 0v1m0-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M9 10a4 4 0 110-5.292M15 10a4 4 0 110-5.292" /></svg>;
const BellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;
const TagIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5a2 2 0 012 2v5a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 15h2v2H7v-2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h.01" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3v18h18" /></svg>;


const FilterDropdown: React.FC<{label: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, options: {value: string, label: string}[]}> = ({label, value, onChange, options}) => (
    <div className="w-full">
        <label htmlFor={label} className="sr-only">{label}</label>
        {/* FIX: Added styling classes to ensure visibility */ }
        <select id={label} value={value} onChange={onChange} className="w-full bg-white text-gray-900 rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 py-2 pl-3 pr-8 text-base">
            {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
    </div>
);


/**
 * MyReports Component - Shows a user's submitted reports with filtering and search.
 */
const MyReports: React.FC = () => {
    const { user } = useAuth();
    const { translations } = useLocalization();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedReport, setSelectedReport] = useState<LostFoundReport | null>(null);
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [sortOption, setSortOption] = useState('dateNewest');
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
    
    const [isAiSearching, setIsAiSearching] = useState(false);
    const [aiFilteredReportIds, setAiFilteredReportIds] = useState<string[] | null>(null);
    const [aiSearchQuery, setAiSearchQuery] = useState('');

    const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
    const [zoomedImageUrl, setZoomedImageUrl] = useState('');

    const openZoomModal = (report: LostFoundReport) => {
        if(report.imageUrl) {
            setZoomedImageUrl(report.imageUrl);
            setIsZoomModalOpen(true);
        }
    }

    const myReports = MOCK_LOST_FOUND_REPORTS.filter(
        report => report.reportedById === user?.id
    );

    const handleAiSearch = async () => {
        if (!searchQuery.trim()) return;
        setIsAiSearching(true);
        setAiFilteredReportIds(null);
        try {
            const resultIds = await getAiSearchResults(searchQuery, myReports);
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

    const getStatusClasses = (status: LostFoundReport['status']) => {
        switch (status) {
            case 'Open': return 'bg-yellow-200 text-yellow-800';
            case 'In Progress': return 'bg-blue-200 text-blue-800';
            case 'Resolved': return 'bg-green-200 text-green-800';
            default: return 'bg-gray-200 text-gray-800';
        }
    };
    
    const openDetailsModal = (report: LostFoundReport) => setSelectedReport(report);
    const closeDetailsModal = () => setSelectedReport(null);

    const filteredReports = myReports.filter(report => {
        if (aiFilteredReportIds !== null) {
            return aiFilteredReportIds.includes(report.id);
        }

        const query = searchQuery.toLowerCase();
        const searchMatch = query === '' ||
            report.id.toLowerCase().includes(query) ||
            (report.personName && report.personName.toLowerCase().includes(query)) ||
            (report.itemName && report.itemName.toLowerCase().includes(query)) ||
            report.description.toLowerCase().includes(query);

        const statusMatch = statusFilter === 'all' || report.status === statusFilter;
        const categoryMatch = categoryFilter === 'all' || report.category === categoryFilter;
        const typeMatch = typeFilter === 'all' || report.type === typeFilter;

        return searchMatch && statusMatch && categoryMatch && typeMatch;
    }).sort((a, b) => {
        if (aiFilteredReportIds !== null) {
            return aiFilteredReportIds.indexOf(a.id) - aiFilteredReportIds.indexOf(b.id);
        }
        // Sorting logic
        switch (sortOption) {
            case 'dateOldest':
                return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
            case 'status':
                return a.status.localeCompare(b.status);
            case 'category':
                return a.category.localeCompare(b.category);
            case 'type':
                return a.type.localeCompare(b.type);
            case 'dateNewest':
            default:
                return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        }
    });

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
     const sortOptions = [
        { value: 'dateNewest', label: translations.filterBar.dateNewest },
        { value: 'dateOldest', label: translations.filterBar.dateOldest },
        { value: 'status', label: translations.filterBar.statusSort },
        { value: 'category', label: translations.filterBar.categorySort },
        { value: 'type', label: translations.filterBar.typeSort },
    ];

    return (
        <>
            <Card>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                    <h3 className="text-2xl font-bold flex-shrink-0">{translations.myReports.title}</h3>
                     <div className="inline-flex rounded-md shadow-sm bg-gray-100 p-1">
                        <button onClick={() => setViewMode('list')} className={`px-4 py-2 text-sm font-medium rounded-md flex items-center ${viewMode === 'list' ? 'bg-white text-orange-600 shadow' : 'text-gray-600'}`}>
                            <ListIcon/> {translations.myReports.listView}
                        </button>
                        <button onClick={() => setViewMode('map')} className={`px-4 py-2 text-sm font-medium rounded-md flex items-center ${viewMode === 'map' ? 'bg-white text-orange-600 shadow' : 'text-gray-600'}`}>
                            <MapViewIcon/> {translations.myReports.mapView}
                        </button>
                    </div>
                </div>
                {viewMode === 'list' && (
                 <>
                 <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2 items-center justify-end mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="relative w-full lg:col-span-2">
                        <input
                            type="text"
                            placeholder={translations.myReports.searchPlaceholder}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleAiSearch()}
                            className="w-full pl-10 pr-12 py-2 bg-white text-gray-900 border border-gray-300 rounded-full"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <SearchIcon />
                        </div>
                        <button
                            onClick={handleAiSearch}
                            disabled={isAiSearching || !searchQuery.trim()}
                            title={translations.myReports.aiSearchTooltip}
                            className="absolute inset-y-0 right-0 flex items-center justify-center gap-2 w-10 h-10 text-white bg-orange-500 rounded-full hover:bg-orange-600 disabled:bg-orange-300 transition-colors"
                        >
                            {isAiSearching ? <Spinner size="sm" /> : <SparklesIcon />}
                        </button>
                    </div>
                    <FilterDropdown label={translations.filterBar.statusLabel} value={statusFilter} onChange={e => setStatusFilter(e.target.value)} options={statusOptions} />
                    <FilterDropdown label={translations.filterBar.categoryLabel} value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} options={categoryOptions} />
                    <FilterDropdown label={translations.filterBar.typeLabel} value={typeFilter} onChange={e => setTypeFilter(e.target.value)} options={typeOptions} />
                    <div className="lg:col-span-2 lg:col-start-4">
                     <FilterDropdown label={translations.filterBar.sortLabel} value={sortOption} onChange={e => setSortOption(e.target.value)} options={sortOptions.map(opt => ({...opt, label: `${translations.filterBar.sortLabel}: ${opt.label}`}))} />
                    </div>
                </div>
                
                {aiFilteredReportIds !== null && (
                    <div className="flex justify-between items-center bg-orange-100 border border-orange-200 text-orange-800 rounded-md p-3 mb-4">
                        <p className="text-sm font-medium">
                            {translations.myReports.aiSearchResults}: <span className="italic">"{aiSearchQuery}"</span>
                        </p>
                        <button onClick={clearAiSearch} className="text-sm font-semibold hover:underline flex-shrink-0 ml-4">
                            {translations.myReports.clearAiSearch}
                        </button>
                    </div>
                )}

                {filteredReports.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredReports.map(report => (
                            <div key={report.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-lg flex flex-col justify-between">
                                <div className="flex-grow">
                                    {report.imageUrl && (
                                        <div className="mb-4" onClick={() => openZoomModal(report)}>
                                            <img src={report.imageUrl} alt={report.category === 'Person' ? report.personName : report.itemName} className="rounded-md w-full h-40 object-cover cursor-pointer hover:opacity-80 transition-opacity" title={translations.reportDetails.imageZoom} />
                                        </div>
                                    )}
                                    <div className="flex justify-between items-start gap-2">
                                        <p className="font-bold text-lg text-orange-600">
                                            {report.category === 'Person' ? report.personName : report.itemName}
                                        </p>
                                        <span className={`flex-shrink-0 px-3 py-1 text-xs font-semibold rounded-full ${getStatusClasses(report.status)}`}>
                                            {report.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 font-mono mb-2">
                                        {translations.myReports.id}: {report.id}
                                    </p>
                                    <p className="mt-2 text-sm text-gray-700 line-clamp-3">{report.description}</p>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col items-start">
                                     <p className="text-xs text-gray-400 mb-3">
                                        {translations.myReports.reportedOn}: {new Date(report.timestamp).toLocaleString()}
                                    </p>
                                    <Button onClick={() => openDetailsModal(report)} className="w-full" variant="secondary">
                                        {translations.myReports.viewDetails}
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600 italic py-4 text-center">
                        {myReports.length === 0
                            ? translations.myReports.noReports
                            : translations.myReports.noFilteredReports
                        }
                    </p>
                )}
                </>
             )}
             {viewMode === 'map' && (
                <ReportsMapView reports={filteredReports} onSelectReport={openDetailsModal} />
             )}
            </Card>
            <ReportDetailsModal 
                isOpen={!!selectedReport}
                onClose={closeDetailsModal}
                report={selectedReport}
            />
            <ImageZoomModal 
                isOpen={isZoomModalOpen}
                onClose={() => setIsZoomModalOpen(false)}
                imageUrl={zoomedImageUrl}
            />
        </>
    );
};


/**
 * Main Dashboard Page.
 * This component is protected and requires authentication. It acts as a router,
 * displaying the appropriate dashboard UI based on the logged-in user's role.
 * For Pilgrims, it provides a tabbed interface to access the core features.
 */
const DashboardPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { translations } = useLocalization();
  const [activeTab, setActiveTab] = useState('home');
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const navigate = useNavigate();

  if (!isAuthenticated || !user) {
    return <Navigate to="/" />;
  }
  
  const getStatusClasses = (status: LostFoundReport['status']) => {
    switch (status) {
        case 'Open': return 'bg-yellow-100 text-yellow-800';
        case 'In Progress': return 'bg-blue-100 text-blue-800';
        case 'Resolved': return 'bg-green-100 text-green-800';
        default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderPilgrimOverview = () => {
    const myReports = MOCK_LOST_FOUND_REPORTS.filter(report => report.reportedById === user?.id);
    const familyMembers = MOCK_FAMILY_MEMBERS;
    const openReportsCount = myReports.filter(r => r.status === 'Open').length;
    
    const familyStatusCounts = familyMembers.reduce((acc, member) => {
        acc[member.status] = (acc[member.status] || 0) + 1;
        return acc;
    }, {} as Record<FamilyMember['status'], number>);
    const familyMembersWithIssues = familyMembers.filter(m => m.status !== 'Safe');

    return (
        <div className="space-y-6 animate-fade-in-up">
            <CrowdDensityIndicator />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Welcome & Quick Stats */}
                <Card className="lg:col-span-3 bg-gradient-to-r from-orange-50 to-amber-50">
                    <h2 className="text-3xl font-bold text-gray-800">Welcome back, {user?.name.split(' ')[0]}!</h2>
                    <p className="text-gray-500">Here's your summary for today.</p>
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                           <ClipboardListIcon />
                           <div className="ml-3">
                               <p className="text-2xl font-bold">{openReportsCount}</p>
                               <p className="text-sm text-gray-500">Open Reports</p>
                           </div>
                        </div>
                         <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                           <UsersIcon />
                           <div className="ml-3">
                               <p className="text-2xl font-bold">{familyMembers.length}</p>
                               <p className="text-sm text-gray-500">Family Members</p>
                           </div>
                        </div>
                         <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                           <BellIcon />
                           <div className="ml-3">
                               <p className={`text-2xl font-bold ${familyMembersWithIssues.length > 0 ? 'text-red-500' : 'text-green-500'}`}>{familyMembersWithIssues.length > 0 ? familyMembersWithIssues.length : 'All'}</p>
                               <p className="text-sm text-gray-500">{familyMembersWithIssues.length > 0 ? 'Alerts' : 'Safe'}</p>
                           </div>
                        </div>
                    </div>
                </Card>
                
                <div className="lg:col-span-3">
                    <AiAlerts />
                </div>
                

                {/* Quick Actions */}
                <Card className="lg:col-span-1">
                    <h3 className="font-bold text-xl mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                        <Button onClick={() => setActiveTab('hub')} variant="secondary" className="w-full justify-start text-left !px-4"><HeartIcon /> <span className="ml-2">View Family Hub</span></Button>
                        <Button onClick={() => setActiveTab('nav')} variant="secondary" className="w-full justify-start text-left !px-4"><MapIcon /> <span className="ml-2">Start Navigation</span></Button>
                        <Button onClick={() => setActiveTab('guide')} variant="secondary" className="w-full justify-start text-left !px-4"><SparklesIcon /> <span className="ml-2">Ask AI Guide</span></Button>
                    </div>
                </Card>

                {/* My Reports Summary */}
                <Card className="lg:col-span-2">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-xl">Recent Reports</h3>
                        <Button onClick={() => setActiveTab('reports')} variant="secondary" className="text-sm !py-1 !px-3">View All</Button>
                    </div>
                    <div className="space-y-3">
                       {myReports.length > 0 ? (
                            myReports.slice(0, 2).map(report => (
                                <div key={report.id} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold">{report.itemName || report.personName}</p>
                                        <p className="text-xs text-gray-500">{new Date(report.timestamp).toLocaleDateString()}</p>
                                    </div>
                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${getStatusClasses(report.status)}`}>{report.status}</span>
                                </div>
                            ))
                       ) : (
                           <p className="text-center text-gray-500 py-4">No reports filed yet.</p>
                       )}
                    </div>
                </Card>

                {/* Family Hub Summary */}
                <Card className="lg:col-span-3">
                     <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-xl">Family Hub Status</h3>
                        <Button onClick={() => setActiveTab('hub')} variant="secondary" className="text-sm !py-1 !px-3">Go to Hub</Button>
                    </div>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {familyMembers.map(member => (
                            <div key={member.id} className="text-center p-2 rounded-lg bg-gray-50">
                                <img src={member.avatar} alt={member.name} className="w-16 h-16 rounded-full mx-auto border-4 border-white shadow-md" />
                                <p className="font-semibold mt-2">{member.name}</p>
                                <p className={`text-sm font-bold ${member.status === 'Safe' ? 'text-green-600' : member.status === 'Alert' ? 'text-yellow-600' : 'text-red-600'}`}>{member.status}</p>
                            </div>
                        ))}
                     </div>
                </Card>
            </div>
        </div>
    );
  }

  const renderPilgrimDashboard = () => {
    const tabs = [
      { id: 'home', name: 'Home', icon: <HomeIcon /> },
      { id: 'hub', name: translations.familyHub.title, icon: <HeartIcon /> },
      { id: 'items', name: translations.dashboard.myItems, icon: <TagIcon /> },
      { id: 'nav', name: translations.navigation.title, icon: <MapIcon /> },
      { id: 'guide', name: translations.guide.title, icon: <SparklesIcon /> },
      { id: 'reports', name: translations.dashboard.myReports, icon: <ArchiveIcon /> },
    ];
    
    return (
      <>
        <div className="space-y-6">
          <div className="bg-white rounded-full shadow-md p-2 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center p-3 rounded-full text-sm font-semibold transition-colors ${
                  activeTab === tab.id ? 'bg-orange-500 text-white shadow' : 'text-gray-600 hover:bg-orange-100'
                }`}
              >
                {tab.icon}
                <span className="ml-2 hidden md:inline">{tab.name}</span>
              </button>
            ))}
          </div>
          <div>
            {activeTab === 'home' && renderPilgrimOverview()}
            {activeTab === 'hub' && <FamilyHub />}
            {activeTab === 'items' && <MyItems />}
            {activeTab === 'nav' && <IntelligentNav />}
            {activeTab === 'guide' && <PilgrimGuide />}
            {activeTab === 'reports' && <MyReports />}
          </div>
        </div>
        <UserGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      </>
    );
  };

  const renderDashboardByRole = () => {
    switch (user.role) {
      case UserRole.PILGRIM:
        return renderPilgrimDashboard();
      case UserRole.ADMIN:
        return <AdminDashboard />;
      case UserRole.AUTHORITY:
        return <AuthoritiesDashboard />;
      case UserRole.VOLUNTEER:
        return <VolunteerDashboard />;
      default:
        return <p>Invalid user role.</p>;
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
            <h1 className="text-4xl font-bold text-gray-800">{translations.dashboard.greeting}, {user.name}!</h1>
            <p className="text-lg text-gray-500">Role: {user.role}</p>
        </div>
        <div className="flex items-center gap-2">
          {user.role === UserRole.PILGRIM && (
            <Button onClick={() => setIsGuideOpen(true)} variant="secondary" className="text-sm flex items-center">
              <QuestionMarkCircleIcon />
              {translations.dashboard.userGuide}
            </Button>
          )}
          {(user.role === UserRole.PILGRIM || user.role === UserRole.VOLUNTEER) && (
            <Button onClick={() => navigate('/report')} className="text-lg flex items-center">
                <PlusCircleIcon />
                {translations.dashboard.fileReport}
            </Button>
          )}
        </div>
      </div>
      {renderDashboardByRole()}
    </div>
  );
};

export default DashboardPage;