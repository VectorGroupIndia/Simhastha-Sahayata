import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLocalization } from '../hooks/useLocalization';
import LanguageSelector from './LanguageSelector';
import LoginModal from './LoginModal';
import { Button } from './ui/Button';
import { NAV_LINKS } from '../constants';

/**
 * The main application header.
 * It provides navigation, access to login/logout, and language switching.
 * It is responsive and adapts to different screen sizes.
 */
const Header: React.FC = () => {
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { language, translations } = useLocalization();
  const navigate = useNavigate();

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

  const navLinks = NAV_LINKS[language] || NAV_LINKS.en;

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
              <div className="hidden md:block">
                  <Button onClick={handleReportClick} variant="secondary">{translations.home.reportButton}</Button>
              </div>
              {user ? (
                <div className="hidden md:flex items-center space-x-4">
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
                    <Button onClick={() => {handleReportClick(); setMobileMenuOpen(false);}} className="w-full" variant="primary">{translations.home.reportButton}</Button>
                    {user ? (
                        <>
                           <NavLink to="/profile" className="font-semibold text-gray-700 w-full text-center p-2 rounded hover:bg-gray-100" onClick={() => setMobileMenuOpen(false)}>{translations.dashboard.greeting}, {user.name.split(' ')[0]}!</NavLink>
                           <NavLink to="/dashboard" className="text-gray-600 hover:text-orange-500 w-full text-center p-2 rounded" onClick={() => setMobileMenuOpen(false)}>{translations.dashboard.title}</NavLink>
                           <Button onClick={()=>{handleLogout(); setMobileMenuOpen(false);}} variant="secondary" className="w-full">{translations.auth.logout}</Button>
                        </>
                    ) : (
                        <Button onClick={() => {setLoginModalOpen(true); setMobileMenuOpen(false);}} variant="secondary" className="w-full">{translations.auth.loginRegister}</Button>
                    )}
                </div>
            </nav>
          </div>
        )}
      </header>
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setLoginModalOpen(false)} />
    </>
  );
};

export default Header;