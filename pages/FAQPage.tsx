
import React, { useState } from 'react';
import { Card } from '../components/ui/Card';

interface FAQItemProps {
  question: string;
  children: React.ReactNode;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left py-4"
      >
        <span className="font-semibold text-lg text-gray-800">{question}</span>
        <svg
          className={`w-6 h-6 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      {isOpen && (
        <div className="pb-4 pr-4 text-gray-600">
          {children}
        </div>
      )}
    </div>
  );
};

const FAQPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Card className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-orange-600">Frequently Asked Questions</h1>
        <div className="space-y-2">
          <FAQItem question="What is Simhastha Sahayata?">
            <p>Simhastha Sahayata is an AI-powered digital companion designed to make your pilgrimage to the Ujjain Mahakumbh safer and more fulfilling. It helps with safety through family location tracking, provides intelligent navigation to avoid crowds, and acts as a multilingual guide for all your questions.</p>
          </FAQItem>
          <FAQItem question="Is the app free to use?">
            <p>Yes, the Simhastha Sahayata app is completely free for all pilgrims, volunteers, and authorities to use.</p>
          </FAQItem>
          <FAQItem question="How does the 'Family Hub' feature work?">
            <p>You can create a private group and invite your family members. Once they join, you can see each other's location on a map of the Mela grounds. You can also set safe zones and receive alerts if someone wanders off, or use the SOS button in an emergency.</p>
          </FAQItem>
          <FAQItem question="What languages does the app support?">
            <p>The app supports multiple Indian languages including English, Hindi, Marathi, Gujarati, and more. You can select your preferred language from the menu for both the app interface and the AI guide.</p>
          </FAQItem>
          <FAQItem question="How do I report a lost person or item?">
            <p>Click on the "Report Lost or Found" button on the home page. If you are not logged in, you will be prompted to do so. Then, follow the simple on-screen instructions to file your report.</p>
          </FAQItem>
        </div>
      </Card>
    </div>
  );
};

export default FAQPage;
