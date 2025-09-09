import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useToast } from '../hooks/useToast';
import { useLocalization } from '../hooks/useLocalization';

const ContactUsPage: React.FC = () => {
  const { addToast } = useToast();
  const { translations } = useLocalization();
  const t = translations.contact || {}; // Fallback for safety

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real app, this would send data to a backend.
    addToast(t.messageSent, 'success');
    e.currentTarget.reset();
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Card className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-orange-600">{t.title}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="space-y-4 text-gray-700">
            <h2 className="text-2xl font-semibold border-b pb-2">{t.getInTouch}</h2>
            <p>
              <strong>{t.email}:</strong> <a href="mailto:support@simhasthasahayata.com" className="text-orange-600 hover:underline">support@simhasthasahayata.com</a>
            </p>
            <p>
              <strong>{t.helpline}:</strong> <a href="tel:1800-XXX-XXXX" className="text-orange-600 hover:underline">1800-XXX-XXXX</a>
            </p>
            <p>
              <strong>{t.address}:</strong><br />
              Simhastha Sahayata Operations Center,<br />
              Near Ram Ghat, Ujjain,<br />
              Madhya Pradesh, India
            </p>
          </div>

          {/* Contact Form */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold border-b pb-2">{t.sendMessage}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">{t.nameLabel}</label>
                <input type="text" id="name" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500" />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">{t.emailLabel}</label>
                <input type="email" id="email" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500" />
              </div>
              <div className="mb-4">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">{t.messageLabel}</label>
                <textarea id="message" rows={4} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"></textarea>
              </div>
              <Button type="submit" className="w-full">{t.sendButton}</Button>
            </form>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ContactUsPage;