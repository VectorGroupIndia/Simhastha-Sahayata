
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import LoginModal from '../components/LoginModal';
import { useAuth } from '../hooks/useAuth';
import { useLocalization } from '../hooks/useLocalization';
import { LANGUAGES } from '../constants';

/**
 * The Home Page component.
 * This is the main landing page for users. It features a prominent hero section
 * with calls-to-action for reporting lost/found items and directs users to log in
 * if they are not authenticated.
 */
const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  // FIX: Import LANGUAGES from constants instead of useLocalization hook
  const { translations } = useLocalization();

  const handleReportClick = () => {
    if (isAuthenticated) {
      navigate('/report');
    } else {
      setLoginModalOpen(true);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl min-h-[50vh] flex items-center justify-center text-center p-8 bg-black">
        <img 
          src="https://images.unsplash.com/photo-1620766165502-9958b8830862?q=80&w=1974&auto=format&fit=crop" 
          alt="Ujjain Mahakumbh" 
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="relative z-10 text-white">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 animate-fade-in-down">{translations.home.welcome}</h1>
          <p className="text-lg md:text-2xl mb-8 animate-fade-in-up">{translations.home.tagline}</p>
          <div className="flex justify-center">
            <Button onClick={handleReportClick} className="text-lg animate-pulse">
              {translations.home.reportButton}
            </Button>
          </div>
        </div>
      </div>

      {/* Language List Section */}
      <div className="my-16 text-center">
        <h2 className="text-3xl font-bold mb-2">Connect in Your Language</h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">Our services are available in multiple Indian languages to ensure everyone can get the help they need.</p>
        <div className="flex flex-wrap justify-center gap-4">
          {LANGUAGES.map(lang => (
            <span key={lang.code} className="bg-white shadow-md rounded-full px-5 py-2 text-lg font-semibold text-gray-700">
              {lang.name}
            </span>
          ))}
        </div>
      </div>

      {/* Other Ways to Connect Section */}
      <div className="my-16 text-center">
         <h2 className="text-3xl font-bold mb-8">{translations.home.otherWays}</h2>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <a href="https://wa.me/+917276199099" target="_blank" rel="noopener noreferrer" className="block hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="bg-white p-6 rounded-xl shadow-lg text-center h-full">
                    <h3 className="text-2xl font-bold text-green-500 mb-2">WhatsApp</h3>
                    <p>Send 'HELP' to +91-7276199099</p>
                </div>
            </a>
             <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                <h3 className="text-2xl font-bold text-blue-500 mb-2">SMS</h3>
                <p>Text 'LOST' or 'FOUND' to 555-55</p>
            </div>
             <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                <h3 className="text-2xl font-bold text-purple-500 mb-2">IVR Call</h3>
                <p>Dial 1800-XXX-XXXX for assistance</p>
            </div>
         </div>
      </div>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setLoginModalOpen(false)} />
    </div>
  );
};

export default HomePage;
