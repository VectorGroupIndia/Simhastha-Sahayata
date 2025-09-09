import React, { useState, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLocalization } from '../hooks/useLocalization';
import LanguageSelector from './LanguageSelector';
import LoginModal from './LoginModal';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { AppContext } from '../context/AppContext';
import { NAV_LINKS } from '../constants';
import { UserRole } from '../types';

const SosIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>;

/**
 * The main application header.
 * It provides navigation, access to login/logout, and language switching.
 * It is responsive and adapts to different screen sizes.
 */
const Header: React.FC = () => {
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);
  const { user, logout } = useAuth();
  const { language, translations } = useLocalization();
  const appContext = useContext(AppContext);
  const navigate = useNavigate();

  if (!appContext) {
    throw new Error("AppContext not found");
  }
  const { isSosActive, setSosStatus, setSosConfirmed } = appContext;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleReportClick = () => {
    if (user) {
      navigate('/report');
    } else {
      setLoginModalOpen(true);
    }
  };
  
  const handleSosClick = () => {
    setIsSosModalOpen(true);
  };

  const confirmSOS = () => {
    setSosStatus(true);
    setIsSosModalOpen(false);
    setSosConfirmed(true); // Trigger the follow-up modal
  };


  const navLinks = NAV_LINKS[language] || NAV_LINKS.en;
  const canReport = !user || user.role === UserRole.PILGRIM || user.role === UserRole.VOLUNTEER;

  return (
    <>
      <header className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <NavLink to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-orange-600">Simhastha Sahayata</span>
            </NavLink>

            <nav className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                <NavLink key={link.name} to={link.path} className={({ isActive }) => `text-gray-600 hover:text-orange-500 font-medium transition-colors ${isActive ? 'text-orange-600' : ''}`}>{link.name}</NavLink>
              ))}
              {user && <NavLink to="/dashboard" className={({ isActive }) => `text-gray-600 hover:text-orange-500 font-medium transition-colors ${isActive ? 'text-orange-600' : ''}`}>{translations.dashboard.title}</NavLink>}
            </nav>

            <div className="flex items-center space-x-4">
              {canReport && (
                <div className="hidden md:block">
                    <Button onClick={handleReportClick} variant="secondary">{translations.home.reportButton}</Button>
                </div>
              )}
              {user ? (
                <div className="hidden md:flex items-center space-x-4">
                   <Button onClick={handleSosClick} variant="danger" className={`px-3 ${isSosActive ? 'animate-pulse' : ''}`} disabled={isSosActive}><SosIcon/><span className="ml-1.5">{translations.header.sosButton}</span></Button>
                   <NavLink to="/profile" className="text-sm font-semibold text-gray-700 hover:text-orange-500">{translations.dashboard.greeting}, {user.name.split(' ')[0]}!</NavLink>
                   <Button onClick={handleLogout} variant="secondary" className="px-4 py-1.5 text-sm">{translations.auth.logout}</Button>
                </div>
              ) : (
                <Button onClick={() => setLoginModalOpen(true)} className="hidden md:block">{translations.auth.loginRegister}</Button>
              )}
              <LanguageSelector />
              <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-gray-600 hover:text-orange-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
              </button>
            </div>
          </div>
        </div>
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white shadow-lg">
            <nav className="flex flex-col space-y-2 p-4">
              {navLinks.map((link) => (
                <NavLink key={link.name} to={link.path} className={({ isActive }) => `text-gray-600 hover:text-orange-500 p-2 rounded ${isActive ? 'bg-orange-100 text-orange-600' : ''}`} onClick={() => setMobileMenuOpen(false)}>{link.name}</NavLink>
              ))}
               <div className="border-t pt-4 flex flex-col items-start space-y-3">
                    {canReport && (
                      <Button onClick={() => {handleReportClick(); setMobileMenuOpen(false);}} className="w-full" variant="secondary">{translations.home.reportButton}</Button>
                    )}
                    {user ? (
                        <>
                           <Button onClick={() => {handleSosClick(); setMobileMenuOpen(false);}} variant="danger" className={`w-full ${isSosActive ? 'animate-pulse' : ''}`} disabled={isSosActive}>{translations.header.sosButton}</Button>
                           <NavLink to="/profile" className="font-semibold text-gray-700 w-full text-center p-2 rounded hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>{translations.dashboard.greeting}, {user.name.split(' ')[0]}!</NavLink>
                           <NavLink to="/dashboard" className="text-gray-600 hover:text-orange-500 w-full text-center p-2 rounded" onClick={() => setMobileMenuOpen(false)}>{translations.dashboard.title}</NavLink>
                           <Button onClick={()=>{handleLogout(); setMobileMenuOpen(false);}} variant="secondary" className="w-full">{translations.auth.logout}</Button>
                        </>
                    ) : (
                        <Button onClick={() => {setLoginModalOpen(true); setMobileMenuOpen(false);}} variant="primary" className="w-full">{translations.auth.loginRegister}</Button>
                    )}
                </div>
            </nav>
          </div>
        )}
      </header>
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setLoginModalOpen(false)} />
       <Modal
        isOpen={isSosModalOpen}
        onClose={() => setIsSosModalOpen(false)}
        title={translations.header.sosConfirmTitle}
      >
        <div className="text-center">
          <p className="text-gray-600 mb-6">{translations.header.sosConfirmText}</p>
          <div className="flex justify-center gap-4">
            <Button variant="secondary" onClick={() => setIsSosModalOpen(false)}>
              {translations.familyHub.sosCancelButton}
            </Button>
            <Button variant="danger" onClick={confirmSOS}>
              {translations.familyHub.sosConfirmButton}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Header;