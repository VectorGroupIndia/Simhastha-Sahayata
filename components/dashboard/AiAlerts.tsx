import React, { useMemo, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useLocalization } from '../../hooks/useLocalization';
import { MOCK_LOST_FOUND_REPORTS } from '../../data/mockData';
import { LostFoundReport } from '../../types';
import { Card } from '../ui/Card';
import ReportDetailsModal from './ReportDetailsModal';
import { Button } from '../ui/Button';

// A simple "AI" function to check for potential matches
const findPotentialMatches = (
  myReports: LostFoundReport[],
  allReports: LostFoundReport[]
): { myReport: LostFoundReport; foundReport: LostFoundReport }[] => {
  const myLostReports = myReports.filter((r) => r.type === 'Lost');
  const allFoundReports = allReports.filter((r) => r.type === 'Found');
  const matches = [];

  for (const lostReport of myLostReports) {
    for (const foundReport of allFoundReports) {
      // Don't match with self
      if (lostReport.reportedById === foundReport.reportedById) continue;

      let score = 0;
      // Rule 1: Must be same category
      if (lostReport.category !== foundReport.category) continue;
      
      const lostText = `${lostReport.itemName || ''} ${lostReport.description} ${lostReport.itemColor || ''}`.toLowerCase();
      const foundText = `${foundReport.itemName || ''} ${foundReport.description} ${foundReport.itemColor || ''}`.toLowerCase();

      // Rule 2: Check for color match if item
      if(lostReport.category === 'Item' && lostReport.itemColor && foundReport.itemColor && lostReport.itemColor.toLowerCase() === foundReport.itemColor.toLowerCase()) {
        score += 2;
      }

      // Rule 3: Check for keywords
      const lostKeywords = (lostReport.itemName?.toLowerCase() || '').split(' ');
      if (lostKeywords.some(kw => kw.length > 2 && foundText.includes(kw))) {
        score += 3;
      }
      
      if (score > 3) {
        matches.push({ myReport: lostReport, foundReport });
        // Stop after finding one match per lost report for simplicity
        break; 
      }
    }
  }
  return matches;
};

const AiAlerts: React.FC = () => {
  const { user } = useAuth();
  const { translations } = useLocalization();
  const [selectedReport, setSelectedReport] = useState<LostFoundReport | null>(null);

  const myReports = useMemo(() => {
    if (!user) return [];
    return MOCK_LOST_FOUND_REPORTS.filter((report) => report.reportedById === user.id);
  }, [user]);

  const potentialMatches = useMemo(() => {
    return findPotentialMatches(myReports, MOCK_LOST_FOUND_REPORTS);
  }, [myReports]);
  
  const openDetailsModal = (report: LostFoundReport) => setSelectedReport(report);
  const closeDetailsModal = () => setSelectedReport(null);


  if (potentialMatches.length === 0) {
    return null; // Don't render anything if no alerts
  }

  return (
    <>
      <Card>
        <h3 className="text-xl font-bold mb-4">{translations.dashboard.aiAlerts.title}</h3>
        <div className="space-y-4">
          {potentialMatches.map(({ myReport, foundReport }, index) => (
            <div key={index} className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg">
              <p className="font-semibold text-orange-700">{translations.dashboard.aiAlerts.potentialMatch}</p>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* My Report */}
                <div>
                  <p className="text-sm font-bold">{translations.dashboard.aiAlerts.yourReport}:</p>
                  <div className="text-sm p-2 bg-white rounded border">
                    <p className="font-semibold">{myReport.itemName || myReport.personName}</p>
                    <p className="text-gray-600 line-clamp-2">{myReport.description}</p>
                  </div>
                </div>
                {/* Found Report */}
                <div>
                  <p className="text-sm font-bold">{translations.dashboard.aiAlerts.foundReport}:</p>
                  <div className="text-sm p-2 bg-white rounded border">
                     <p className="font-semibold">{foundReport.itemName || foundReport.personName}</p>
                     <p className="text-gray-600 line-clamp-2">{foundReport.description}</p>
                  </div>
                </div>
              </div>
              <div className="text-right mt-2">
                <Button variant="secondary" onClick={() => openDetailsModal(foundReport)}>
                  {translations.myReports.viewDetails}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <ReportDetailsModal
        isOpen={!!selectedReport}
        onClose={closeDetailsModal}
        report={selectedReport}
      />
    </>
  );
};

export default AiAlerts;
