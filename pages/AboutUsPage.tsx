import React from 'react';

// --- SVG Icons (defined locally for better encapsulation and performance) ---

const HeartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>;
const MapIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13v-6m0 6l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m0 10v-6m0 6l-6-3" /></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L10 17l-4 4 4-4 2.293-2.293a1 1 0 011.414 0L17 14m-5-5l2.293 2.293a1 1 0 010 1.414L10 17" /></svg>;
const ArchiveIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 001.414 0l2.414-2.414a1 1 0 01.707-.293H21" /></svg>;


interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

/**
 * A reusable card component to display a key feature with an icon, title, and description.
 */
const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="bg-orange-50/50 dark:bg-gray-800/50 p-6 rounded-xl border border-orange-200/50 dark:border-gray-700/50 text-center flex flex-col items-center transform hover:-translate-y-2 transition-transform duration-300">
    <div className="mb-4 text-orange-500">{icon}</div>
    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300 flex-grow">{description}</p>
  </div>
);

const AboutUsPage: React.FC = () => {
  return (
    <div className="bg-orange-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in-down">
          <h1 className="text-4xl md:text-5xl font-extrabold text-orange-600 dark:text-orange-400 mb-4">
            Our Mission: A Safer Kumbh for Everyone
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            We believe technology can transform the pilgrimage experience, making it safer, more connected, and spiritually fulfilling for millions of devotees.
          </p>
        </div>

        {/* Challenge & Solution Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div className="animate-fade-in-left">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">The Challenge: A City of Millions</h2>
            <div className="text-gray-600 dark:text-gray-400 space-y-4">
              <p>The Ujjain Mahakumbh is not just an event; it's a temporary mega-city. The attendees are incredibly diverse: young and old, tech-savvy and first-time smartphone users, speaking dozens of different languages, and often traveling in large, easily separated family groups.</p>
              <p>In this massive, dynamic environment, traditional methods of assistance fall short.</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 animate-fade-in-right">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">Our Solution: More Than an App</h2>
            <div className="text-gray-600 dark:text-gray-400 space-y-4">
                <p>Instead of a single-purpose tool, we built an AI-powered, hyperlocal, multilingual digital companion. "Simhastha Sahayata" stands apart by focusing on proactive assistance and human connection, moving beyond the reactive nature of simple lost-and-found systems.</p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="text-center mb-16">
           <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">Key Features that Make a Difference</h2>
           <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">Our platform is built on pillars of proactive safety, intelligent assistance, and radical inclusivity.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<HeartIcon />}
            title="Proactive Family Safety"
            description="The Family Hub isn't just for finding lost members; it's designed to prevent separation in the first place with live location tracking and SOS alerts."
          />
          <FeatureCard
            icon={<MapIcon />}
            title="Intelligent Navigation"
            description="Beyond static maps, we provide crowd-aware, voice-driven navigation on a custom map built for the event's unique layout."
          />
          <FeatureCard
            icon={<ArchiveIcon />}
            title="Effortless Reporting"
            description="Report lost items or people in seconds using your voice, text, or by simply uploading a photo and letting our AI handle the details."
          />
          <FeatureCard
            icon={<SparklesIcon />}
            title="AI Pilgrim Guide"
            description="A personal, multilingual guide that provides spiritual context, logistical help, and answers any question about the Kumbh."
          />
        </div>

        {/* Powered by Section */}
        <div className="text-center mt-20 pt-10 border-t border-gray-200 dark:border-gray-700">
           <p className="text-gray-600 dark:text-gray-400">Simhastha Sahayata is proudly developed by</p>
           <p className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-2">Transfigure Technologies Pvt Ltd</p>
        </div>

      </div>
    </div>
  );
};

export default AboutUsPage;
