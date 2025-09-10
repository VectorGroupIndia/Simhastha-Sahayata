
/*********************************************************************************
 * Author: Sujit Babar
 * Company: Transfigure Technologies Pvt. Ltd.
 *
 * Copyright Note: All rights reserved.
 * The code, design, process, logic, thinking, and overall layout structure
 * of this application are the intellectual property of Transfigure Technologies Pvt. Ltd.
 * This notice is for informational purposes only and does not grant any rights
 * to copy, modify, or distribute this code without explicit written permission.
 * This code is provided as-is and is intended for read-only inspection. It cannot be edited.
 *********************************************************************************/
import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLocalization } from '../hooks/useLocalization';
import { LostFoundReport, UserRole, Navigatable, SosAlert } from '../types';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import AuthoritiesDashboard from '../components/dashboard/AuthoritiesDashboard';
import VolunteerDashboard from '../components/dashboard/VolunteerDashboard';
import FamilyHub from '../components/dashboard/FamilyHub';
import PilgrimGuide from '../components/dashboard/PilgrimGuide';
import AiAlerts from '../components/dashboard/AiAlerts';
import CrowdDensityIndicator from '../components/dashboard/CrowdDensityIndicator';
import { Card } from '../components/ui/Card';
import { MOCK_LOST_FOUND_REPORTS, MOCK_SOS_ALERTS, MOCK_FAMILY_MEMBERS, MOCK_BROADCASTS } from '../data/mockData';
import { UserGuideModal } from '../components/dashboard/UserGuideModal';
import { Button } from '../components/ui/Button';
import LiveMapView from '../components/dashboard/LiveMapView';
import { NavigationModal } from '../components/dashboard/NavigationModal';
import { useToast } from '../hooks/useToast';
import { BroadcastAlertModal } from '../components/dashboard/BroadcastAlertModal';
import MyItems from '../components/dashboard/MyItems';
import { MyReports } from '../components/profile/MyReports';
import { RequestEscortModal } from '../components/dashboard/RequestEscortModal';

// --- ICONS ---
const BroadcastIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.636 5.636a9 9 0 0112.728 0M8.464 15.536a5 5 0 010-7.072" /></svg>;
const SosIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
const ReportIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const GuideIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;
const EscortIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;


