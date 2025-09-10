

import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLocalization } from '../hooks/useLocalization';
import { LostFoundReport, UserRole, Navigatable, SosAlert } from '../types';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import AuthoritiesDashboard from '../components/dashboard/AuthoritiesDashboard';
import VolunteerDashboard from '../components/dashboard/VolunteerDashboard';
import FamilyHub from '../components/dashboard/FamilyHub';
import PilgrimGuide from '../components/dashboard/PilgrimGuide';
import MyItems from '../components/dashboard/MyItems';
import AiAlerts from '../components/dashboard/AiAlerts';
import CrowdDensityIndicator from '../components/dashboard/CrowdDensityIndicator';
import { Card } from '../components/ui/Card';
import ReportDetailsModal from '../components/dashboard/ReportDetailsModal';
import { MOCK_LOST_FOUND_REPORTS, MOCK_SOS_ALERTS } from '../data/mockData';
import { UserGuideModal } from '../components/dashboard/UserGuideModal';
import { Button } from '../components/ui/Button';
import LiveMapView from '../components/dashboard/LiveMapView';
import { NavigationModal } from '../components/dashboard/NavigationModal';
import { useToast } from '../hooks/useToast';
import { BroadcastAlertModal } from '../components/dashboard/BroadcastAlertModal';

// --- ICONS ---
const BroadcastIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.636 5.636a9 9 0 0112.728 0M8.464 15.536a5 5 0 010-7.072" /></svg>;

// --- MyReports Component (for Pilgrim Dashboard) ---
const MyReports: React.FC = () => {
    const { user } = useAuth();
    const { translations } = useLocalization();
    const [selectedReport, setSelectedReport] = useState<LostFoundReport | null>(null);

    if (!user) return null;

    const userReports = MOCK_LOST_FOUND_REPORTS.filter(report => report.reportedById === user.id);

    const getStatusClasses = (status: LostFoundReport['status']) => {
        switch (status) {
            case 'Open': return 'bg-yellow-200 text-yellow-800';
            case 'In Progress': return 'bg-blue-200 text-blue-800';
            case 'Resolved': return 'bg-green-200 text-green-800';
            default: return 'bg-gray-200 text-gray-800';
        }
    };
    
    return (
        <>
            <Card>
                <h3 className="text-2xl font-bold mb-4">{translations.myReports.title}</h3>
                {userReports.length > 0 ? (
                    <div className="space-y-4">
                        {userReports.map(report => (
                            <div key={report.id} className="bg-gray-50 p-4 rounded-lg flex flex-col md:flex-row justify-between md:items-center gap-4">
                                <div>
                                    <p className="font-bold text-lg">{report.personName || report.itemName}</p>
                                    <p className="text-sm text-gray-500">{translations.myReports.reportedOn}: {new Date(report.timestamp).toLocaleDateString()}</p>
                                    <p className="text-sm text-gray-600 truncate max-w-md">{report.description}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                     <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusClasses(report.status)}`}>
                                        {report.status}
                                    </span>
                                    <Button variant="secondary" onClick={() => setSelectedReport(report)}>{translations.myReports.viewDetails}</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 py-8">{translations.myReports.noReports}</p>
                )}
            </Card>
            <ReportDetailsModal 
                isOpen={!!selectedReport}
                onClose={() => setSelectedReport(null)}
                report={selectedReport}
            />
        </>
    );
};


// --- PilgrimDashboard Component ---
const PilgrimDashboard: React.FC = () => {
    const { translations } = useLocalization();
    const { user } = useAuth();
    const { addToast } = useToast();
    const [activeTab, setActiveTab] = useState('familyHub');
    const [isGuideOpen, setGuideOpen] = useState(false);
    const [navigationTarget, setNavigationTarget] = useState<Navigatable | null>(null);
    const [isBroadcastModalOpen, setBroadcastModalOpen] = useState(false);

    const tabs = {
        familyHub: { name: translations.dashboard.pilgrim.familyHub, component: <FamilyHub /> },
        liveMap: { name: translations.dashboard.pilgrim.liveMap, component: <LiveMapView onNavigate={setNavigationTarget} /> },
        guide: { name: translations.dashboard.pilgrim.guide, component: <PilgrimGuide /> },
        myItems: { name: translations.dashboard.pilgrim.myItems, component: <MyItems /> },
        myReports: { name: translations.dashboard.pilgrim.myReports, component: <MyReports /> },
    };

    const handleConfirmBroadcast = (message: string) => {
        if (!user) return;

        // Simulate location for pilgrims if not available
        const pilgrimLocation = user.locationCoords || { 
            lat: 23.1793 + (Math.random() - 0.5) * 0.1,
            lng: 75.7873 + (Math.random() - 0.5) * 0.1,
        };

        const newAlert: SosAlert = {
            id: Date.now(),
            userId: user.id,
            userName: user.name,
            timestamp: new Date().toISOString(),
            status: 'Broadcasted',
            locationCoords: pilgrimLocation,
            message: message,
        };

        MOCK_SOS_ALERTS.unshift(newAlert);
        
        addToast(translations.dashboard.broadcastModal.success, 'success');
        setBroadcastModalOpen(false);
    };

    return (
        <>
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold">{translations.dashboard.greeting}, {user?.name.split(' ')[0]}!</h2>
                    <p className="text-gray-600">{translations.dashboard.pilgrim.welcome}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button onClick={() => setBroadcastModalOpen(true)} variant="danger" className="flex items-center">
                        <BroadcastIcon /> {translations.dashboard.volunteer.broadcastAlert}
                    </Button>
                    <Button onClick={() => setGuideOpen(true)} variant="secondary">
                        {translations.userGuide.button}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CrowdDensityIndicator />
                <AiAlerts />
            </div>
            
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-4 overflow-x-auto">
                    {Object.entries(tabs).map(([key, tab]) => (
                         <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`whitespace-nowrap py-4 px-3 border-b-2 font-medium text-sm ${
                                activeTab === key
                                ? 'border-orange-500 text-orange-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            {tab.name}
                        </button>
                    ))}
                </nav>
            </div>
            <div className="mt-6 animate-fade-in">
                {tabs[activeTab as keyof typeof tabs].component}
            </div>
        </div>
        <UserGuideModal isOpen={isGuideOpen} onClose={() => setGuideOpen(false)} />
        <NavigationModal
            isOpen={!!navigationTarget}
            onClose={() => setNavigationTarget(null)}
            destination={navigationTarget}
        />
        <BroadcastAlertModal
            isOpen={isBroadcastModalOpen}
            onClose={() => setBroadcastModalOpen(false)}
            onConfirm={handleConfirmBroadcast}
        />
        </>
    );
};


// --- Main DashboardPage Component ---
const DashboardPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/" />;
  }

  const renderDashboard = () => {
    switch (user.role) {
      case UserRole.ADMIN:
        return <AdminDashboard />;
      case UserRole.AUTHORITY:
        return <AuthoritiesDashboard />;
      case UserRole.VOLUNTEER:
        return <VolunteerDashboard />;
      case UserRole.PILGRIM:
      default:
        return <PilgrimDashboard />;
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {renderDashboard()}
    </div>
  );
};

export default DashboardPage;