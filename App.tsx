import React, { useState, useEffect, useContext } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppProvider, AppContext } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import ReportLostFoundPage from './pages/ReportLostFoundPage';
import AboutUsPage from './pages/AboutUsPage';
import ContactUsPage from './pages/ContactUsPage';
import FAQPage from './pages/FAQPage';
import Header from './components/Header';
import Footer from './components/Footer';
import ProfilePage from './pages/ProfilePage';
import CookieConsentBanner from './components/CookieConsentBanner';
import CookieSettingsModal from './components/CookieSettingsModal';
import ToastContainer from './components/ToastContainer';
import { SosCallModal } from './components/dashboard/SosCallModal';
import { useAuth } from './hooks/useAuth';
import { DEMO_USERS } from './constants';
import { UserRole } from './types';
import AiDashboardPage from './pages/AiDashboardPage';

/**
 * The root component of the application.
 * It sets up the main structure including routing and context providers.
 * Note: HashRouter is used as per project constraints to avoid URL path manipulation.
 */
function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <ToastProvider>
          <MainApp />
        </ToastProvider>
      </AuthProvider>
    </AppProvider>
  );
}

// MainApp component to access context from providers
const MainApp = () => {
  const [showCookieBanner, setShowCookieBanner] = useState(false);
  const [isCookieModalOpen, setIsCookieModalOpen] = useState(false);
  const appContext = useContext(AppContext);
  const { user } = useAuth();
  
  // --- Maintenance Mode Check ---
  // In a real app, this would be a global setting fetched from a backend.
  // Here, we simulate it by checking the settings of the first admin user in our mock data.
  const adminUser = DEMO_USERS.find(u => u.role === UserRole.ADMIN);
  const isMaintenanceMode = adminUser?.settings?.systemSettings?.maintenanceMode || false;

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setShowCookieBanner(true);
    }
  }, []);

  const handleAcceptCookies = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    setShowCookieBanner(false);
  };
  
  const handleRejectCookies = () => {
    localStorage.setItem('cookie_consent', 'rejected');
    setShowCookieBanner(false);
  };

  const handleModifyCookies = () => {
    setIsCookieModalOpen(true);
  };
  
  const handleSaveCookieSettings = (settings: object) => {
    localStorage.setItem('cookie_consent', JSON.stringify(settings));
    setIsCookieModalOpen(false);
    setShowCookieBanner(false);
  };

  if (!appContext) return null; // Should not happen

  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen bg-orange-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
        {isMaintenanceMode && user?.role !== UserRole.ADMIN && (
            <div className="bg-yellow-500 text-white text-center p-2 font-semibold z-50">
                {appContext.translations.profile.maintenanceModeBanner}
            </div>
        )}
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/ai-dashboard" element={<AiDashboardPage />} />
            <Route path="/report" element={<ReportLostFoundPage />} />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/contact" element={<ContactUsPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </main>
        <Footer />
        <ToastContainer />
        {showCookieBanner && (
          <CookieConsentBanner 
            onAccept={handleAcceptCookies}
            onReject={handleRejectCookies}
            onModify={handleModifyCookies}
          />
        )}
        <CookieSettingsModal
          isOpen={isCookieModalOpen}
          onClose={() => setIsCookieModalOpen(false)}
          onSave={handleSaveCookieSettings}
        />
        <SosCallModal 
          isOpen={appContext.sosConfirmed}
          onClose={() => appContext.setSosConfirmed(false)}
        />
      </div>
    </HashRouter>
  );
}


export default App;