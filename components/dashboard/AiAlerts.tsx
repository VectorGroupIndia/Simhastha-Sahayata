import React, { useMemo, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useLocalization } from '../../hooks/useLocalization';
import { MOCK_LOST_FOUND_REPORTS } from '../../data/mockData';
import { LostFoundReport } from '../../types';
import { Card } from '../ui/Card';
import ReportDetailsModal from './ReportDetailsModal';
import { Button } from '../ui/Button';

const calculateMatchScore = (reportA: LostFoundReport, reportB: LostFoundReport): number => {
    let score = 0;
    if (reportA.category !== reportB.category) return 0;

    if (reportA.category === 'Person') {
        const pA = reportA;
        const pB = reportB;
        if (pA.personGender && pB.personGender && pA.personGender === pB.personGender) score += 2;
        if (pA.personAge && pB.personAge) {
            const age1 = parseInt(pA.personAge, 10);
            const age2 = parseInt(pB.personAge, 10);
            if (!isNaN(age1) && !isNaN(age2)) {
                if (Math.abs(age1 - age2) <= 2) score += 4;
                else if (Math.abs(age1 - age2) <= 5) score += 2;
            }
        }
        if (pA.clothingAppearance && pB.clothingAppearance) {
            const keywords = pA.clothingAppearance.toLowerCase().split(' ').filter(w => w.length > 2);
            let matches = 0;
            keywords.forEach(kw => {
                if (pB.clothingAppearance?.toLowerCase().includes(kw)) matches++;
            });
            score += Math.min(matches, 3);
        }
    } else { // 'Item'
        const iA = reportA;
        const iB = reportB;
        if (iA.subCategory && iA.subCategory === iB.subCategory) score += 4;
        if (iA.itemColor && iB.itemColor && iA.itemColor.toLowerCase() === iB.itemColor.toLowerCase()) score += 3;
        if (iA.itemBrand && iB.itemBrand && iA.itemBrand.toLowerCase() === iB.itemBrand.toLowerCase()) score += 5;

        const descA = `${iA.itemName || ''} ${iA.description}`.toLowerCase();
        const descB = `${iB.itemName || ''} ${iB.description}`.toLowerCase();
        const keywordsA = new Set(descA.split(' ').filter(w => w.length > 3));
        let commonKeywords = 0;
        keywordsA.forEach(kw => {
            if (descB.includes(kw)) commonKeywords++;
        });
        score += Math.min(commonKeywords, 4);
    }

    if (reportA.lastSeen && reportB.lastSeen && reportA.lastSeen.toLowerCase() === reportB.lastSeen.toLowerCase()) {
        score += 3;
    }
    return score;
};


// A more advanced "AI" function to check for potential matches
const findPotentialMatches = (
  myReports: LostFoundReport[],
  allReports: LostFoundReport[]
): { myReport: LostFoundReport; foundReport: LostFoundReport; confidence: 'High' | 'Medium' | 'Low' }[] => {
  const myLostReports = myReports.filter((r) => r.type === 'Lost' && r.status === 'Open');
  const myFoundReports = myReports.filter((r) => r.type === 'Found' && r.status === 'Open');
  
  const allFoundReports = allReports.filter((r) => r.type === 'Found' && r.status === 'Open');
  const allLostReports = allReports.filter((r) => r.type === 'Lost' && r.status === 'Open');

  const matches: { myReport: LostFoundReport; foundReport: LostFoundReport; confidence: 'High' | 'Medium' | 'Low' }[] = [];

  // Match my LOST reports with all FOUND reports
  for (const lost of myLostReports) {
    for (const found of allFoundReports) {
      if (lost.reportedById === found.reportedById) continue;
      const score = calculateMatchScore(lost, found);
      
      if (score >= 5) {
        let confidence: 'High' | 'Medium' | 'Low' = 'Low';
        if (score > 8) confidence = 'High';
        else if (score > 5) confidence = 'Medium';
        matches.push({ myReport: lost, foundReport: found, confidence });
      }
    }
  }

  // Match my FOUND reports with all LOST reports
  for (const found of myFoundReports) {
    for (const lost of allLostReports) {
      if (found.reportedById === lost.reportedById) continue;
      const score = calculateMatchScore(found, lost);

      if (score >= 5) {
          let confidence: 'High' | 'Medium' | 'Low' = 'Low';
          if (score > 8) confidence = 'High';
          else if (score > 5) confidence = 'Medium';
          matches.push({ myReport: found, foundReport: lost, confidence });
      }
    }
  }


  return matches.sort((a,b) => { // Sort by confidence
      const order = { 'High': 3, 'Medium': 2, 'Low': 1 };
      return order[b.confidence] - order[a.confidence];
  });
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
  
  const getConfidenceClass = (confidence: 'High' | 'Medium' | 'Low') => {
      switch(confidence) {
          case 'High': return 'text-green-600 bg-green-100';
          case 'Medium': return 'text-yellow-600 bg-yellow-100';
          case 'Low': return 'text-gray-600 bg-gray-100';
      }
  }


  if (potentialMatches.length === 0) {
    return null; // Don't render anything if no alerts
  }

  return (
    <>
      <Card>
        <h3 className="text-xl font-bold mb-4">{translations.dashboard.aiAlerts.title}</h3>
        <div className="space-y-4">
          {potentialMatches.map(({ myReport, foundReport, confidence }, index) => (
            <div key={index} className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg">
                <div className="flex justify-between items-start">
                    <p className="font-semibold text-orange-700">{translations.dashboard.aiAlerts.potentialMatch}</p>
                    <div className="text-xs font-bold px-2 py-1 rounded-full">
                        {translations.dashboard.aiAlerts.matchConfidence}: <span className={getConfidenceClass(confidence)}>{translations.dashboard.aiAlerts[confidence.toLowerCase()]}</span>
                    </div>
                </div>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* My Report */}
                <div>
                  <p className="text-sm font-bold">{translations.dashboard.aiAlerts.yourReport} ({myReport.type}):</p>
                  <div className="text-sm p-2 bg-white rounded border">
                    <p className="font-semibold">{myReport.itemName || myReport.personName}</p>
                    <p className="text-gray-600 line-clamp-2">{myReport.description}</p>
                  </div>
                </div>
                {/* Found Report */}
                <div>
                  <p className="text-sm font-bold">{translations.dashboard.aiAlerts.foundReport} ({foundReport.type}):</p>
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