
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLocalization } from '../hooks/useLocalization';
import { LostFoundReport, UserRole } from '../types';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import AuthoritiesDashboard from '../components/dashboard/AuthoritiesDashboard';
import VolunteerDashboard from '../components/dashboard/VolunteerDashboard';
import FamilyHub from '../components/dashboard/FamilyHub';
import IntelligentNav from '../components/dashboard/IntelligentNav';
import PilgrimGuide from '../components/dashboard/PilgrimGuide';
import MyItems from '../components/dashboard/MyItems';
import AiAlerts from '../components/dashboard/AiAlerts';
import CrowdDensityIndicator from '../components/dashboard/CrowdDensityIndicator';
import { Card } from '../components/ui/Card';
import ReportDetailsModal from '../components/dashboard/ReportDetailsModal';
import { MOCK_LOST_FOUND_REPORTS } from '../data/mockData';
import { UserGuideModal } from '../components/dashboard/UserGuideModal';
import { Button } from '../components/ui/Button';

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
    const [activeTab, setActiveTab] = useState('familyHub');
    const [isGuideOpen, setGuideOpen] = useState(false);

    const tabs = {
        familyHub: { name: translations.dashboard.pilgrim.familyHub, component: <FamilyHub /> },
        navigation: { name: translations.dashboard.pilgrim.navigation, component: <IntelligentNav /> },
        guide: { name: translations.dashboard.pilgrim.guide, component: <PilgrimGuide /> },
        myItems: { name: translations.dashboard.pilgrim.myItems, component: <MyItems /> },
        myReports: { name: translations.dashboard.pilgrim.myReports, component: <MyReports /> },
    };

    return (
        <>
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold">{translations.dashboard.greeting}, {user?.name.split(' ')[0]}!</h2>
                    <p className="text-gray-600">{translations.dashboard.pilgrim.welcome}</p>
                </div>
                <Button onClick={() => setGuideOpen(true)} variant="secondary">
                    {translations.userGuide.button}
                </Button>
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
