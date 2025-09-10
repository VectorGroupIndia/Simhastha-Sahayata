
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import LoginModal from '../components/LoginModal';
import { useAuth } from '../hooks/useAuth';
import { useLocalization } from '../hooks/useLocalization';
// FIX: Import LANGUAGES from constants instead of useLocalization hook
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
      <div className="relative rounded-2xl overflow-hidden shadow-2xl min-h-[50vh] flex items-center justify-center text-center p-8 bg-gradient-to-br from-orange-500 to-yellow-400">
        <div className="relative z-10 text-white">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 animate-fade-in-down">{translations.home.welcome}</h1>
          <p className="text-lg md:text-2xl mb-8 animate-fade-in-up">{translations.home.tagline}</p>
          <div className="flex justify-center">
            <Button 
              onClick={handleReportClick} 
              className="text-xl font-bold px-8 py-4 animate-pulse shadow-lg hover:shadow-xl ring-4 ring-white/30 hover:ring-white/50 transition-all transform hover:scale-110"
            >
              {translations.home.reportButton}
            </Button>
          </div>
        </div>
      </div>

      {/* Language List Section */}
      <div className="my-16 text-center">
        <h2 className="text-3xl font-bold mb-2">Connect in Your Language</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">Our services are available in multiple Indian languages to ensure everyone can get the help they need.</p>
        <div className="flex flex-wrap justify-center gap-4">
          {LANGUAGES.map(lang => (
            <span key={lang.code} className="bg-white dark:bg-gray-800 shadow-md rounded-full px-5 py-2 text-lg font-semibold text-gray-700 dark:text-gray-200">
              {lang.name}
            </span>
          ))}
        </div>
      </div>

      {/* Other Ways to Connect Section */}
      <div className="my-16 text-center">
         <h2 className="text-3xl font-bold mb-8">{translations.home.otherWays}</h2>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <a href="https://wa.me/+917276199099" target="_blank" rel="noopener noreferrer" className="block">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
                    <h3 className="text-2xl font-bold text-green-500 mb-2">WhatsApp</h3>
                    <div className="mt-4 bg-green-50 dark:bg-gray-700 p-3 rounded-lg border border-green-200 dark:border-gray-600">
                        <p className="text-md font-medium text-gray-800 dark:text-gray-300">
                            Send 'HELP' to <br /> <span className="font-bold text-green-600 dark:text-green-400 text-lg">+91-7276199099</span>
                        </p>
                    </div>
                </div>
            </a>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
                <h3 className="text-2xl font-bold text-blue-500 mb-2">SMS</h3>
                <div className="mt-4 bg-blue-50 dark:bg-gray-700 p-3 rounded-lg border border-blue-200 dark:border-gray-600">
                    <p className="text-md font-medium text-gray-800 dark:text-gray-300">
                        Text 'LOST' or 'FOUND' to <br /> <span className="font-bold text-blue-600 dark:text-blue-400 text-lg">555-55</span>
                    </p>
                </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
                <h3 className="text-2xl font-bold text-purple-500 mb-2">IVR Call</h3>
                <div className="mt-4 bg-purple-50 dark:bg-gray-700 p-3 rounded-lg border border-purple-200 dark:border-gray-600">
                    <p className="text-md font-medium text-gray-800 dark:text-gray-300">
                        Dial for assistance <br /> <span className="font-bold text-purple-600 dark:text-purple-400 text-lg">1800-XXX-XXXX</span>
                    </p>
                </div>
            </div>
         </div>
      </div>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setLoginModalOpen(false)} />
    </div>
  );
};

export default HomePage;
