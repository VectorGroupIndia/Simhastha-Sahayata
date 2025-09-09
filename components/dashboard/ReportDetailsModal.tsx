import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { LostFoundReport, UserRole } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { useLocalization } from '../../hooks/useLocalization';
import { MapModal } from '../ui/MapModal';
import { ImageZoomModal } from '../ui/ImageZoomModal';
import { generateReportPdf } from '../../services/pdfService';

interface ReportDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: LostFoundReport | null;
  onUpdateStatus?: (reportId: string, newStatus: LostFoundReport['status']) => void;
}

const DetailRow: React.FC<{ label: string; value?: string | null }> = ({ label, value }) => {
    if (!value) return null;
    return (
        <div>
            <p className="text-xs text-gray-500">{label}</p>
            <p className="text-md text-gray-800">{value}</p>
        </div>
    );
};

export const ReportDetailsModal: React.FC<ReportDetailsModalProps> = ({ isOpen, onClose, report, onUpdateStatus }) => {
  const { user } = useAuth();
  const { translations } = useLocalization();
  const [isMapOpen, setMapOpen] = useState(false);
  const [isZoomOpen, setZoomOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<LostFoundReport['status']>('Open');

  useEffect(() => {
    if (report) {
      setNewStatus(report.status);
    }
  }, [report]);

  if (!report) return null;

  const handleStatusUpdate = () => {
    if (onUpdateStatus) {
      onUpdateStatus(report.id, newStatus);
      onClose();
    }
  };

  const canUpdateStatus = user && (user.role === UserRole.ADMIN || user.role === UserRole.AUTHORITY);

  const getStatusClasses = (status: LostFoundReport['status']) => {
        switch (status) {
            case 'Open': return 'bg-yellow-200 text-yellow-800';
            case 'In Progress': return 'bg-blue-200 text-blue-800';
            case 'Resolved': return 'bg-green-200 text-green-800';
            default: return 'bg-gray-200 text-gray-800';
        }
    };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title={translations.reportDetails.title}>
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {report.imageUrl && (
                    <div className="md:col-span-1">
                        <p className="text-center text-xs text-gray-400 mb-1">{translations.reportDetails.imageZoom}</p>
                        <img 
                            src={report.imageUrl} 
                            alt="Report" 
                            className="rounded-lg shadow-md w-full object-cover aspect-square cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => setZoomOpen(true)}
                        />
                    </div>
                )}
                 <div className={`space-y-3 ${report.imageUrl ? 'md:col-span-2' : 'md:col-span-3'}`}>
                    <div className="flex justify-between items-center">
                        <h3 className="text-2xl font-bold text-orange-600">{report.personName || report.itemName}</h3>
                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusClasses(report.status)}`}>
                            {report.status}
                        </span>
                    </div>
                    <DetailRow label={translations.myReports.id} value={report.id} />
                    <DetailRow label={translations.report.type} value={report.type} />
                    <DetailRow label={translations.report.category} value={report.category} />
                    <DetailRow label={translations.myReports.reportedOn} value={new Date(report.timestamp).toLocaleString()} />
                    <DetailRow label={translations.reportDetails.reportedBy} value={report.reportedBy} />
                    <hr/>
                    <DetailRow label={translations.report.personAge} value={report.personAge} />
                    <DetailRow label={translations.report.personGender} value={report.personGender} />
                    <DetailRow label={translations.report.clothingAppearance} value={report.clothingAppearance} />
                    <DetailRow label={translations.report.itemBrand} value={report.itemBrand} />
                    <DetailRow label={translations.report.itemColor} value={report.itemColor} />
                    <DetailRow label={translations.report.identifyingMarks} value={report.identifyingMarks} />
                    <DetailRow label={translations.report.lastSeen} value={report.lastSeen} />
                    <DetailRow label={translations.report.description} value={report.description} />
                 </div>
            </div>
            {canUpdateStatus && onUpdateStatus && (
                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                    <h4 className="font-semibold mb-2">{translations.reportDetails.updateStatus}</h4>
                    <div className="flex gap-4 items-center">
                        <select 
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value as LostFoundReport['status'])}
                            className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                        >
                            <option value="Open">Open</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                        </select>
                        <Button onClick={handleStatusUpdate} disabled={newStatus === report.status}>
                            {translations.reportDetails.saveStatus}
                        </Button>
                    </div>
                </div>
            )}
             <div className="mt-6 flex justify-end gap-2">
                <Button onClick={() => setMapOpen(true)} variant="secondary" disabled={!report.locationCoords}>
                    {translations.reportDetails.viewOnMap}
                </Button>
                <Button onClick={() => generateReportPdf(report)} variant="secondary">
                    {translations.reportDetails.downloadPdf}
                </Button>
            </div>
        </div>
      </Modal>

      {report.imageUrl && (
        <ImageZoomModal 
            isOpen={isZoomOpen}
            onClose={() => setZoomOpen(false)}
            imageUrl={report.imageUrl}
        />
      )}

      <MapModal 
        isOpen={isMapOpen}
        onClose={() => setMapOpen(false)}
        locationName={report.lastSeen}
        locationCoords={report.locationCoords}
      />
    </>
  );
};

export default ReportDetailsModal;