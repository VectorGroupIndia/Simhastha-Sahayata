
import React from 'react';
import { Card } from '../components/ui/Card';

const AboutUsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Card className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-6 text-orange-600">About Simhastha Sahayata</h1>
        <div className="prose lg:prose-xl max-w-none text-gray-700 space-y-4">
          <p>
            The Ujjain Mahakumbh is not just an event; it's a temporary mega-city populated by millions. The attendees are incredibly diverse: young and old, tech-savvy and first-time smartphone users, speaking dozens of different languages, and often traveling in large, easily separated family groups.
          </p>
          <h2 className="text-2xl font-semibold text-gray-800">Our Vision</h2>
          <p>
            Instead of a single-purpose tool, we built an AI-powered, hyperlocal, multilingual digital companion. The name "Simhastha Sahayata" (Simhastha Assistance) perfectly captures this broader vision. Our app stands apart by focusing on proactive assistance and human connection, moving beyond the reactive nature of a simple lost-and-found system.
          </p>
          <h2 className="text-2xl font-semibold text-gray-800">Our Differentiators</h2>
          <ul>
            <li>
              <strong>From Reactive to Proactive:</strong> We're not just finding lost items; we're preventing families from getting lost in the first place with the Family Hub. This is a far more emotional and critical problem to solve.
            </li>
            <li>
              <strong>Beyond Static Maps:</strong> We provide intelligent, crowd-aware, voice-driven navigation on a map built specifically for the event's unique geography.
            </li>
            <li>
              <strong>A True Companion:</strong> We are creating a personal, multilingual guide that provides spiritual context, logistical help, and emergency assistance, making the pilgrimage safer and more fulfilling.
            </li>
             <li>
              <strong>Radical Inclusivity:</strong> With a voice-first, multilingual interface, our app is usable by a much wider demographic than any competitor.
            </li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default AboutUsPage;
