import React, { useState } from 'react';
import { LostFoundReport } from '../../types';
import { useLocalization } from '../../hooks/useLocalization';
import { Button } from '../ui/Button';

interface ReportsMapViewProps {
  reports: LostFoundReport[];
  onSelectReport: (report: LostFoundReport) => void;
}

const LocationPin: React.FC<{ report: LostFoundReport; onSelect: () => void; isActive: boolean }> = ({ report, onSelect, isActive }) => {
  if (!report.locationCoords) return null;

  const pinColor = report.status === 'Resolved' ? 'gray' : report.type === 'Lost' ? 'red' : 'blue';

  return (
    <div
      className="absolute"
      style={{
        top: `${report.locationCoords.lat}%`,
        left: `${report.locationCoords.lng}%`,
        transform: 'translate(-50%, -100%)',
        zIndex: isActive ? 10 : 1,
      }}
      onClick={onSelect}
    >
      <div className="relative flex flex-col items-center cursor-pointer group">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-8 w-8 text-${pinColor}-500 drop-shadow-lg transition-transform group-hover:scale-110 ${isActive ? 'scale-125' : ''}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.05 4.05a7 7 0 119.9 9.9L10 20l-4.95-5.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
            clipRule="evenodd"
          />
        </svg>
        <div className="bg-white text-xs px-1.5 py-0.5 rounded-full shadow -mt-1 whitespace-nowrap">
          {report.personName || report.itemName}
        </div>
      </div>
    </div>
  );
};


const ReportPopover: React.FC<{ report: LostFoundReport; onClose: () => void; onViewDetails: () => void; translations: any }> = ({ report, onClose, onViewDetails, translations }) => {
    if (!report.locationCoords) return null;
    return (
        <div 
            className="absolute p-3 bg-white rounded-lg shadow-xl border animate-fade-in-up"
            style={{ 
                top: `${report.locationCoords.lat}%`, 
                left: `${report.locationCoords.lng}%`, 
                transform: 'translate(-50%, -115%)',
                zIndex: 20,
                width: '250px'
            }}
            onClick={e => e.stopPropagation()}
        >
            <button onClick={onClose} className="absolute -top-2 -right-2 bg-white rounded-full text-gray-600 w-6 h-6 flex items-center justify-center shadow">&times;</button>
            <h4 className="font-bold text-orange-600 truncate">{report.personName || report.itemName}</h4>
            <p className="text-sm text-gray-600 truncate">{report.description}</p>
            <p className="text-xs text-gray-500 mt-1">{translations.filterBar.statusLabel}: {report.status}</p>
            <Button onClick={onViewDetails} variant="secondary" className="w-full mt-3 text-sm py-1 h-auto">{translations.myReports.viewDetails}</Button>
        </div>
    )
};


export const ReportsMapView: React.FC<ReportsMapViewProps> = ({ reports, onSelectReport }) => {
  const { translations } = useLocalization();
  const [activePin, setActivePin] = useState<LostFoundReport | null>(null);
  const geolocatedReports = reports.filter(r => !!r.locationCoords);

  const handleSelectPin = (report: LostFoundReport) => {
      setActivePin(report);
  }
  
  const handleViewDetails = () => {
      if (activePin) {
          onSelectReport(activePin);
          setActivePin(null);
      }
  }

  return (
    <div className="aspect-video bg-gray-200 rounded-lg relative overflow-hidden">
      <img src="https://i.imgur.com/3Z3tV8C.png" alt="Map of Kumbh Mela area" className="w-full h-full object-cover" />
      {geolocatedReports.map(report => (
        <LocationPin 
            key={report.id} 
            report={report} 
            onSelect={() => handleSelectPin(report)} 
            isActive={activePin?.id === report.id}
        />
      ))}
      {activePin && (
          <ReportPopover 
            report={activePin} 
            onClose={() => setActivePin(null)} 
            onViewDetails={handleViewDetails}
            translations={translations}
          />
      )}
    </div>
  );
};