// --- PilgrimDashboardOverview Component ---
const PilgrimDashboardOverview: React.FC<{ setActiveTab: (tab: string) => void; onEscortRequest: () => void; }> = ({ setActiveTab, onEscortRequest }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { translations } = useLocalization();

    const familyInAlert = MOCK_FAMILY_MEMBERS.filter(m => m.status === 'Alert' || m.status === 'Lost');
    const locatedReports = MOCK_LOST_FOUND_REPORTS.filter(r => r.reportedById === user?.id && r.status === 'Located');
    const userReports = MOCK_LOST_FOUND_REPORTS.filter(r => r.reportedById === user?.id).slice(0, 3);
    const crowdAlerts = MOCK_BROADCASTS.filter(b => b.isCrowdAlert && new Date(b.timestamp) > new Date(Date.now() - 30 * 60000)); // active in last 30 mins

    const hasPriorityAlert = familyInAlert.length > 0 || locatedReports.length > 0 || crowdAlerts.length > 0;


    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Button variant="danger" className="h-24 text-lg flex flex-col items-center justify-center" onClick={() => navigate('/#') /* Placeholder for SOS modal */}>
                            <SosIcon /> Trigger SOS
                        </Button>
                        <Button variant="primary" className="h-24 text-lg flex flex-col items-center justify-center" onClick={() => navigate('/report')}>
                            <ReportIcon /> Report
                        </Button>
                        <Button variant="secondary" className="h-24 text-lg flex flex-col items-center justify-center" onClick={() => setActiveTab('guide')}>
                            <GuideIcon /> Ask Guide
                        </Button>
                         <Button variant="secondary" className="h-24 text-lg flex flex-col items-center justify-center" onClick={onEscortRequest}>
                            <EscortIcon /> {translations.dashboard.pilgrim.requestEscort}
                         </Button>
                    </div>
                </Card>
                <Card>
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-xl font-bold">Priority Alerts</h3>
                    </div>
                    <div className="space-y-3">
                        {crowdAlerts.map(alert => (
                            <div key={alert.id} className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-lg">
                                <p className="font-semibold text-yellow-800">Crowd Alert from Command Center</p>
                                <p className="text-sm text-gray-700">{alert.message}</p>
                            </div>
                        ))}
                         {locatedReports.map(report => (
                            <div key={report.id} className="p-3 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
                                <p className="font-semibold">Update on your report: <span className="text-green-600">{report.personName} has been located!</span></p>
                                <p className="text-sm text-gray-600">Check 'My Reports' for their current location and details.</p>
                            </div>
                         ))}
                         {familyInAlert.map(member => (
                            <div key={member.id} className="p-3 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                                <p className="font-semibold">{member.name} has status: <span className="text-red-600">{member.status}</span></p>
                                <p className="text-sm text-gray-600">Please check the Family Hub for their last known location.</p>
                            </div>
                         ))}
                         {!hasPriorityAlert && (
                            <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                               <p className="font-semibold">All Clear</p>
                               <p className="text-sm text-gray-600">No high-priority alerts for you at the moment. Stay safe!</p>
                           </div>
                         )}
                    </div>
                </Card>
            </div>
            {/* Right Column */}
            <div className="space-y-6">
                <Card>
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-xl font-bold">Family Status</h3>
                        <Button variant="secondary" className="text-xs py-1 px-2" onClick={() => setActiveTab('familyHub')}>View Family Hub</Button>
                    </div>
                    <div className="space-y-2">
                        {MOCK_FAMILY_MEMBERS.map(member => (
                            <div key={member.id} className="flex items-center bg-gray-50 p-2 rounded-lg">
                                <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full mr-3" />
                                <p className="font-medium flex-grow">{member.name}</p>
                                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                                    member.status === 'Safe' ? 'bg-green-100 text-green-800' :
                                    member.status === 'Alert' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                }`}>{member.status}</span>
                            </div>
                        ))}
                    </div>
                </Card>
                 <Card>
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-xl font-bold">My Recent Reports</h3>
                        <Button variant="secondary" className="text-xs py-1 px-2" onClick={() => setActiveTab('myReports')}>View All</Button>
                    </div>
                    <div className="space-y-2">
                       {userReports.length > 0 ? userReports.map(report => (
                           <div key={report.id} className="bg-gray-50 p-2 rounded-lg">
                               <p className="font-semibold text-sm truncate">{report.personName || report.itemName}</p>
                               <p className="text-xs text-gray-500">Status: {report.status}</p>
                           </div>
                       )) : <p className="text-sm text-gray-500 text-center py-4">No reports filed yet.</p>}
                    </div>
                </Card>
            </div>
        </div>
    );
};


// --- PilgrimDashboard Component ---
const PilgrimDashboard: React.FC = () => {
    const { translations } = useLocalization();
    const { user } = useAuth();
    const { addToast } = useToast();
    const [activeTab, setActiveTab] = useState('overview');
    const [isGuideOpen, setGuideOpen] = useState(false);
    const [navigationTarget, setNavigationTarget] = useState<Navigatable | null>(null);
    const [isBroadcastModalOpen, setBroadcastModalOpen] = useState(false);
    const [isEscortModalOpen, setEscortModalOpen] = useState(false);

    const tabs = {
        overview: { name: 'Overview', component: <PilgrimDashboardOverview setActiveTab={setActiveTab} onEscortRequest={() => setEscortModalOpen(true)} /> },
        familyHub: { name: translations.dashboard.pilgrim.familyHub, component: <FamilyHub /> },
        liveMap: { name: translations.dashboard.pilgrim.liveMap, component: <LiveMapView onNavigate={setNavigationTarget} /> },
        myItems: { name: translations.dashboard.pilgrim.myItems, component: <MyItems /> },
        myReports: { name: translations.dashboard.pilgrim.myReports, component: <MyReports /> },
        guide: { name: translations.dashboard.pilgrim.guide, component: <PilgrimGuide onNavigate={setNavigationTarget} /> },
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

    const handleConfirmEscortRequest = (from: string, to: string, message: string) => {
        if (!user) return;

        const newEscortTask: LostFoundReport = {
            id: `ESCORT-${Date.now()}`,
            taskType: 'Escort',
            type: 'Found', // Semantically, we "found" someone needing help
            category: 'Person',
            personName: user.name,
            description: `Escort from "${from}" to "${to}". User message: ${message || 'N/A'}`,
            lastSeen: from,
            reportedBy: user.name,
            reportedById: user.id,
            timestamp: new Date().toISOString(),
            status: 'Open',
            priority: 'High',
            locationCoords: user.locationCoords,
        };

        MOCK_LOST_FOUND_REPORTS.unshift(newEscortTask);
        addToast(translations.escortModal.success, 'success');
        setEscortModalOpen(false);
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
                    <Button onClick={() => setBroadcastModalOpen(true)} variant="secondary" className="flex items-center">
                        <BroadcastIcon /> Broadcast Alert
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
         <RequestEscortModal
            isOpen={isEscortModalOpen}
            onClose={() => setEscortModalOpen(false)}
            onConfirm={handleConfirmEscortRequest}
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
