import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserRole, LostFoundReport } from '../types';
import { useLocalization } from '../hooks/useLocalization';
import FamilyHub from '../components/dashboard/FamilyHub';
import IntelligentNav from '../components/dashboard/IntelligentNav';
import PilgrimGuide from '../components/dashboard/PilgrimGuide';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import AuthoritiesDashboard from '../components/dashboard/AuthoritiesDashboard';
import VolunteerDashboard from '../components/dashboard/VolunteerDashboard';
import ReportDetailsModal from '../components/dashboard/ReportDetailsModal';
import { Button } from '../components/ui/Button';
import { MOCK_LOST_FOUND_REPORTS } from '../data/mockData';
import { Card } from '../components/ui/Card';
import { getAiSearchResults } from '../services/geminiService';
import { Spinner } from '../components/ui/Spinner';
import { ImageZoomModal } from '../components/ui/ImageZoomModal';
import CrowdDensityIndicator from '../components/dashboard/CrowdDensityIndicator';
import AiAlerts from '../components/dashboard/AiAlerts';
import { UserGuideModal } from '../components/dashboard/UserGuideModal';
import { ReportsMapView } from '../components/dashboard/ReportsMapView';

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
  const [activeTab, setActiveTab] = useState('hub');
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const navigate = useNavigate();

  if (!isAuthenticated || !user) {
    return <Navigate to="/" />;
  }

  const renderPilgrimDashboard = () => {
    const tabs = [
      { id: 'hub', name: translations.familyHub.title, icon: <HeartIcon /> },
      { id: 'nav', name: translations.navigation.title, icon: <MapIcon /> },
      { id: 'guide', name: translations.guide.title, icon: <SparklesIcon /> },
      { id: 'reports', name: translations.dashboard.myReports, icon: <ArchiveIcon /> },
    ];
    
    return (
      <>
        <div className="space-y-6">
          <CrowdDensityIndicator />
          <AiAlerts />

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
            {activeTab === 'hub' && <FamilyHub />}
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
          <Button onClick={() => navigate('/report')} className="text-lg flex items-center">
              <PlusCircleIcon />
              {translations.dashboard.fileReport}
          </Button>
        </div>
      </div>
      {renderDashboardByRole()}
    </div>
  );
};

export default DashboardPage;