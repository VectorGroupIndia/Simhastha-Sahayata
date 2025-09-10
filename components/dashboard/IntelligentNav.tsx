


import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Spinner } from '../ui/Spinner';
import { getNavigationRoute } from '../../services/geminiService';
import { useLocalization } from '../../hooks/useLocalization';
import { IntelligentNavProps } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';


// SVG Icon Components
const MicIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8h-1a6 6 0 11-5.445-4.971V5a1 1 0 012 0v.93a7.001 7.001 0 00-6 8z" clipRule="evenodd" /></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" /></svg>;

declare global {
    interface Window {
      SpeechRecognition: any;
      webkitSpeechRecognition: any;
    }
}

/**
 * Intelligent Navigation Component.
 * This showcases the AI-powered hyperlocal map feature. Users can ask for directions
 * in natural language, and the system (simulated via Gemini service) provides a route
 * on a custom event map, considering factors like crowd levels.
 */
const IntelligentNav: React.FC<IntelligentNavProps> = ({ destination }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [route, setRoute] = useState<{ text: string; path: string } | null>(null);
  const { translations } = useLocalization();
  const { user } = useAuth();
  const { addToast } = useToast();

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery) return;
    setIsLoading(true);
    setRoute(null);
    try {
      // This simulates a call to the Gemini API which now returns a structured object
      const result = await getNavigationRoute(searchQuery);
      setRoute(result);
    } catch (error) {
      console.error("Navigation error:", error);
      setRoute({ text: translations.navigation.error, path: '' });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (destination) {
      // Trigger navigation automatically when a destination is provided
      const destinationQuery = `Route to ${destination.name}`;
      setQuery(destinationQuery);
      handleSearch(destinationQuery);
    }
  }, [destination]);

  const handleVoiceSearch = () => {
    if (!user?.settings?.microphoneAccess) {
        addToast("Microphone access is disabled in your profile settings.", "error");
        return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Sorry, your browser does not support voice recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US'; // Could be mapped from app context
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsListening(true);

    recognition.onresult = (event: any) => {
      const speechResult = event.results[0][0].transcript;
      setQuery(speechResult);
      handleSearch(speechResult);
    };
    
    recognition.onspeechend = () => {
      recognition.stop();
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.start();
  };


  return (
    <Card>
      <h3 className="text-2xl font-bold mb-4">
        {destination 
          ? translations.navigation.routeTo.replace('{name}', destination.name) 
          : translations.navigation.title
        }
      </h3>
      {!destination && (
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-grow relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={isListening ? "Listening..." : translations.navigation.placeholder}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-orange-500 focus:border-orange-500"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)}
              disabled={isListening}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
               <SearchIcon />
            </div>
          </div>
          <div className="flex gap-2">
              <Button onClick={handleVoiceSearch} variant="secondary" className={`px-4 ${isListening ? 'animate-pulse bg-red-200' : ''}`} disabled={isListening}>
                  <MicIcon />
              </Button>
              <Button onClick={() => handleSearch(query)} disabled={isLoading || !query}>
              {isLoading ? <Spinner size="sm"/> : translations.navigation.search}
              </Button>
          </div>
        </div>
      )}

      <div className="aspect-video bg-gray-200 rounded-lg relative overflow-hidden flex items-center justify-center">
        <img src="https://i.imgur.com/3Z3tV8C.png" alt="Map of Kumbh Mela area" className="w-full h-full object-cover"/>
        {isLoading && <div className="absolute inset-0 bg-white/50 flex items-center justify-center"><Spinner /></div>}
        
        {route && route.path && (
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path
              d={route.path}
              stroke="rgba(249, 115, 22, 0.8)"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-draw-path"
              style={{
                strokeDasharray: 1000,
                strokeDashoffset: 1000,
              }}
            />
          </svg>
        )}

        {route && (
          <div className="absolute top-4 left-4 right-4 bg-white/90 p-3 rounded-lg shadow-lg animate-fade-in-up">
            <p className="font-semibold text-orange-600">{translations.navigation.routeFound}</p>
            <p className="text-gray-700">{route.text}</p>
          </div>
        )}
      </div>
      <style>{`
        @keyframes draw {
          to {
            stroke-dashoffset: 0;
          }
        }
        .animate-draw-path {
          animation: draw 2s ease-in-out forwards;
        }
      `}</style>
    </Card>
  );
};

export default IntelligentNav;