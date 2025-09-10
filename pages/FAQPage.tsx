import React, { useState } from 'react';
import { Card } from '../components/ui/Card';

interface FAQItemProps {
  question: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClick: () => void;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, children, isOpen, onClick }) => {
  return (
    <div className="border-b dark:border-gray-700">
      <button
        onClick={onClick}
        className="w-full flex justify-between items-center text-left py-4"
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-lg text-gray-800 dark:text-gray-200">{question}</span>
        <svg
          className={`w-6 h-6 transform transition-transform text-gray-500 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      {isOpen && (
        <div className="pb-4 pr-4 text-gray-600 dark:text-gray-400 prose prose-sm dark:prose-invert max-w-none">
          {children}
        </div>
      )}
    </div>
  );
};

const FAQContent = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);
  const faqs = [
    {
      q: "What is Simhastha Sahayata?",
      a: <p>Simhastha Sahayata is an AI-powered digital companion designed to make your pilgrimage to the Ujjain Mahakumbh safer and more fulfilling. It helps with safety through family location tracking, provides intelligent navigation to avoid crowds, and acts as a multilingual guide for all your questions.</p>
    },
    {
      q: "Is the app free to use?",
      a: <p>Yes, the Simhastha Sahayata app is completely free for all pilgrims, volunteers, and authorities to use.</p>
    },
    {
      q: "How does the 'Family Hub' feature work?",
      a: <p>You can create a private group and invite your family members using a unique link. Once they join, you can see each other's live location on a map of the Mela grounds. This feature is designed to prevent separation and help you reunite quickly if needed. You can also trigger an SOS that alerts your family group first.</p>
    },
    {
        q: "What happens when I press the SOS button?",
        a: <p>Pressing the SOS button immediately shares your location with your emergency contacts, your family hub group, and alerts the nearest volunteers and authorities. It is a critical emergency feature and should only be used in genuine situations of distress.</p>
    },
    {
      q: "How do I report a lost person or item?",
      a: <p>Click on the "Report Lost or Found" button from the Home page or Dashboard. You can fill in the details manually, or use our AI features by describing the situation in your own words or by uploading a photo for analysis. The report is then instantly shared with the operational team.</p>
    },
    {
        q: "Is my location data safe?",
        a: <p>Yes. We take your privacy very seriously. Your location data is encrypted and is only shared with your private family group, or with authorities/volunteers in case of an SOS alert. Please see our full Privacy Policy for more details.</p>
    },
    {
        q: "As a volunteer, how do I get assignments?",
        a: <p>In your Volunteer Dashboard, you'll see a "Live Alerts" tab showing high-priority, unassigned cases near you. You can choose to accept a task, and it will be moved to your "My Assignments" tab. You will also receive push notifications for alerts based on your profile settings.</p>
    }
  ];

  return (
      <div className="space-y-2">
          {faqs.map((faq, index) => (
               <FAQItem 
                key={index} 
                question={faq.q} 
                isOpen={openFAQ === index}
                onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
               >
                   {faq.a}
               </FAQItem>
          ))}
      </div>
  )
}

const PrivacyPolicyContent = () => (
    <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
        <p><em>Last Updated: {new Date().toLocaleDateString()}</em></p>
        <p>Your privacy is critically important to us. This Privacy Policy outlines the types of information we collect and how we use it.</p>

        <h4>1. Information We Collect</h4>
        <ul>
            <li><strong>Personal Information:</strong> When you register, we collect basic information like your name and contact details.</li>
            <li><strong>Location Data:</strong> With your permission, we collect your real-time location data to enable safety features like the Family Hub, SOS alerts, and navigation.</li>
            <li><strong>Report Data:</strong> Information you provide in Lost & Found reports, including descriptions and images.</li>
            <li><strong>Usage Data:</strong> We may collect data on how you interact with our app to improve our services.</li>
        </ul>

        <h4>2. How We Use Your Information</h4>
        <ul>
            <li>To provide core services like location sharing within your private Family Hub group.</li>
            <li>To broadcast your location to registered volunteers and authorities during an SOS event.</li>
            <li>To manage and resolve Lost & Found reports.</li>
            <li>To provide you with relevant AI-powered guidance and navigation.</li>
        </ul>

        <h4>3. Data Sharing</h4>
        <p>We do not sell your personal data. We only share information under these limited circumstances:</p>
        <ul>
            <li>With members of your private Family Hub group, as controlled by you.</li>
            <li>With official authorities and registered volunteers when you trigger an SOS alert.</li>
            <li>Anonymized and aggregated data may be used for crowd management and statistical analysis.</li>
        </ul>

        <h4>4. Data Security</h4>
        <p>We use industry-standard encryption and security measures to protect your data from unauthorized access.</p>

        <h4>5. Your Rights</h4>
        <p>You can manage your app permissions, including location, camera, and microphone access, at any time in your Profile settings.</p>
    </div>
);

const TermsContent = () => (
    <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
        <p><em>Last Updated: {new Date().toLocaleDateString()}</em></p>
        <p>By downloading and using the Simhastha Sahayata application, you agree to these Terms of Service.</p>

        <h4>1. Use of the Service</h4>
        <p>This app is provided as a public service to enhance the safety and experience of attendees at the Ujjain Mahakumbh. You agree to use the app responsibly and for its intended purposes.</p>

        <h4>2. User Conduct</h4>
        <p>You agree not to misuse the service, including but not limited to: filing false reports, misusing the SOS feature, or harassing other users. Violation of these terms may result in account suspension.</p>

        <h4>3. Disclaimers</h4>
        <p>The service is provided "as is." While we strive for accuracy and reliability, we cannot guarantee the service will be uninterrupted or error-free. Navigation and crowd data are for informational purposes and should be used with discretion.</p>

        <h4>4. Limitation of Liability</h4>
        <p>Simhastha Sahayata and its developers will not be liable for any damages or loss resulting from your use of or inability to use the service.</p>
    </div>
);

const CommunityGuidelinesContent = () => (
    <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
        <p>Our goal is to create a safe, supportive, and helpful community. We expect all users—pilgrims, volunteers, and authorities—to adhere to these guidelines.</p>

        <h4>1. Be Truthful and Accurate</h4>
        <p>When filing a report, provide information that is accurate to the best of your knowledge. False reports waste valuable time and resources that could be used to help someone in genuine need.</p>

        <h4>2. Use the SOS Feature Responsibly</h4>
        <p>The SOS button is for emergencies only. Misusing this feature can divert emergency responders from real crises and may lead to suspension of your account.</p>

        <h4>3. Be Respectful</h4>
        <p>When interacting with volunteers or authorities through the app, please be respectful and courteous. Abusive language or behavior will not be tolerated.</p>
        
        <h4>4. Protect Your Privacy</h4>
        <p>Do not share personal information like phone numbers or home addresses in public descriptions of reports. Share necessary contact details only when communicating directly with an assigned volunteer or authority figure.</p>
    </div>
);


const FAQPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('faq');
  
  const sections = [
      { id: 'faq', title: 'Frequently Asked Questions' },
      { id: 'privacy', title: 'Privacy Policy' },
      { id: 'terms', title: 'Terms of Service' },
      { id: 'community', title: 'Community Guidelines' },
  ];
  
  const renderContent = () => {
      switch(activeSection) {
          case 'faq': return <FAQContent />;
          case 'privacy': return <PrivacyPolicyContent />;
          case 'terms': return <TermsContent />;
          case 'community': return <CommunityGuidelinesContent />;
          default: return <FAQContent />;
      }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-orange-600">Help & Policies Center</h1>
      </div>
      <Card className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
            {/* Left Side Menu */}
            <aside className="md:w-1/4">
                <nav className="space-y-2">
                    {sections.map(section => (
                        <button 
                            key={section.id} 
                            onClick={() => setActiveSection(section.id)}
                            className={`w-full text-left px-4 py-2 rounded-lg text-lg transition-colors ${
                                activeSection === section.id 
                                ? 'bg-orange-500 text-white font-semibold' 
                                : 'text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-gray-700'
                            }`}
                        >
                            {section.title}
                        </button>
                    ))}
                </nav>
            </aside>
            {/* Right Side Details Pane */}
            <main className="flex-grow md:w-3/4 md:pl-8 md:border-l md:dark:border-gray-700">
                 <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                    {sections.find(s => s.id === activeSection)?.title}
                </h2>
                <div className="animate-fade-in">
                    {renderContent()}
                </div>
            </main>
        </div>
      </Card>
    </div>
  );
};

export default FAQPage;